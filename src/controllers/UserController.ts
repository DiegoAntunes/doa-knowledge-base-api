import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { PermissionContext } from '../permissions/PermissionContext';

export class UserController {
  static getAll(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const permission = new PermissionContext(req.user.role);
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only Admin can view all users' });
    }

    const users = UserService.getAll();
    res.json(users);
  }

  static getById(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = UserService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Admins can access any user. Others only to themselves
    if (req.user.role !== 'Admin' && req.user.id !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

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
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const permission = new PermissionContext(req.user.role);
    if (!permission.canEdit()) {
      return res.status(403).json({ error: 'User not allowed to update users' });
    }

    const { name, email, role } = req.body;
    const updated = UserService.update(req.params.id, { name, email, role });

    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  }

  static delete(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const permission = new PermissionContext(req.user.role);
    if (req.user.role !== 'Admin' || !permission.canDelete()) {
      return res.status(403).json({ error: 'Only Admin can delete users' });
    }

    const success = UserService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  }
}
