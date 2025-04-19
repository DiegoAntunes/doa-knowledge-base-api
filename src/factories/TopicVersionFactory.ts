import { ITopic } from '../models/Topic';
import { ITopicFactory } from './ITopicFactory';
import { v4 as uuidv4 } from 'uuid';

export class TopicVersionFactory implements ITopicFactory {

  createInitial(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'originalId'>): ITopic {
    const id = uuidv4();
    const now = new Date();
  
    return {
      ...data,
      id,
      originalId: id,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
  }
  
  createVersion(
    base: ITopic,
    updates: Partial<Omit<ITopic, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'originalId'>>,
    latestVersion: number
  ): ITopic {
    return {
      ...base,
      ...updates,
      id: uuidv4(),
      version: latestVersion + 1,
      originalId: base.originalId,
      createdAt: base.createdAt,
      updatedAt: new Date()
    };
  }
}
