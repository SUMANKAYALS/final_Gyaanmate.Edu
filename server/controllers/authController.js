import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLogoutReloginEmail,
} from '../services/emailService.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' });

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const saveVerificationOtp = async (user) => {
  const otp = generateOtp();
  user.emailVerificationOtp = await bcrypt.hash(otp, 12);
  user.emailVerificationOtpExpires = Date.now() + 1000 * 60 * 15;
  await user.save({ validateBeforeSave: false });
  return otp;
};

const savePasswordResetOtp = async (user) => {
  const otp = generateOtp();
  user.passwordResetOtp = await bcrypt.hash(otp, 12);
  user.passwordResetOtpExpires = Date.now() + 1000 * 60 * 15;
  await user.save({ validateBeforeSave: false });
  return otp;
};

const genericResetMessage =
  'If an account exists for this email, a password reset code has been sent.';

export const register = async (req, res) => {
  const { name, password, role } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: ['student', 'instructor'].includes(role) ? role : 'student',
  });

  const otp = await saveVerificationOtp(user);

  try {
    await sendVerificationEmail(email, otp);
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    throw error;
  }

  res.status(201).json({
    message: 'Account created. Please verify your email with the OTP sent to your inbox.',
    email: user.email,
  });
};

export const login = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const { password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email }).select('+password +emailVerified');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      message: 'Invalid email or password. Use a demo account below or sign up if the database was reset.',
    });
  }
  if (!user.emailVerified) {
    return res.status(403).json({
      message: 'Email not verified. Please verify your email before signing in.',
    });
  }
  const token = signToken(user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio },
  });
};

export const verifyEmail = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const otp = String(req.body.otp || '').trim();
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email }).select(
    '+emailVerificationOtp +emailVerificationOtpExpires +password +emailVerified'
  );
  if (!user) {
    return res.status(400).json({ message: 'Unable to verify email.' });
  }
  if (user.emailVerified) {
    return res.status(400).json({ message: 'Email is already verified.' });
  }
  if (
    !user.emailVerificationOtp ||
    !user.emailVerificationOtpExpires ||
    user.emailVerificationOtpExpires < Date.now()
  ) {
    return res.status(400).json({ message: 'OTP expired or invalid. Please resend a new code.' });
  }
  if (!(await user.compareEmailOtp(otp))) {
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  user.emailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio },
  });
};

export const resendVerificationOtp = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Unable to resend OTP to this email.' });
  }
  if (user.emailVerified) {
    return res.status(400).json({ message: 'Email is already verified.' });
  }

  const otp = await saveVerificationOtp(user);
  await sendVerificationEmail(email, otp);

  res.json({ message: 'A new verification code has been sent to your email.' });
};

export const forgotPassword = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (user) {
      const otp = await savePasswordResetOtp(user);
      await sendPasswordResetEmail(email, otp);
    }
    res.json({ message: genericResetMessage });
  } catch (error) {
    console.error('forgotPassword:', error);
    res.status(500).json({ message: 'Unable to send reset email. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const otp = String(req.body.otp || '').trim();
  const password = String(req.body.password || '');

  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'Email, reset code, and new password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const user = await User.findOne({ email }).select(
    '+passwordResetOtp +passwordResetOtpExpires +password +emailVerified'
  );
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset code.' });
  }
  if (
    !user.passwordResetOtp ||
    !user.passwordResetOtpExpires ||
    user.passwordResetOtpExpires < Date.now()
  ) {
    return res.status(400).json({ message: 'Reset code expired or invalid. Please request a new one.' });
  }
  if (!(await user.comparePasswordResetOtp(otp))) {
    return res.status(400).json({ message: 'Invalid reset code.' });
  }

  user.password = password;
  user.emailVerified = true;
  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully. You can sign in with your new password.' });
};

export const logout = async (req, res) => {
  console.log('Logout route called');
  try {
    await sendLogoutReloginEmail(req.user.email, req.user.name);
    res.json({ message: 'Logged out successfully. A login reminder has been sent to your email.' });
  } catch (error) {
    console.error('logout email:', error);
    res.json({ message: 'Logged out successfully. Login reminder email could not be sent.' });
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      bio: req.user.bio,
    },
  });
};
