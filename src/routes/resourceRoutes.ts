import { Router } from 'express';
import { ResourceController } from '../controllers/ResourceController';
import { fakeAuthMiddleware } from '../middlewares/fakeAuthMiddleware';

const router = Router();

// Public routes
router.get('/', ResourceController.getAll);
router.get('/topic/:topicId', ResourceController.getByTopicId);
router.get('/:id', ResourceController.getById);

// Protected routes
router.post('/', fakeAuthMiddleware, ResourceController.create);
router.put('/:id', fakeAuthMiddleware, ResourceController.update);
router.delete('/:id', fakeAuthMiddleware, ResourceController.delete);

export default router;
