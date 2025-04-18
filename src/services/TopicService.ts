import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ITopic } from '../models/Topic';

const dbPath = path.resolve(__dirname, '../database/topic.json');

function readData(): ITopic[] {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]');
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
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
  
  static create(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'originalId'>): ITopic {
    const topics = readData();
  
    // Validation of parent topic if provided
    if (data.parentTopicId && !topics.find(t => t.id === data.parentTopicId)) {
      throw new Error('Parent topic not found');
    }
  
    const newId = uuidv4();
    const now = new Date();
    const newTopic: ITopic = {
      ...data,
      id: newId,
      originalId: newId,
      version: 1,
      createdAt: now,
      updatedAt: now
    };
  
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
  
    const newTopic: ITopic = {
      ...current,
      ...data,
      id: uuidv4(),
      version: latestVersion + 1,
      originalId: current.originalId,
      createdAt: current.createdAt,
      updatedAt: new Date(),
    };
  
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
