import { Request, Response } from 'express';
import { UserController } from '../../src/controllers/UserController';
import { UserService } from '../../src/services/UserService';
import { IUser } from '../../src/models/User';

describe('UserController (with mocked UserService)', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users from the service', async () => {
    const mockUser: IUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'Admin',
      createdAt: new Date(),
    };

    const mockUsers: IUser[] = [mockUser];
    jest.spyOn(UserService, 'getAll').mockReturnValue(mockUsers);

    const req = {
      user: mockUser
    } as unknown as Request;

    await UserController.getAll(req, res);
    expect(UserService.getAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // não usamos status explícito em sucesso
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});
