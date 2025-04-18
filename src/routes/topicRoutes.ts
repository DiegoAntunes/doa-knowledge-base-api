import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';

const router = Router();

router.get('/', TopicController.getAll.bind(TopicController));
router.get('/hierarchy', TopicController.getHierarchy);
router.get('/:id/children', TopicController.getChildren);
router.get('/:id', TopicController.getById.bind(TopicController));
router.post('/', TopicController.create.bind(TopicController));
router.delete('/:id', TopicController.delete.bind(TopicController));

export default router;
