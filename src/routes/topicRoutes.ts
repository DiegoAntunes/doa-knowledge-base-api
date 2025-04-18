import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';

const router = Router();

router.get('/', TopicController.getAll);

export default router;
