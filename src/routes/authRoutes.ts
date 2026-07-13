import { Router } from 'express';
import { register, login, getMe, googleLogin } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authenticateToken as any, getMe as any);

export default router;
