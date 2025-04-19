import fs from 'fs';
import path from 'path';
import { TopicService } from '../../src/services/TopicService';

const mockFilePath = path.join(__dirname, '../../test/database/topic.test.json');

beforeEach(() => {
  fs.writeFileSync(mockFilePath, JSON.stringify([])); // clean the file before each test
});

describe('TopicService', () => {
  it('should create a topic', () => {
    const topic = TopicService.create({
      name: 'Topic Test 01',
      content: 'Content topic test 01',
      parentTopicId: undefined
    });

    expect(topic).toHaveProperty('id');
    expect(topic).toHaveProperty('createdAt');
    expect(topic.name).toBe('Topic Test 01');
    expect(topic.version).toBe(1);
  });

  it('should retrieve topic by ID', () => {
    const created = TopicService.create({
      name: 'Topic Test 02',
      content: 'Content topic test 02',
      parentTopicId: undefined
    });

    const found = TopicService.getById(created.id);
    expect(found).toEqual(created);
  });

  it('should delete a topic', () => {
    const created = TopicService.create({
      name: 'Topic Test 03',
      content: 'Content topic test 03',
      parentTopicId: undefined
    });

    const deleted = TopicService.delete(created.id);
    expect(deleted).toBe(true);

    const afterDelete = TopicService.getById(created.id);
    expect(afterDelete).toBeUndefined();
  });
});
