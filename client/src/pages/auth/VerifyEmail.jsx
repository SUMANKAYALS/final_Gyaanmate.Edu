import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: searchParams.get('email') || '', otp: '' });
  const [loading, setLoading] = useState(false);
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const resendOtp = useAuthStore((s) => s.resendOtp);

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setForm((prev) => ({ ...prev, email }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.otp) {
      return toast.error('Please enter both email and OTP.');
    }
    setLoading(true);
    try {
      await verifyEmail(form.email, form.otp);
      toast.success('Email verified successfully!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) return toast.error('Please enter your email first.');
    setLoading(true);
    try {
      await resendOtp(form.email);
      toast.success('Verification code resent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920')] bg-cover bg-center opacity-10"></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8 relative z-10">
        <h2 className="text-2xl font-bold gradient-text text-center mb-6">Verify Your Email</h2>
        <p className="text-sm text-slate-400 mb-6">
          Enter the OTP sent to your email to complete registration and sign in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
          />
          <input
            type="text"
            required
            placeholder="Verification Code"
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
          />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-400">
          <button type="button" onClick={handleResend} disabled={loading} className="text-indigo-300 hover:text-indigo-100">
            Resend verification code
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already verified? <Link to="/login" className="text-indigo-400">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
