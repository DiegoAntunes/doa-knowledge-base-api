import request from 'supertest';
import app from '../../src/app';

let userCounter = 0;

export async function createTestUser(role = 'Viewer') {
  userCounter++;
  const userData = {
    name: `${role} User ${userCounter}`,
    email: `${role.toLowerCase()}${userCounter}@test.com`,
    role,
  };

  const res = await request(app).post('/users').send(userData);
  if (res.status !== 201) {
    throw new Error(`Failed to create test user: ${res.status} - ${JSON.stringify(res.body)}`);
  }
  return res.body;
}
