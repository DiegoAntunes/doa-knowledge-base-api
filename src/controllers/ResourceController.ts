import { Request, Response } from 'express';
import { ResourceService } from '../services/ResourceService';
import { PermissionContext } from '../permissions/PermissionContext';

export class ResourceController {
  static getAll(req: Request, res: Response) {
    const resources = ResourceService.getAll();
    return res.json(resources);
  }

  static getById(req: Request, res: Response) {
    const resource = ResourceService.getById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    return res.json(resource);
  }

  static getByTopicId(req: Request, res: Response) {
    const resources = ResourceService.getByTopicId(req.params.topicId);
    return res.json(resources);
  }

  static create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const permission = new PermissionContext(req.user.role);
    if (!permission.canCreate()) {
      return res.status(403).json({ message: 'User not allowed to create resources' });
    }

    const { topicId, url, description, type } = req.body;
    if (!topicId || !url || !description || !type) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const resource = ResourceService.create({ topicId, url, description, type });
    return res.status(201).json(resource);
  }

  static update(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const permission = new PermissionContext(req.user.role);
    if (!permission.canEdit()) {
      return res.status(403).json({ message: 'User not allowed to edit resources' });
    }

    const resource = ResourceService.update(req.params.id, req.body);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    return res.json(resource);
  }

  static delete(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const permission = new PermissionContext(req.user.role);
    if (!permission.canDelete()) {
      return res.status(403).json({ message: 'User not allowed to delete resources' });
    }

    const deleted = ResourceService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Resource not found' });
    return res.status(204).send();
  }
}
