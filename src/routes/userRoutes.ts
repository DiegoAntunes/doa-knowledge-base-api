import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { fakeAuthMiddleware } from '../middlewares/fakeAuthMiddleware';

const router = Router();

// public routes
router.post('/', UserController.create);

// Protected routes
router.get('/', fakeAuthMiddleware, UserController.getAll);
router.get('/:id', fakeAuthMiddleware, UserController.getById);
router.put('/:id', fakeAuthMiddleware, UserController.update);
router.delete('/:id', fakeAuthMiddleware, UserController.delete);

export default router;
