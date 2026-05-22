import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const from =
    searchParams.get('from') ||
    location.state?.from?.pathname ||
    '/';

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920')] bg-cover bg-center opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <h2 className="text-2xl font-bold gradient-text text-center mb-6">
          Sign In to GyaanMate.edu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className="text-right">
            <Link
              to={email ? `/forgot-password?email=${encodeURIComponent(email)}` : '/forgot-password'}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          No account?{' '}
          <Link to="/signup" className="text-indigo-400">
            Sign up
          </Link>
        </p>
        {/* <div className="mt-4 p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 space-y-1 backdrop-blur-sm">
          <p className="font-medium text-slate-300">Demo accounts (after seed):</p>
          <p>Admin: admin@learnhub.ai / admin123</p>
          <p>Instructor: instructor1@learnhub.ai / instructor123</p>
          <p className="text-slate-500 pt-1">If login fails, run <code className="text-indigo-300">npm run seed</code> in the project folder, then try again.</p>
        </div> */}
      </motion.div>
    </div>
  );
}