import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Lock, Mail, Moon, Sun } from '../../lib/icons';
import { useTheme } from '../../context/ThemeContext';
import { authAPI } from '../../services/api';
import { BRAND_LOGO_URL, BRAND_NAME } from '../../config/brand';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep] = useState('request');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLight = theme === 'light';

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
      toast.error(err.response?.data?.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return toast.error('Enter the reset code from your email.');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
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
      toast.error(err.response?.data?.message || 'Could not reset password.');
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
      toast.error(err.response?.data?.message || 'Could not resend code.');
    } finally {
      setLoading(false);
    }
  };

  const cardClass = isLight
    ? 'border-white/80 bg-white/90 text-slate-950 shadow-2xl shadow-blue-950/20'
    : 'border-slate-700/80 bg-slate-950/85 text-white shadow-2xl shadow-black/40';
  const inputClass = isLight
    ? 'border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/15'
    : 'border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-violet-400 focus:ring-violet-500/20';
  const mutedClass = isLight ? 'text-slate-600' : 'text-slate-400';

  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    visible,
    setVisible,
    label,
  }) => (
    <div className="relative">
      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
      <input
        type={visible ? 'text' : 'password'}
        required
        minLength={6}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border py-3 pl-11 pr-12 text-sm outline-none transition focus:ring-4 ${inputClass}`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 ${mutedClass} hover:text-violet-500`}
        aria-label={label}
      >
        {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </button>
    </div>
  );

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 ${
        isLight ? 'bg-slate-100' : 'bg-[#050b18]'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1920&auto=format&fit=crop')",
        }}
      />
      <div className={`absolute inset-0 ${isLight ? 'bg-white/45' : 'bg-slate-950/78'}`} />

      <button
        type="button"
        onClick={toggleTheme}
        className={`fixed right-6 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border transition ${
          isLight
            ? 'border-slate-200 bg-white/90 text-slate-600 shadow-sm hover:text-blue-600'
            : 'border-violet-400/30 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30'
        }`}
        aria-label="Toggle theme"
      >
        {isLight ? <Moon size={17} /> : <Sun size={17} />}
      </button>

      <div
        className={`relative z-10 w-full max-w-md rounded-2xl border p-8 backdrop-blur-xl ${cardClass}`}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-600/20 ring-1 ring-blue-100">
          <img
            src={BRAND_LOGO_URL}
            alt={`${BRAND_NAME} logo`}
            className="h-11 w-11 rounded-full object-cover"
          />
        </div>

        <h1 className="text-center text-2xl font-extrabold text-blue-600">
          {step === 'request' ? 'Forgot Password' : 'Reset Password'}
        </h1>

        <p className={`mx-auto mt-4 max-w-xs text-center text-sm leading-6 ${mutedClass}`}>
          {step === 'request'
            ? 'Enter your account email and we will send you a reset code.'
            : 'Enter the code from your email and choose a new password.'}
        </p>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="mt-7 space-y-5">
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full rounded-lg border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-400 hover:to-violet-500 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-7 space-y-4">
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full rounded-lg border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
              />
            </div>

            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Reset code (6 digits)"
              className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-4 ${inputClass}`}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              visible={showPassword}
              setVisible={setShowPassword}
              label={showPassword ? 'Hide new password' : 'Show new password'}
            />

            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              visible={showConfirmPassword}
              setVisible={setShowConfirmPassword}
              label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-400 hover:to-violet-500 disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="w-full text-sm font-medium text-violet-500 hover:text-violet-400 disabled:opacity-60"
            >
              Resend reset code
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className={`w-full text-sm ${mutedClass} hover:text-violet-500`}
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="mt-7 text-center text-sm">
          <Link to="/login" className="font-medium text-violet-500 hover:text-violet-400">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
