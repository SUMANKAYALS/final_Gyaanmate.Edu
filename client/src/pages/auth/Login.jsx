import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ArrowRight, Lock, Mail, Moon, Sun } from '../../lib/icons';
import AuthVisualPanel from '../../components/auth/AuthVisualPanel';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { BRAND_LOGO_URL, BRAND_NAME } from '../../config/brand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isDark = theme === 'dark';

  const from = searchParams.get('from') || location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
      return;
    }
    if (searchParams.get('session') === 'expired') {
      toast.error('Your session expired. Please sign in again.');
      window.__learnhubRedirecting = false;
    }
  }, [user, searchParams, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 403 && message?.includes('not verified')) {
        toast.error(message);
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      toast.error(message || 'Login failed');
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
          className={`flex w-full items-center justify-center px-6 py-10 lg:w-[48%] lg:px-12 ${
            isDark ? 'bg-[#071020]' : 'bg-white'
          }`}
        >
          <div className="w-full max-w-sm">
            <div className="mb-12 flex items-center gap-3">
              <img src={BRAND_LOGO_URL} alt={`${BRAND_NAME} logo`} className="h-9 w-9 rounded-full object-cover" />
              <span className="font-bold text-blue-500">{BRAND_NAME}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back!</h1>
            <p className={`mt-3 text-sm ${mutedClass}`}>Please enter your details to continue.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-medium">Email Address</span>
                <span className="relative mt-2 block">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} size={17} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full rounded-lg border py-3 pl-10 pr-11 text-sm outline-none transition focus:ring-4 ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${mutedClass} hover:text-blue-500`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className={`flex items-center gap-2 ${mutedClass}`}>
                  <input type="checkbox" className="h-4 w-4 rounded accent-violet-500" />
                  Remember me
                </label>
                <Link to={email ? `/forgot-password?email=${encodeURIComponent(email)}` : '/forgot-password'} className="font-semibold text-violet-500 hover:text-violet-400">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-400 hover:to-violet-500 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : <>Login <ArrowRight size={17} /></>}
              </button>
            </form>

            <p className={`mt-6 text-center text-sm ${mutedClass}`}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-violet-500 hover:text-violet-400">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.section>

        <AuthVisualPanel />
      </div>
    </div>
  );
}
