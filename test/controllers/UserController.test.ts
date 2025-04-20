import { Request, Response } from 'express';
import { UserController } from '../../src/controllers/UserController';
import { UserService } from '../../src/services/UserService';
import { IUser } from '../../src/models/User';

describe('UserController (with mocked UserService)', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  } as unknown as Response;

  const mockUser: IUser = {
    id: '1',
    name: 'Admin',
    email: 'admin@test.com',
    role: 'Admin',
    createdAt: new Date('2025-04-20T14:17:48.584Z'),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users from the service', () => {
    const mockUsers: IUser[] = [mockUser];

    jest.spyOn(UserService, 'getAll').mockReturnValue(mockUsers);

    const req = {
      user: mockUser
    } as unknown as Request;

    UserController.getAll(req, res);

    expect(UserService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should return a user by ID', () => {
    jest.spyOn(UserService, 'getById').mockReturnValue(mockUser);

    const req = {
      params: { id: '1' },
      user: mockUser
    } as unknown as Request;

    UserController.getById(req, res);

    expect(UserService.getById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should create a user', () => {
    const newUser = { ...mockUser, id: '2' };
    jest.spyOn(UserService, 'create').mockReturnValue(newUser);

    const req = {
      body: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    } as unknown as Request;

    UserController.create(req, res);

    expect(UserService.create).toHaveBeenCalledWith({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  it('should update a user', () => {
    const updatedUser = { ...mockUser, name: 'Updated' };
    jest.spyOn(UserService, 'update').mockReturnValue(updatedUser);

    const req = {
      params: { id: '1' },
      user: mockUser,
      body: { name: 'Updated' }
    } as unknown as Request;

    UserController.update(req, res);

    expect(UserService.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  it('should delete a user', () => {
    jest.spyOn(UserService, 'delete').mockReturnValue(true);

    const req = {
      params: { id: '1' },
      user: mockUser
    } as unknown as Request;

    UserController.delete(req, res);

    expect(UserService.delete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
