import { Router } from 'express';
import {
  recordActivity,
  getStreakData,
  getNextMilestone,
  resetStreak,
} from '../controllers/streakController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Record user activity (called periodically from frontend)
router.post('/record-activity', protect, recordActivity);

// Get streak data and calendar
router.get('/data', protect, getStreakData);

// Get next milestone information
router.get('/milestone', protect, getNextMilestone);

// Reset streak (admin endpoint or for development)
router.post('/reset', protect, resetStreak);

export default router;
