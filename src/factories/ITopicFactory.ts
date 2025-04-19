import { ITopic } from '../models/Topic';

export interface ITopicFactory {
  createInitial(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'originalId'>): ITopic;
  createVersion(previous: ITopic, updates: Partial<Omit<ITopic, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'originalId'>>, latestVersion: number): ITopic;
}
