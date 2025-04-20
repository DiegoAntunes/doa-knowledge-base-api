import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function fakeAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.header('x-user-id');

  if (!userId) {
    return res.status(401).json({ error: 'Missing x-user-id header' });
  }

  try {
    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
