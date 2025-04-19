import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from '../models/Resource';

//const dbPath = path.join(__dirname, '../database/resource.json');
const dbPath = path.join(__dirname, '../../test/database/resource.test.json');


function readData(): Resource[] {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));
  const rawData = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(rawData).map((resource: any) => ({
    ...resource,
    createdAt: new Date(resource.createdAt),
    updatedAt: new Date(resource.updatedAt)
  }));
}

function writeData(data: Resource[]) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
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
