import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from '../models/Resource';

const dbPath = process.env.NODE_ENV === 'test'
  ? path.join(__dirname, '../../test/database/resource.test.json')
  : path.join(__dirname, '../database/resource.json');

  function readData(): Resource[] {
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]', 'utf-8');
    const raw = fs.readFileSync(dbPath, 'utf-8').trim();
    if (!raw) return [];
    try {
      return JSON.parse(raw).map((resource: any) => ({
        ...resource,
        createdAt: new Date(resource.createdAt),
        updatedAt: new Date(resource.updatedAt),
      }));
    } catch (err) {
      console.error('[ResourceService] Failed to parse resource data:', err);
      return [];
    }
  }

function writeData(data: Resource[]) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const ResourceService = {
  getAll(): Resource[] {
    return readData();
  },

  getById(id: string): Resource | undefined {
    return readData().find(r => r.id === id);
  },

  getByTopicId(topicId: string): Resource[] {
    return readData().filter(r => r.topicId === topicId);
  },

  create(resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Resource {
    const newResource: Resource = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...resourceData,
    };
    const data = readData();
    data.push(newResource);
    writeData(data);
    return newResource;
  },

  update(id: string, updates: Partial<Omit<Resource, 'id' | 'createdAt'>>): Resource | undefined {
    const data = readData();
    const index = data.findIndex(r => r.id === id);
    if (index === -1) return;

    data[index] = { ...data[index], ...updates, updatedAt: new Date() };
    writeData(data);
    return data[index];
  },

  delete(id: string): boolean {
    const data = readData();
    const index = data.findIndex(r => r.id === id);
    if (index === -1) return false;

    data.splice(index, 1);
    writeData(data);
    return true;
  }
};
