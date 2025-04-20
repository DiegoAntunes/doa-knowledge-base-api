import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ITopic } from '../models/Topic';
import { TopicComposite } from '../composite/TopicComposite';
import { TopicVersionFactory } from '../factories/TopicVersionFactory';

const dbPath = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../../test/database/topic.test.json')
  : path.resolve(__dirname, '../database/topic.json');

const factory = new TopicVersionFactory();

function readData(): ITopic[] {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]', 'utf-8');
  }
  const raw = fs.readFileSync(dbPath, 'utf-8').trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw).map((topic: any) => ({
      ...topic,
      createdAt: new Date(topic.createdAt),
      updatedAt: new Date(topic.updatedAt),
    }));
  } catch (err) {
    console.error('[TopicService] Failed to parse topic data:', err);
    return [];
  }
}

function writeData(data: ITopic[]) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export class TopicService {
  static getAll(): ITopic[] {
    return readData();
  }

  static getById(id: string): ITopic | undefined {
    return readData().find(t => t.id === id);
  }

  static getChildren(parentTopicId: string): ITopic[] {
    return readData().filter(t => t.parentTopicId === parentTopicId);
  }

  static getHierarchy(): ITopic[] {
    const topics = readData();

    function normalizeParentId(id: string | null | undefined): string | null {
      return id && id.trim() !== '' ? id : null;
    }

    function buildTree(parentId?: string): (ITopic & { children: ITopic[] })[] {
      const normalizedParentId = normalizeParentId(parentId);

      return topics
        .filter(t => normalizeParentId(t.parentTopicId) === normalizedParentId)
        .map(t => ({
          ...t,
          children: buildTree(t.id)
        }));
    }
  
    return buildTree(); // Start with topics that have no parent
  }

  static getVersions(originalOrCurrentId: string): ITopic[] {
    const topics = readData();
    const topic = topics.find(t => t.id === originalOrCurrentId || t.originalId === originalOrCurrentId);
    if (!topic) return [];
    return topics
      .filter(t => t.originalId === topic.originalId)
      .sort((a, b) => a.version - b.version);
  }

  static getSpecificVersion(id: string, version: number): ITopic | undefined {
    const topics = readData();
    const topic = topics.find(t => t.id === id || t.originalId === id);
    if (!topic) return undefined;
  
    return topics.find(
      t => t.originalId === topic.originalId && t.version === version
    );
  }

  static getTopicTree(id: string): any | null {
    const topics = readData();
    const root = topics.find(t => t.id === id);
    if (!root) return null;
  
    function buildTree(topic: ITopic): any {
      const children = topics
        .filter(t => t.parentTopicId === topic.id)
        .map(child => buildTree(child));
  
      return {
        ...topic,
        children
      };
    }
  
    return buildTree(root);
  }

  static getTreeComposite(id: string): any | null {
    const topics = readData();
    const rootTopic = topics.find(t => t.id === id);
    if (!rootTopic) return null;
  
    const topicMap = new Map<string, TopicComposite>();
    topics.forEach(t => topicMap.set(t.id, new TopicComposite(t)));
  
    // Relates the children
    topics.forEach(t => {
      if (t.parentTopicId) {
        const parent = topicMap.get(t.parentTopicId);
        const child = topicMap.get(t.id);
        if (parent && child) {
          parent.addChild(child);
        }
      }
    });
  
    const root = topicMap.get(id);
    return root?.toJSON();
  }
  
  static getShortestPath(fromId: string, toId: string): ITopic[] | null {
    const topics = readData();
  
    // Maps all topics by ID for quick access
    const topicMap = new Map<string, ITopic>();
    topics.forEach(topic => topicMap.set(topic.id, topic));
  
    // Checks if both topics exist
    const fromTopic = topicMap.get(fromId);
    const toTopic = topicMap.get(toId);
    if (!fromTopic || !toTopic) return null;
  
    // Assemble the neighborhood structure (undirected graph: parent <-> child)
    const graph = new Map<string, string[]>();
    topics.forEach(topic => {
      if (!graph.has(topic.id)) graph.set(topic.id, []);
      if (topic.parentTopicId) {
        // Bidirectional connection: parent -> child and child -> parent
        graph.get(topic.id)!.push(topic.parentTopicId);
        if (!graph.has(topic.parentTopicId)) graph.set(topic.parentTopicId, []);
        graph.get(topic.parentTopicId)!.push(topic.id);
      }
    });
  
    // BFS (Breadth-First Search) algorithm for finding the shortest path
    const queue: string[][] = [[fromId]]; // Path queue (sequence of IDs)
    const visited = new Set<string>();
  
    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];
  
      if (current === toId) {
        // Path found → returns matching topics
        return path.map(id => topicMap.get(id)!);
      }
  
      if (!visited.has(current)) {
        visited.add(current);
        const neighbors = graph.get(current) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push([...path, neighbor]);
          }
        }
      }
    }
  
    // Didn't find a way
    return null;
  }

  static create(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'originalId'>): ITopic {
    const topics = readData();
  
    // Validation of parent topic if provided
    if (data.parentTopicId && !topics.find(t => t.id === data.parentTopicId)) {
      throw new Error('Parent topic not found');
    }
  
    const newTopic = factory.createInitial(data);

    topics.push(newTopic);
    writeData(topics);
    return newTopic;
  }

  static update(id: string, data: Partial<Omit<ITopic, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'originalId'>>): ITopic | null {
    const topics = readData();
    const current = topics.find(t => t.id === id);
    if (!current) return null;
  
    const versions = topics.filter(t => t.originalId === current.originalId);
    const latestVersion = Math.max(...versions.map(t => t.version));
  
    const newTopic = factory.createVersion(current, data, latestVersion);

    topics.push(newTopic);
    writeData(topics);
    return newTopic;
  }
  
  static delete(id: string): boolean {
    const topics = readData();
    const index = topics.findIndex(t => t.id === id);
    if (index === -1) return false;
    topics.splice(index, 1);
    writeData(topics);
    return true;
  }
}
