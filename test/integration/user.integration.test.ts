import request from 'supertest';
import app from '../../src/app';
import fs from 'fs';
import path from 'path';
import { createTestUser } from '../utils/createUser';

const userPath = path.join(__dirname, '../../test/database/user.test.json');

beforeEach(() => {
  fs.writeFileSync(userPath, JSON.stringify([])); // clean the file before each test
});

describe('Integration: Users', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Admin',
        email: 'admin@test.com',
        role: 'Admin'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.role).toBe('Admin');
  });

  it('should list all users', async () => {
    const editor = await createTestUser('Editor');
    const admin = await createTestUser('Admin');

    const res = await request(app)
      .get('/users')
      .set('x-user-id', admin.id); // Admin required

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // editor + admin
  });

  it('should retrieve a user by ID', async () => {
    const viewer = await createTestUser('Viewer');

    const res = await request(app)
      .get(`/users/${viewer.id}`)
      .set('x-user-id', viewer.id); // user accessing own data

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(viewer.email); // ensures match even with unique email
  });

  it('should delete a user', async () => {
    const toDelete = await createTestUser('Editor');
    const admin = await createTestUser('Admin');

    const res = await request(app)
      .delete(`/users/${toDelete.id}`)
      .set('x-user-id', admin.id); // Only Admin can delete

    expect(res.status).toBe(204);

    const check = await request(app)
      .get(`/users/${toDelete.id}`)
      .set('x-user-id', admin.id); // Use Admin to confirm deletion

    expect(check.status).toBe(404);
  });
});
