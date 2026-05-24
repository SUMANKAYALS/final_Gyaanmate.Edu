// import { useEffect, useState } from 'react';
// import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useAuthStore } from '../../store/authStore';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { login, user } = useAuthStore();

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();

//   const from =
//     searchParams.get('from') ||
//     location.state?.from?.pathname ||
//     '/';

//   useEffect(() => {
//     if (user) {
//       navigate(from, { replace: true });
//       return;
//     }

//     if (searchParams.get('session') === 'expired') {
//       toast.error('Your session expired. Please sign in again.');
//       window.__learnhubRedirecting = false;
//     }
//   }, [user, searchParams, from, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await login(email, password);

//       toast.success('Welcome back!');
//       navigate(from, { replace: true });
//     } catch (err) {
//       const status = err.response?.status;
//       const message = err.response?.data?.message;

//       if (status === 403 && message?.includes('not verified')) {
//         toast.error(message);
//         navigate(`/verify-email?email=${encodeURIComponent(email)}`);
//         return;
//       }

//       toast.error(message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920')] bg-cover bg-center opacity-10"></div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md glass-card p-8 relative z-10"
//       >
//         <h2 className="text-2xl font-bold gradient-text text-center mb-6">
//           Sign In to Gyaanmate
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Email */}
//           <input
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//           />

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800/80 border border-slate-600 text-white backdrop-blur-sm"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
//             >
//               {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
//             </button>
//           </div>

//           <div className="text-right">
//             <Link
//               to={email ? `/forgot-password?email=${encodeURIComponent(email)}` : '/forgot-password'}
//               className="text-sm text-indigo-400 hover:text-indigo-300"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-slate-400">
//           No account?{' '}
//           <Link to="/signup" className="text-indigo-400">
//             Sign up
//           </Link>
//         </p>
//         {/* <div className="mt-4 p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 space-y-1 backdrop-blur-sm">
//           <p className="font-medium text-slate-300">Demo accounts (after seed):</p>
//           <p>Admin: admin@learnhub.ai / admin123</p>
//           <p>Instructor: instructor1@learnhub.ai / instructor123</p>
//           <p className="text-slate-500 pt-1">If login fails, run <code className="text-indigo-300">npm run seed</code> in the project folder, then try again.</p>
//         </div> */}
//       </motion.div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

const LOGO_URL =
  'https://res.cloudinary.com/de8ntd31m/image/upload/v1779644841/WhatsApp_Image_2026-05-24_at_11.10.05_PM_s64mny.jpg';

