import { Request, Response } from 'express';
import { TopicService } from '../services/TopicService';

export class TopicController {
  static getAll(req: Request, res: Response) {
    const topics = TopicService.getAll();
    res.json(topics);
  }
}
