import { Request, Response } from 'express';
import { TopicService } from '../services/TopicService';
import { PermissionContext } from '../permissions/PermissionContext';

export class TopicController {
  static getAll(req: Request, res: Response) {
    const topics = TopicService.getAll();
    res.json(topics);
  }

  static getById(req: Request, res: Response) {
    const topic = TopicService.getById(req.params.id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  }

  static getChildren(req: Request, res: Response) {
    const { id } = req.params;
    const children = TopicService.getChildren(id);
    res.json(children);
  }

  static getHierarchy(req: Request, res: Response) {
    const hierarchy = TopicService.getHierarchy();
    res.json(hierarchy);
  }

  static getVersions(req: Request, res: Response) {
    const versions = TopicService.getVersions(req.params.id);
    if (versions.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(versions);
  }
  
  static getSpecificVersion(req: Request, res: Response) {
    const { id, versionNumber } = req.params;
    const version = parseInt(versionNumber, 10);
  
    if (isNaN(version)) {
      return res.status(400).json({ error: 'Invalid version number' });
    }
  
    const topicVersion = TopicService.getSpecificVersion(id, version);
    if (!topicVersion) {
      return res.status(404).json({ error: 'Version not found' });
    }
  
    res.json(topicVersion);
  }

  static getTree(req: Request, res: Response) {
    const tree = TopicService.getTopicTree(req.params.id);
    if (!tree) return res.status(404).json({ error: 'Topic not found' });
    res.json(tree);
  }

  static getTreeComposite(req: Request, res: Response) {
    const tree = TopicService.getTreeComposite(req.params.id);
    if (!tree) return res.status(404).json({ error: 'Topic not found' });
    res.json(tree);
  }

  static getShortestPath(req: Request, res: Response) {
    const { from, to } = req.query;
    if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({ error: '"from" and "to" parameters are mandatory and must be strings.' });
    }
  
    const path = TopicService.getShortestPath(from, to);
    if (!path) {
      return res.status(404).json({ error: 'Unable to find a path between topics.' });
    }
  
    res.json({ path });
  }
  
  static create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    const permission = new PermissionContext(req.user.role);
    if (!permission.canCreate()) {
      return res.status(403).json({ error: 'User not allowed to create topics' });
    }
  
    const { name, content, parentTopicId } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Mandatory fields: name, content' });
    }
  
    try {
      const topic = TopicService.create({ name, content, parentTopicId });
      res.status(201).json(topic);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static update(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    const permission = new PermissionContext(req.user.role);
    if (!permission.canEdit()) {
      return res.status(403).json({ error: 'User not allowed to edit topics' });
    }
  
    const updated = TopicService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Topic not found' });
    res.json(updated);
  }

  static delete(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    const permission = new PermissionContext(req.user.role);
    if (!permission.canDelete()) {
      return res.status(403).json({ error: 'User not allowed to delete topics' });
    }
  
    const success = TopicService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Topic not found' });
    res.status(204).send();
  }
}
