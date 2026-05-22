import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerificationOtp,
  getMe,
} from '../controllers/authController.js';
import { updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendVerificationOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
export default router;
