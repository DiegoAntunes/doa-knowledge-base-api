import request from 'supertest';
import app from '../../src/app';
import fs from 'fs';
import path from 'path';
import { createTestUser } from '../utils/createUser';

const userPath = path.join(__dirname, '../../test/database/user.test.json');
const resourcePath = path.join(__dirname, '../../test/database/resource.test.json');

beforeEach(() => {
  fs.writeFileSync(userPath, JSON.stringify([]));
  fs.writeFileSync(resourcePath, JSON.stringify([]));
});

describe('Integration: Resources', () => {
  it('should create a resource', async () => {
    const user = await createTestUser('Editor');

    const res = await request(app)
      .post('/resources')
      .set('x-user-id', user.id)
      .send({
        topicId: 'resource-create',
        url: 'https://resource-create.com/create',
        description: 'create',
        type: 'video'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.type).toBe('video');
  });

  it('should list all resources', async () => {
    const user = await createTestUser('Editor');

    await request(app)
      .post('/resources')
      .set('x-user-id', user.id)
      .send({
        topicId: 'resource-list',
        url: 'https://resource-list.com/list',
        description: 'list',
        type: 'article'
      });

    const res = await request(app).get('/resources');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a resource by ID', async () => {
    const user = await createTestUser('Editor');

    const { body: created } = await request(app)
      .post('/resources')
      .set('x-user-id', user.id)
      .send({
        topicId: 'resource-getbyid',
        url: 'https://resource-getbyid.com/getbyid',
        description: 'getbyid',
        type: 'pdf'
      });

    const res = await request(app).get(`/resources/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.url).toBe(created.url);
  });

  it('should get resources by topic ID', async () => {
    const user = await createTestUser('Editor');
    const topicId = 'resource-getbytopicid';

    await request(app)
      .post('/resources')
      .set('x-user-id', user.id)
      .send({
        topicId,
        url: 'https://resource-getbytopicid.com/one',
        description: 'one',
        type: 'article'
      });

    await request(app)
      .post('/resources')
      .set('x-user-id', user.id)
      .send({
        topicId,
        url: 'https://resource-getbytopicid.com/two',
        description: 'two',
        type: 'video'
      });

    const res = await request(app).get(`/resources/topic/${topicId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('should delete a resource', async () => {
    const admin = await createTestUser('Admin');

    const { body: created } = await request(app)
      .post('/resources')
      .set('x-user-id', admin.id)
      .send({
        topicId: 'resource-delete',
        url: 'https://resource-delete.com/delete',
        description: 'delete',
        type: 'pdf'
      });

    const del = await request(app)
      .delete(`/resources/${created.id}`)
      .set('x-user-id', admin.id);

    expect(del.status).toBe(204);

    const check = await request(app).get(`/resources/${created.id}`);
    expect(check.status).toBe(404);
  });
});
