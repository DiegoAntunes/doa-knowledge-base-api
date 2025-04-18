import fs from 'fs';
import path from 'path';
import { Topic, ITopic } from '../models/Topic';

const dbPath = path.resolve(__dirname, '../database/topic.json');

function readData(): ITopic[] {
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
}
