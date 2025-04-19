import { Router } from 'express';
import { ResourceController } from '../controllers/ResourceController';

const router = Router();

router.get('/', ResourceController.getAll);

router.get('/topic/:topicId', ResourceController.getByTopicId);
router.get('/:id', ResourceController.getById);

router.post('/', ResourceController.create);
router.put('/:id', ResourceController.update);
router.delete('/:id', ResourceController.delete);

export default router;
