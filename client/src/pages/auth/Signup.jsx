import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const { register, user } = useAuthStore();

  const navigate = useNavigate();

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
        role: form.role
      });

      toast.success(
        'Account created! Check your email for the verification code.'
      );

      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920')] bg-cover bg-center opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <h2 className="text-2xl font-bold gradient-text text-center mb-6">
          Join Gyaanmate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
          />

          {/* Email */}
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value
                })
              }
              className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
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

          {/* Role */}
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Have an account?{' '}
          <Link to="/login" className="text-indigo-400">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}