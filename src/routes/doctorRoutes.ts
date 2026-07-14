import { Router } from 'express';
import { getDoctors, getDoctorById, addDoctor, addDoctorReview, deleteDoctor, updateDoctor } from '../controllers/doctorController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', authenticateToken as any, requireRole(['doctor', 'admin']) as any, addDoctor as any);
router.post('/:id/reviews', authenticateToken as any, addDoctorReview as any);
router.put('/:id', authenticateToken as any, updateDoctor as any);
router.delete('/:id', authenticateToken as any, deleteDoctor as any);

export default router;
