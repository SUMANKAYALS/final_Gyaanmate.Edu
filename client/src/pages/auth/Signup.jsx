// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useAuthStore } from '../../store/authStore';

// export default function Signup() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'student'
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const { register, user } = useAuthStore();

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/', { replace: true });
//     }
//   }, [user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (form.password !== form.confirmPassword) {
//       return toast.error('Passwords do not match');
//     }

//     setLoading(true);

//     try {
//       await register({
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         role: form.role
//       });

//       toast.success(
//         'Account created! Check your email for the verification code.'
//       );

//       navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Signup failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920')] bg-cover bg-center opacity-10"></div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md glass-card p-8 relative z-10"
//       >
//         <h2 className="text-2xl font-bold gradient-text text-center mb-6">
//           Join Gyaanmate
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Full Name */}
//           <input
//             required
//             placeholder="Full Name"
//             value={form.name}
//             onChange={(e) =>
//               setForm({ ...form, name: e.target.value })
//             }
//             className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//           />

//           {/* Email */}
//           <input
//             type="email"
//             required
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//             className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//           />

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               required
//               placeholder="Password"
//               value={form.password}
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//               className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
//             >
//               {showPassword ? (
//                 <FaEyeSlash size={18} />
//               ) : (
//                 <FaEye size={18} />
//               )}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               required
//               placeholder="Confirm Password"
//               value={form.confirmPassword}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   confirmPassword: e.target.value
//                 })
//               }
//               className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowConfirmPassword(!showConfirmPassword)
//               }
//               className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
//             >
//               {showConfirmPassword ? (
//                 <FaEyeSlash size={18} />
//               ) : (
//                 <FaEye size={18} />
//               )}
//             </button>
//           </div>

//           {/* Role */}
//           <select
//             value={form.role}
//             onChange={(e) =>
//               setForm({ ...form, role: e.target.value })
//             }
//             className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//           >
//             <option value="student">Student</option>
//             <option value="instructor">Instructor</option>
//           </select>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
//           >
//             {loading ? 'Creating...' : 'Create Account'}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-slate-400">
//           Have an account?{' '}
//           <Link to="/login" className="text-indigo-400">
//             Sign in
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { BRAND_LOGO_URL, BRAND_NAME } from '../../config/brand';

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

      toast.success('Account created! Check your email for the verification code.');
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
            src={BRAND_LOGO_URL}
            alt={`${BRAND_NAME} logo`}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="text-lg font-semibold text-blue-600 tracking-tight">{BRAND_NAME}</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Create an Account</h1>
        <p className="text-sm text-gray-500 mb-7">Fill in the details below to get started.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {loading ? 'Creating...' : <>Create Account <span>→</span></>}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-500">
          Already have an account?{' '}
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
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 4L4 11l14 7 14-7-14-7z" fill="white" opacity="0.9"/>
                <path d="M4 18l14 7 14-7" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
                <path d="M4 25l14 7 14-7" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
          </div>

          <h3 className="text-white text-xl font-bold text-center mb-1">Seamless learning experience</h3>
          <p className="text-blue-100 text-sm text-center mb-5">Everything you need in one powerful, beautifully customizable platform.</p>

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
