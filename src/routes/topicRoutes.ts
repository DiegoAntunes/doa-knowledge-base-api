import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';

const router = Router();

router.get('/', TopicController.getAll.bind(TopicController));
router.get('/hierarchy', TopicController.getHierarchy.bind(TopicController)); //Before /:id
router.get('/:id/versions/:versionNumber', TopicController.getSpecificVersion.bind(TopicController)); //Before /:id and /:id/versions
router.get('/:id/tree', TopicController.getTree); //Before /:id
router.get('/:id/versions', TopicController.getVersions.bind(TopicController)); //Before /:id
router.get('/:id/children', TopicController.getChildren.bind(TopicController)); //Before /:id
router.get('/:id', TopicController.getById.bind(TopicController));
router.post('/', TopicController.create.bind(TopicController));
router.put('/:id', TopicController.update.bind(TopicController));
router.delete('/:id', TopicController.delete.bind(TopicController));

export default router;
