import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';

const router = Router();

router.get('/', TopicController.getAll);
router.get('/hierarchy', TopicController.getHierarchy);
router.get('/path', TopicController.getShortestPath);

router.get('/:id/versions/:versionNumber', TopicController.getSpecificVersion);
router.get('/:id/tree', TopicController.getTree);
router.get('/:id/versions', TopicController.getVersions);
router.get('/:id/children', TopicController.getChildren);
router.get('/:id', TopicController.getById);

router.post('/', TopicController.create);
router.put('/:id', TopicController.update);
router.delete('/:id', TopicController.delete);

export default router;
