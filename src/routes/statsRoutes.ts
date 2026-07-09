import { Router } from 'express';
import { getOverviewStats, getWeeklyAppointments } from '../controllers/statsController';

const router = Router();

router.get('/overview', getOverviewStats);
router.get('/weekly', getWeeklyAppointments);

export default router;
