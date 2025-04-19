import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from '../models/Resource';

const filePath = path.join(__dirname, '../database/resource.json');

function readData(): Resource[] {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

function writeData(data: Resource[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
