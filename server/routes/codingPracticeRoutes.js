import { Router } from 'express';
import {
  createCodingSubmission,
  getCodingProblem,
  getCodingProblemTests,
  getCodingProblems,
  getMyCodingSubmissions,
} from '../controllers/codingPracticeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

function optionalAuth(req, _res, next) {
  if (!req.headers.authorization) return next();
  return protect(req, _res, next);
}

router.get('/problems', optionalAuth, getCodingProblems);
router.get('/submissions/mine', protect, getMyCodingSubmissions);
router.get('/problems/:slug', optionalAuth, getCodingProblem);
router.get('/problems/:slug/tests', getCodingProblemTests);
router.post('/problems/:slug/submissions', protect, createCodingSubmission);

export default router;
