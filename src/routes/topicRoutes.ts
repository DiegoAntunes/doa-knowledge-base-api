import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';
import { fakeAuthMiddleware } from '../middlewares/fakeAuthMiddleware';

const router = Router();

// Public routes
router.get('/', TopicController.getAll);
router.get('/hierarchy', TopicController.getHierarchy);
router.get('/path', TopicController.getShortestPath);
router.get('/:id/versions/:versionNumber', TopicController.getSpecificVersion);
router.get('/:id/versions', TopicController.getVersions);
router.get('/:id/tree-composite', TopicController.getTreeComposite);
router.get('/:id/tree', TopicController.getTree);
router.get('/:id/children', TopicController.getChildren);
router.get('/:id', TopicController.getById);

// Protected routes
router.post('/', fakeAuthMiddleware, TopicController.create);
router.put('/:id', fakeAuthMiddleware, TopicController.update);
router.delete('/:id', fakeAuthMiddleware, TopicController.delete);

export default router;
