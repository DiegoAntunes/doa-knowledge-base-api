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
      name: 'Admin',
      email: 'admin@test.com',
      role: 'Admin',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Admin');
    expect(user.email).toBe('admin@test.com');
    expect(user.role).toBe('Admin');
  });

  it('should retrieve a user by ID', () => {
    const created = UserService.create({
      name: 'Editor',
      email: 'editor@test.com',
      role: 'Editor',
    });

    const found = UserService.getById(created.id);
    expect(found).toEqual(created);
  });

  it('should delete a user', () => {
    const created = UserService.create({
    name: 'Viewer',
    email: 'viewer@test.com',
    role: 'Viewer',
    });

    const success = UserService.delete(created.id);
    expect(success).toBe(true);

    const after = UserService.getById(created.id);
    expect(after).toBeUndefined();
  });

  it('should list all users', () => {
    UserService.create({ name: 'Admin', email: 'admin@test.com', role: 'Admin' });
    UserService.create({ name: 'Editor', email: 'editor@test.com', role: 'Editor' });
    UserService.create({ name: 'Viewer', email: 'viewer@test.com', role: 'Viewer' });

    const all = UserService.getAll();
    expect(all.length).toBe(3);
  });
});
