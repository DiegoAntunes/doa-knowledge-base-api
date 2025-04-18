import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  static getAll(req: Request, res: Response) {
    const users = UserService.getAll();
    res.json(users);
  }

  static getById(req: Request, res: Response) {
    const user = UserService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }

  static create(req: Request, res: Response) {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Mandatory fields: name, email, role' });
    }

    const validRoles = ['Admin', 'Editor', 'Viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    const user = UserService.create({ name, email, role });
    res.status(201).json(user);
  }

  static update(req: Request, res: Response) {
    const { name, email, role } = req.body;
    const updated = UserService.update(req.params.id, { name, email, role });

    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  }

  static delete(req: Request, res: Response) {
    const success = UserService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  }
}
