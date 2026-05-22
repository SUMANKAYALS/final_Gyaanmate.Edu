import { Router } from 'express';
import { getCategories, getCategoryCourses } from '../controllers/categoryController.js';

const router = Router();
router.get('/', getCategories);
router.get('/:slug/courses', getCategoryCourses);
export default router;
