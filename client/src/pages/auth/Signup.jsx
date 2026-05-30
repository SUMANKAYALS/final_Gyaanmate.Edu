import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ArrowRight, ChevronDown, Lock, Mail, Moon, Sun, User } from '../../lib/icons';
import AuthVisualPanel from '../../components/auth/AuthVisualPanel';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { BRAND_LOGO_URL, BRAND_NAME } from '../../config/brand';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success('Account created! Check your email for the verification code.');
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const pageClass = isDark
    ? 'bg-[#050b18] text-white'
    : 'bg-slate-100 text-slate-950';
  const shellClass = isDark
    ? 'border-slate-700/80 bg-slate-950/70 shadow-2xl shadow-black/30'
    : 'border-slate-200 bg-white shadow-2xl shadow-blue-950/10';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-500 focus:border-violet-400 focus:ring-violet-500/20'
    : 'border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/15';
  const mutedClass = isDark ? 'text-slate-400' : 'text-slate-500';

  const PasswordToggle = ({ visible, onClick, label }) => (
    <button
      type="button"
      onClick={onClick}
      className={`absolute right-3 top-1/2 -translate-y-1/2 ${mutedClass} hover:text-blue-500`}
      aria-label={label}
    >
      {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
    </button>
  );

  return (
    <div className={`min-h-screen px-4 py-6 ${pageClass}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`fixed right-6 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border transition ${
          isDark
            ? 'border-violet-400/30 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30'
            : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:text-blue-600'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className={`mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl overflow-hidden rounded-3xl border ${shellClass}`}>
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className={`flex w-full items-center justify-center px-6 py-8 lg:w-[52%] lg:px-12 ${
            isDark ? 'bg-[#071020]' : 'bg-white'
          }`}
        >
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center gap-3">
              <img src={BRAND_LOGO_URL} alt={`${BRAND_NAME} logo`} className="h-9 w-9 rounded-full object-cover" />
              <span className="font-bold text-blue-500">{BRAND_NAME}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">Create an Account</h1>
            <p className={`mt-3 text-sm ${mutedClass}`}>Fill in the details below to get started.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Full Name</span>
                <span className="relative mt-2 block">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
                  <input
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Email Address</span>
                <span className="relative mt-2 block">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Password</span>
                <span className="relative mt-2 block">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full rounded-lg border py-3 pl-10 pr-11 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                  <PasswordToggle
                    visible={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Confirm Password</span>
                <span className="relative mt-2 block">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className={`w-full rounded-lg border py-3 pl-10 pr-11 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                  <PasswordToggle
                    visible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium">I am a</span>
                <span className="relative mt-2 block">
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className={`w-full appearance-none rounded-lg border py-3 pl-4 pr-10 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                  <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-400 hover:to-violet-500 disabled:opacity-60"
              >
                {loading ? 'Creating...' : <>Create Account <ArrowRight size={17} /></>}
              </button>
            </form>

            <p className={`mt-6 text-center text-sm ${mutedClass}`}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-violet-500 hover:text-violet-400">
                Sign In
              </Link>
            </p>
          </div>
        </motion.section>

        <AuthVisualPanel />
      </div>
    </div>
  );
}
