import { Router } from 'express';
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  addPrescription
} from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken as any, bookAppointment as any);
router.get('/', authenticateToken as any, getAppointments as any);
router.put('/:id/status', authenticateToken as any, updateAppointmentStatus as any);
router.put('/:id/prescription', authenticateToken as any, addPrescription as any);
router.delete('/:id', authenticateToken as any, cancelAppointment as any);

export default router;
