import { Router } from 'express';
import {
  studentDashboard,
  instructorDashboard,
  adminDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/student', protect, studentDashboard);
router.get('/instructor', protect, authorize('instructor', 'admin'), instructorDashboard);
router.get('/admin', protect, authorize('admin'), adminDashboard);
export default router;
