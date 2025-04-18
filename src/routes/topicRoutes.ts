import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';

const router = Router();

router.get('/', TopicController.getAll.bind(TopicController));
router.get('/hierarchy', TopicController.getHierarchy.bind(TopicController));
router.get('/path', TopicController.getShortestPath);

router.get('/:id/versions/:versionNumber', TopicController.getSpecificVersion.bind(TopicController));
router.get('/:id/tree', TopicController.getTree);
router.get('/:id/versions', TopicController.getVersions.bind(TopicController));
router.get('/:id/children', TopicController.getChildren.bind(TopicController));
router.get('/:id', TopicController.getById.bind(TopicController));

router.post('/', TopicController.create.bind(TopicController));
router.put('/:id', TopicController.update.bind(TopicController));
router.delete('/:id', TopicController.delete.bind(TopicController));

export default router;
