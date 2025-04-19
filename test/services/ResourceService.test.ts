import fs from 'fs';
import path from 'path';
import { ResourceService } from '../../src/services/ResourceService';

const filePath = path.join(__dirname, '../../test/database/resource.test.json');

beforeEach(() => {
  fs.writeFileSync(filePath, JSON.stringify([])); // clean the file before each test
});

describe('ResourceService', () => {
  it('should create a resource', () => {
    const resource = ResourceService.create({
      topicId: 'resorce-create',
      url: 'http://www.youtube.com',
      description: 'Video from youtube',
      type: 'video',
    });

    expect(resource).toHaveProperty('id');
    expect(resource.topicId).toBe('resorce-create');
    expect(resource.url).toBe('http://www.youtube.com');
    expect(resource.description).toBe('Video from youtube');
    expect(resource.type).toBe('video');
  });

  it('should retrieve resource by ID', () => {
    const created = ResourceService.create({
        topicId: 'resorce-getbyid',
        url: 'http://www.articleweb.com/artweb',
        description: 'Article from web',
        type: 'article',
    });

    const found = ResourceService.getById(created.id);
    expect(found).toEqual(created);
  });

  it('should return resources by topicId', () => {
    ResourceService.create({
      topicId: 'resorce-getbytopicid',
      url: 'http://www.pdfweb.com/pdfweb',
      description: 'PDF from web',
      type: 'pdf',
    });

    ResourceService.create({
      topicId: 'resorce-getbytopicid',
      url: 'http://www.pdfweb.com/pdfweb2',
      description: 'PDF from web 2',
      type: 'pdf',
    });

    const resources = ResourceService.getByTopicId('resorce-getbytopicid');
    expect(resources.length).toBe(2);
  });

  it('should delete a resource', () => {
    const created = ResourceService.create({
        topicId: 'resorce-delete',
        url: 'http://www.articleweb.com/howtodelete',
        description: 'How to delete',
        type: 'article',
    });

    const deleted = ResourceService.delete(created.id);
    expect(deleted).toBe(true);

    const after = ResourceService.getById(created.id);
    expect(after).toBeUndefined();
  });
});
