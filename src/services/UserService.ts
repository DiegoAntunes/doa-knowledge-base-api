import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IUser, User, UserRole } from '../models/User';

const dbPath = process.env.NODE_ENV === 'test'
  ? path.join(__dirname, '../../test/database/user.test.json')
  : path.join(__dirname, '../database/user.json');

  function readData(): IUser[] {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '[]', 'utf-8');
    }
    const raw = fs.readFileSync(dbPath, 'utf-8').trim();
    if (!raw) return [];
    try {
      return JSON.parse(raw).map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
      }));
    } catch (err) {
      console.error('[UserService] Failed to parse user data:', err);
      return [];
    }
  }

function writeData(data: IUser[]) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export class UserService {
  static getAll(): IUser[] {
    return readData();
  }

  static getById(id: string): IUser | undefined {
    return readData().find(u => u.id === id);
  }

  static create(data: Omit<IUser, 'id' | 'createdAt'>): IUser {
    const newUser: IUser = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const users = readData();
    users.push(newUser);
    writeData(users);
    return newUser;
  }

  static update(id: string, data: Partial<Omit<IUser, 'id' | 'createdAt'>>): IUser | null {
    const users = readData();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...data,
    };
    writeData(users);
    return users[index];
  }

  static delete(id: string): boolean {
    const users = readData();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    writeData(users);
    return true;
  }
}
