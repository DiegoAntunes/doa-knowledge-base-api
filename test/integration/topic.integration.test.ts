import request from 'supertest';
import app from '../../src/app';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../../test/database/topic.test.json');

beforeEach(() => {
  fs.writeFileSync(filePath, JSON.stringify([])); // clean the file before each test
});

describe('Integration: Topics', () => {
  it('must create a topic successfully', async () => {
    const res = await request(app)
      .post('/topics')
      .set('x-user-role', 'Admin')
      .send({
        name: 'Integration Testing',
        content: 'Integration Topic Content'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.version).toBe(1);
  });

  it('must search for the created topic', async () => {
    const { body: topic } = await request(app)
      .post('/topics')
      .set('x-user-role', 'Admin')
      .send({
        name: 'Search Topic',
        content: 'Content'
      });

    const res = await request(app).get(`/topics/${topic.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Search Topic');
  });

  it('should return 404 error if topic does not exist', async () => {
    const res = await request(app).get('/topics/non-existent');
    expect(res.status).toBe(404);
  });
});

describe('Integration: Topics', () => {
  it('should create a new version when updating a topic', async () => {
    // 1. Create the original topic
    const createRes = await request(app)
      .post('/topics')
      .set('x-user-role', 'Editor')
      .send({
        name: 'Version 1',
        content: 'Original content'
      });

    expect(createRes.status).toBe(201);
    const original = createRes.body;

    // 2. Update the topic (which creates a new version)
    const updateRes = await request(app)
      .put(`/topics/${original.id}`)
      .set('x-user-role', 'Editor')
      .send({
        name: 'Version 2',
        content: 'Updated content'
      });

    expect(updateRes.status).toBe(200);
    const updated = updateRes.body;

    // 3. Assertions on versioning
    expect(updated.id).not.toBe(original.id); // new ID
    expect(updated.originalId).toBe(original.originalId); // same root
    expect(updated.version).toBe(original.version + 1); // incremented
    expect(updated.name).toBe('Version 2');
    expect(updated.content).toBe('Updated content');
  });
});
