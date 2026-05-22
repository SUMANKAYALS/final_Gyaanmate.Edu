import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import { courseUpload, validateUploadSizes } from '../middleware/upload.js';

const router = Router();
router.get('/', getCourses);
router.get('/instructor/mine', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/:id', getCourseById);
router.post(
  '/',
  protect,
  authorize('instructor', 'admin'),
  (req, res, next) => {
    courseUpload(req, res, (err) => {
      if (err) {
        const msg =
          err.code === 'LIMIT_FILE_SIZE'
            ? 'File too large. Thumbnail max 5MB, video max 500MB.'
            : err.message || 'Upload failed';
        return res.status(400).json({ message: msg });
      }
      next();
    });
  },
  validateUploadSizes,
  createCourse
);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
export default router;
