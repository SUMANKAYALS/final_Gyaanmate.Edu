import { Router } from 'express';
import {
  getMyEnrollments,
  enrollInCourse,
  updateProgress,
  downloadCertificate,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/my', getMyEnrollments);
router.post('/:courseId', enrollInCourse);
router.patch('/:courseId/progress', updateProgress);
router.get('/:courseId/certificate', downloadCertificate);
export default router;
