import request from 'supertest';
import app from '../../src/app';
import fs from 'fs';
import path from 'path';
import { createTestUser } from '../utils/createUser';

const userPath = path.join(__dirname, '../../test/database/user.test.json');
const topicPath = path.join(__dirname, '../../test/database/topic.test.json');

beforeEach(() => {
  fs.writeFileSync(userPath, JSON.stringify([]));
  fs.writeFileSync(topicPath, JSON.stringify([]));
});

describe('Integration: Topics', () => {
  it('must create a topic successfully', async () => {
    const admin = await createTestUser('Admin');

    const res = await request(app)
      .post('/topics')
      .set('x-user-id', admin.id)
      .send({
        name: 'Integration Testing',
        content: 'Integration Topic Content'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.version).toBe(1);
  });

  it('must search for the created topic', async () => {
    const admin = await createTestUser('Admin');

    const { body: topic } = await request(app)
      .post('/topics')
      .set('x-user-id', admin.id)
      .send({
        name: 'Search Topic',
        content: 'Content'
      });

    expect(topic).toHaveProperty('id');

    const res = await request(app).get(`/topics/${topic.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Search Topic');
  });

  it('should return 404 error if topic does not exist', async () => {
    const res = await request(app).get('/topics/non-existent');
    expect(res.status).toBe(404);
  });

  it('should create a new version when updating a topic', async () => {
    const editor = await createTestUser('Editor');

    const createRes = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({
        name: 'Version 1',
        content: 'Original content'
      });

    expect(createRes.status).toBe(201);
    const original = createRes.body;

    const updateRes = await request(app)
      .put(`/topics/${original.id}`)
      .set('x-user-id', editor.id)
      .send({
        name: 'Version 2',
        content: 'Updated content'
      });

    expect(updateRes.status).toBe(200);
    const updated = updateRes.body;

    expect(updated.id).not.toBe(original.id);
    expect(updated.originalId).toBe(original.originalId);
    expect(updated.version).toBe(original.version + 1);
    expect(updated.name).toBe('Version 2');
    expect(updated.content).toBe('Updated content');
  });

  it('should list all versions of a topic', async () => {
    const editor = await createTestUser('Editor');

    const createRes = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'Version Base', content: 'Initial content' });

    expect(createRes.status).toBe(201);
    const original = createRes.body;

    await request(app)
      .put(`/topics/${original.id}`)
      .set('x-user-id', editor.id)
      .send({ name: 'V2', content: 'Updated' });

    await request(app)
      .put(`/topics/${original.id}`)
      .set('x-user-id', editor.id)
      .send({ name: 'V3', content: 'Updated again' });

    const res = await request(app).get(`/topics/${original.id}/versions`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  it('should get a specific version of a topic', async () => {
    const admin = await createTestUser('Admin');

    const createRes = await request(app)
      .post('/topics')
      .set('x-user-id', admin.id)
      .send({ name: 'Topic X', content: 'v1' });

    const original = createRes.body;

    await request(app)
      .put(`/topics/${original.id}`)
      .set('x-user-id', admin.id)
      .send({ name: 'Topic X', content: 'v2' });

    await request(app)
      .put(`/topics/${original.id}`)
      .set('x-user-id', admin.id)
      .send({ name: 'Topic X', content: 'v3' });

    const res = await request(app).get(`/topics/${original.originalId}/versions/2`);
    expect(res.status).toBe(200);
    expect(res.body.version).toBe(2);
    expect(res.body.content).toBe('v2');
  });

  it('should return a topic with its children as a tree', async () => {
    const editor = await createTestUser('Editor');

    const parentRes = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'Parent', content: 'Root node' });

    const parent = parentRes.body;

    await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'Child 1', content: 'First child', parentTopicId: parent.id });

    await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'Child 2', content: 'Second child', parentTopicId: parent.id });

    const treeRes = await request(app).get(`/topics/${parent.id}/tree`);
    expect(treeRes.status).toBe(200);
    expect(treeRes.body.children.length).toBe(2);
  });

  it('should find the shortest path between two topics', async () => {
    const editor = await createTestUser('Editor');

    const root = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'Root', content: 'Top' });

    const level1 = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'L1', content: 'Level 1', parentTopicId: root.body.id });

    const level2 = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'L2', content: 'Level 2', parentTopicId: level1.body.id });

    const level3 = await request(app)
      .post('/topics')
      .set('x-user-id', editor.id)
      .send({ name: 'L3', content: 'Level 3', parentTopicId: level2.body.id });

    const res = await request(app).get(`/topics/path?from=${root.body.id}&to=${level3.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.path.length).toBe(4);
    expect(res.body.path[0].name).toBe('Root');
    expect(res.body.path[3].name).toBe('L3');
  });
});
