import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../../services/api';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState('request');

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paramEmail = searchParams.get('email');

    if (paramEmail) setEmail(paramEmail);

    if (searchParams.get('step') === 'reset') {
      setStep('reset');
    }
  }, [searchParams]);

  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error('Please enter your email.');
    }

    setLoading(true);

    try {
      const { data } = await authAPI.forgotPassword({
        email: email.trim(),
      });

      toast.success(data.message || 'Check your email for a reset code.');

      setStep('reset');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not send reset email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return toast.error(
        'Enter the reset code from your email.'
      );
    }

    if (password.length < 6) {
      return toast.error(
        'Password must be at least 6 characters.'
      );
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setLoading(true);

    try {
      const { data } = await authAPI.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
      });

      toast.success(data.message || 'Password updated.');

      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not reset password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      return toast.error('Enter your email first.');
    }

    setLoading(true);

    try {
      const { data } = await authAPI.forgotPassword({
        email: email.trim(),
      });

      toast.success(data.message || 'Reset code sent.');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not resend code.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920')] bg-cover bg-center opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <h2 className="text-2xl font-bold gradient-text text-center mb-2">
          {step === 'request'
            ? 'Forgot Password'
            : 'Reset Password'}
        </h2>

        <p className="text-sm text-slate-400 text-center mb-6">
          {step === 'request'
            ? 'Enter your account email and we will send you a reset code.'
            : 'Enter the code from your email and choose a new password.'}
        </p>

        {step === 'request' ? (
          <form
            onSubmit={handleRequestReset}
            className="space-y-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="space-y-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
            />

            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Reset code (6 digits)"
              className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="w-full text-sm text-indigo-300 hover:text-indigo-100"
            >
              Resend reset code
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-sm text-slate-400 hover:text-slate-200"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}