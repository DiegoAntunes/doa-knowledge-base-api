import request from 'supertest';
import app from '../../src/app';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../../test/database/user.test.json');

beforeEach(() => {
  fs.writeFileSync(filePath, JSON.stringify([])); // clean the file before each test
});

describe('Integration: Users', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'User 01 Admin',
        email: 'user01admin@kbapi.com',
        role: 'Admin'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.role).toBe('Admin');
  });

  it('should list all users', async () => {
    await request(app).post('/users').send({
      name: 'User 02 Editor',
      email: 'user02editor@kbapi.com',
      role: 'Editor'
    });

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should retrieve a user by ID', async () => {
    const { body: user } = await request(app).post('/users').send({
      name: 'User 03 Viewer',
      email: 'user03viewer@kbapi.com',
      role: 'Viewer'
    });

    const res = await request(app).get(`/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('user03viewer@kbapi.com');
  });

  it('should delete a user', async () => {
    const { body: user } = await request(app).post('/users').send({
      name: 'User 04 Viewer',
      email: 'user04viewer@kbapi.com',
      role: 'Viewer'
    });

    const res = await request(app).delete(`/users/${user.id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/users/${user.id}`);
    expect(check.status).toBe(404);
  });
});
