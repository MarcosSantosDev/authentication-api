import { Router } from 'express';

import authMiddleware from '../app/middlewares/authMiddleware';

import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/users', UserController.store);
router.post('/auth', AuthController.authenticate);
router.post('/refresh', AuthController.refreshToken);
router.get('/ping', authMiddleware, UserController.index);
router.get('/me', authMiddleware, UserController.index);

export default router