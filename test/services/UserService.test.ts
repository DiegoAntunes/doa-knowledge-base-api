import fs from 'fs';
import path from 'path';
import { UserService } from '../../src/services/UserService';

const filePath = path.join(__dirname, '../../test/database/user.test.json');

beforeEach(() => {
  fs.writeFileSync(filePath, JSON.stringify([])); // clean the file before each test
});

describe('UserService', () => {
  it('should create a user', () => {
    const user = UserService.create({
      name: 'User 01 Admin',
      email: 'user01admin@kbapi.com',
      role: 'Admin',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('User 01 Admin');
    expect(user.email).toBe('user01admin@kbapi.com');
    expect(user.role).toBe('Admin');
  });

  it('should retrieve a user by ID', () => {
    const created = UserService.create({
      name: 'User 02 Editor',
      email: 'user02editor@kbapi.com',
      role: 'Editor',
    });

    const found = UserService.getById(created.id);
    expect(found).toEqual(created);
  });

  it('should delete a user', () => {
    const created = UserService.create({
    name: 'User 03 Viewer',
    email: 'user03viewer@kbapi.com',
    role: 'Viewer',
    });

    const success = UserService.delete(created.id);
    expect(success).toBe(true);

    const after = UserService.getById(created.id);
    expect(after).toBeUndefined();
  });

  it('should list all users', () => {
    UserService.create({ name: 'User 05', email: 'user05@kbapi.com', role: 'Admin' });
    UserService.create({ name: 'User 06', email: 'user06@kbapi.com', role: 'Editor' });
    UserService.create({ name: 'User 07', email: 'user07@kbapi.com', role: 'Viewer' });

    const all = UserService.getAll();
    expect(all.length).toBe(3);
  });
});
