// import { useEffect, useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '../../store/authStore';

// export default function VerifyEmail() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: searchParams.get('email') || '', otp: '' });
//   const [loading, setLoading] = useState(false);
//   const verifyEmail = useAuthStore((s) => s.verifyEmail);
//   const resendOtp = useAuthStore((s) => s.resendOtp);

//   useEffect(() => {
//     const email = searchParams.get('email');
//     if (email) {
//       setForm((prev) => ({ ...prev, email }));
//     }
//   }, [searchParams]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.email || !form.otp) {
//       return toast.error('Please enter both email and OTP.');
//     }
//     setLoading(true);
//     try {
//       await verifyEmail(form.email, form.otp);
//       toast.success('Email verified successfully!');
//       navigate('/', { replace: true });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     if (!form.email) return toast.error('Please enter your email first.');
//     setLoading(true);
//     try {
//       await resendOtp(form.email);
//       toast.success('Verification code resent to your email.');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Could not resend OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920')] bg-cover bg-center opacity-10"></div>
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8 relative z-10">
//         <h2 className="text-2xl font-bold gradient-text text-center mb-6">Verify Your Email</h2>
//         <p className="text-sm text-slate-400 mb-6">
//           Enter the OTP sent to your email to complete registration and sign in.
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             required
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//           />
//           <input
//             type="text"
//             required
//             placeholder="Verification Code"
//             value={form.otp}
//             onChange={(e) => setForm({ ...form, otp: e.target.value })}
//             className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//           />
//           <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium">
//             {loading ? 'Verifying...' : 'Verify Email'}
//           </button>
//         </form>
//         <div className="mt-4 text-center text-sm text-slate-400">
//           <button type="button" onClick={handleResend} disabled={loading} className="text-indigo-300 hover:text-indigo-100">
//             Resend verification code
//           </button>
//         </div>
//         <p className="mt-4 text-center text-sm text-slate-400">
//           Already verified? <Link to="/login" className="text-indigo-400">Sign in</Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// }



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
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-white"
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <img
              src="https://res.cloudinary.com/de8ntd31m/image/upload/v1779644841/WhatsApp_Image_2026-05-24_at_11.10.05_PM_s64mny.jpg"
              alt="Gyaanmate"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-lg font-semibold text-blue-600 tracking-tight">Gyaanmate</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Verify Your Email</h1>
          <p className="text-sm text-gray-500 mb-7">
            Enter the OTP sent to your email to complete registration and sign in.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                required
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {loading ? 'Verifying...' : <>Verify Email <span>→</span></>}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              Resend verification code
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Already verified?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a6ef5 0%, #4facfe 50%, #74c0fc 100%)'
        }}
      >
        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-white rounded-full opacity-10 blur-2xl" />

        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 w-80 rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)'
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 4L4 11l14 7 14-7-14-7z" fill="white" opacity="0.9" />
                <path d="M4 18l14 7 14-7" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M4 25l14 7 14-7" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
          </div>

          <h3 className="text-white text-xl font-bold text-center mb-1">Seamless learning experience</h3>
          <p className="text-blue-100 text-sm text-center mb-5">
            Everything you need in one powerful, beautifully customizable platform.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '50K+', label: 'Active learners' },
              { value: '1.2K', label: 'Courses live' },
              { value: '98%', label: 'Satisfaction rate' },
              { value: '24/7', label: 'Learning support' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <p className="text-white text-lg font-bold leading-tight">{stat.value}</p>
                <p className="text-blue-100 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            <div className="w-5 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
