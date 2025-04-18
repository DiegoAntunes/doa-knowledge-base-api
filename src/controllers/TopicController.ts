import { Request, Response } from 'express';
import { TopicService } from '../services/TopicService';

export class TopicController {
  static getAll(req: Request, res: Response) {
    const topics = TopicService.getAll();
    res.json(topics);
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

  static getById(req: Request, res: Response) {
    const topic = TopicService.getById(req.params.id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  }
  
  static create(req: Request, res: Response) {
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
    const updated = TopicService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Topic not found' });
    res.json(updated);
  }

  static delete(req: Request, res: Response) {
    const success = TopicService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Topic not found' });
    res.status(204).send();
  }
}