export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const { login, user } = useAuthStore();
  const navigate        = useNavigate();
  const location        = useLocation();
  const [searchParams]  = useSearchParams();

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
      const status  = err.response?.status;
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .gm-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL ── */
        .gm-left {
          flex: 0 0 48%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 72px;
          position: relative;
        }

        .gm-form-box {
          width: 100%;
          max-width: 360px;
        }

        /* Logo row */
        .gm-logo-row {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 36px;
        }

        .gm-logo-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .gm-brand {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #0ea5e9, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gm-heading {
          font-size: 27px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .gm-sub {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 400;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        /* Fields */
        .gm-field { margin-bottom: 18px; }

        .gm-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }

        .gm-input {
          width: 100%;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
        }

        .gm-input::placeholder { color: #c0ccd8; }

        .gm-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3.5px rgba(56, 189, 248, 0.14);
          background: #fff;
        }

        .gm-pw-wrap { position: relative; }

        .gm-pw-toggle {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }

        .gm-pw-toggle:hover { color: #0ea5e9; }

        /* Remember / Forgot row */
        .gm-mid-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 6px 0 22px;
        }

        .gm-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }

        .gm-remember input[type='checkbox'] {
          width: 15px;
          height: 15px;
          accent-color: #0ea5e9;
          cursor: pointer;
          border-radius: 4px;
        }

        .gm-forgot-link {
          font-size: 13px;
          font-weight: 600;
          color: #0ea5e9;
          text-decoration: none;
          transition: color 0.2s;
        }
        .gm-forgot-link:hover { color: #0284c7; }

        /* Submit btn */
        .gm-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: box-shadow 0.25s, transform 0.18s, opacity 0.2s;
          box-shadow: 0 4px 18px rgba(14, 165, 233, 0.3);
        }

        .gm-btn:hover:not(:disabled) {
          box-shadow: 0 8px 28px rgba(14, 165, 233, 0.45);
          transform: translateY(-1px);
        }

        .gm-btn:active:not(:disabled) { transform: translateY(0); }

        .gm-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes gm-spin { to { transform: rotate(360deg); } }

        .gm-spinner {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: gm-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .gm-footer-text {
          margin-top: 22px;
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
        }

        .gm-signup-link {
          color: #0ea5e9;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }
        .gm-signup-link:hover { color: #0284c7; }

        /* ── RIGHT PANEL ── */
        .gm-right {
          flex: 0 0 52%;
          background: linear-gradient(145deg, #1d4ed8 0%, #2563eb 30%, #0ea5e9 75%, #38bdf8 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }

        /* Grid texture */
        .gm-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }

        /* Soft bg blobs */
        .gm-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          opacity: 0.25;
        }

        /* Floating glass card */
        @keyframes gm-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }

        .gm-glass-card {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.13);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 28px;
          padding: 36px 32px 30px;
          width: 100%;
          max-width: 420px;
          animation: gm-float 5.5s ease-in-out infinite;
          box-shadow:
            0 24px 64px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.35);
        }

        /* Illustration */
        .gm-illus-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .gm-card-title {
          font-size: 21px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
          line-height: 1.25;
        }

        .gm-card-sub {
          font-size: 13.5px;
          color: rgba(255,255,255,0.72);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        /* Stats grid */
        .gm-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }

        .gm-stat-box {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          padding: 14px 16px;
        }

        .gm-stat-num {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .gm-stat-lbl {
          font-size: 11.5px;
          color: rgba(255,255,255,0.62);
          margin-top: 4px;
          font-weight: 500;
        }

        /* Dot indicators */
        .gm-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .gm-dot {
          height: 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.38);
          transition: all 0.3s;
        }

        .gm-dot.on {
          width: 26px;
          background: rgba(255,255,255,0.92);
        }

        .gm-dot.off { width: 8px; }

        /* Responsive */
        @media (max-width: 860px) {
          .gm-right { display: none; }
          .gm-left  { flex: 1; padding: 40px 28px; }
        }
      `}</style>

      <div className="gm-root">

        {/* ══════════════ LEFT — FORM PANEL ══════════════ */}
        <motion.div
          className="gm-left"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="gm-form-box">

            {/* Logo + Brand */}
            <div className="gm-logo-row">
              <img
                src={LOGO_URL}
                alt="Gyaanmate logo"
                className="gm-logo-img"
              />
              <span className="gm-brand">Gyaanmate</span>
            </div>

            <h1 className="gm-heading">Welcome Back!</h1>
            <p className="gm-sub">Please enter your details to continue.</p>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="gm-field">
                <label className="gm-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="gm-input"
                />
              </div>

              {/* Password */}
              <div className="gm-field">
                <label className="gm-label">Password</label>
                <div className="gm-pw-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="gm-input"
                    style={{ paddingRight: 46 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="gm-pw-toggle"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="gm-mid-row">
                <label className="gm-remember">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link
                  to={email ? `/forgot-password?email=${encodeURIComponent(email)}` : '/forgot-password'}
                  className="gm-forgot-link"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="gm-btn">
                {loading ? (
                  <>
                    <span className="gm-spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Login
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            <p className="gm-footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="gm-signup-link">Sign Up</Link>
            </p>

          </div>
        </motion.div>

        {/* ══════════════ RIGHT — DECORATIVE PANEL ══════════════ */}
        <motion.div
          className="gm-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75 }}
        >
          {/* Textures & blobs */}
          <div className="gm-grid" />
          <div className="gm-blob" style={{ width: 420, height: 420, background: '#fff', top: -140, right: -100 }} />
          <div className="gm-blob" style={{ width: 300, height: 300, background: '#fff', bottom: -80, left: -60 }} />
          <div className="gm-blob" style={{ width: 180, height: 180, background: '#bfdbfe', top: '40%', left: '6%' }} />

          {/* Floating glass card */}
          <div className="gm-glass-card">

            {/* SVG Illustration */}
            <div className="gm-illus-wrap">
              <EducationIllustration />
            </div>

            <h2 className="gm-card-title">Seamless learning experience</h2>
            <p className="gm-card-sub">
              Everything you need in one powerful, beautifully customizable platform.
            </p>

            {/* Stats */}
            <div className="gm-stats">
              <div className="gm-stat-box">
                <div className="gm-stat-num">50K+</div>
                <div className="gm-stat-lbl">Active learners</div>
              </div>
              <div className="gm-stat-box">
                <div className="gm-stat-num">1.2K</div>
                <div className="gm-stat-lbl">Courses live</div>
              </div>
              <div className="gm-stat-box">
                <div className="gm-stat-num">98%</div>
                <div className="gm-stat-lbl">Satisfaction rate</div>
              </div>
              <div className="gm-stat-box">
                <div className="gm-stat-num">24/7</div>
                <div className="gm-stat-lbl">Learning support</div>
              </div>
            </div>

            {/* Dots */}
            <div className="gm-dots">
              <div className="gm-dot on" />
              <div className="gm-dot off" />
              <div className="gm-dot off" />
            </div>

          </div>
        </motion.div>

      </div>
    </>
  );
}

/* ─── Education SVG Illustration ─── */
function EducationIllustration() {
  return (
    <svg width="240" height="160" viewBox="0 0 240 160" fill="none">
      {/* Desk */}
      <rect x="30" y="118" width="180" height="10" rx="5" fill="rgba(255,255,255,0.22)" />

      {/* Monitor */}
      <rect x="80" y="60" width="80" height="54" rx="6" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
      <rect x="86" y="66" width="68" height="42" rx="3" fill="rgba(255,255,255,0.1)" />
      {/* Screen content lines */}
      <rect x="92" y="72" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
      <rect x="92" y="79" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="92" y="86" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="92" y="93" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      {/* Monitor stand */}
      <rect x="116" y="114" width="8" height="6" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="108" y="118" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />

      {/* Open Book - left */}
      <rect x="30" y="95" width="44" height="28" rx="4" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
      <line x1="52" y1="95" x2="52" y2="123" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      <rect x="34" y="102" width="14" height="2.5" rx="1.2" fill="rgba(255,255,255,0.45)" />
      <rect x="34" y="108" width="11" height="2.5" rx="1.2" fill="rgba(255,255,255,0.3)" />
      <rect x="34" y="114" width="13" height="2.5" rx="1.2" fill="rgba(255,255,255,0.3)" />
      <rect x="55" y="102" width="14" height="2.5" rx="1.2" fill="rgba(255,255,255,0.45)" />
      <rect x="55" y="108" width="10" height="2.5" rx="1.2" fill="rgba(255,255,255,0.3)" />
      <rect x="55" y="114" width="12" height="2.5" rx="1.2" fill="rgba(255,255,255,0.3)" />

      {/* Graduation cap */}
      <polygon points="120,18 96,30 120,42 144,30" fill="rgba(255,255,255,0.75)" />
      <rect x="117" y="30" width="6" height="16" rx="2" fill="rgba(255,255,255,0.6)" />
      <line x1="144" y1="30" x2="144" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="144" cy="44" r="4" fill="rgba(255,255,255,0.65)" />

      {/* Pencil - right */}
      <rect x="178" y="88" width="8" height="32" rx="3" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
      <polygon points="178,120 186,120 182,128" fill="rgba(255,255,255,0.4)" />
      <rect x="178" y="88" width="8" height="6" rx="2" fill="rgba(255,255,255,0.5)" />

      {/* Stars / sparkles */}
      <circle cx="22" cy="52" r="4" fill="rgba(255,255,255,0.55)" />
      <circle cx="214" cy="42" r="3" fill="rgba(255,255,255,0.45)" />
      <circle cx="210" cy="110" r="4.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="34" cy="74" r="3" fill="rgba(255,255,255,0.4)" />

      {/* Small sparkle lines */}
      <line x1="22" y1="44" x2="22" y2="42" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="52" x2="16" y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="52" x2="28" y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}