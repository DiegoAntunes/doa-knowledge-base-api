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

  static create(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt' | 'version'>): ITopic {
    const newTopic: ITopic = {
      ...data,
      id: uuidv4(),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const topics = readData();
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
