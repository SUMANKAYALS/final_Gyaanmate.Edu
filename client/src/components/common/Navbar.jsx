import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LineChart, ChevronDown, Sparkles, FileText } from '../../lib/icons';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../utils/avatar';
import { useEnrollment } from '../../context/EnrollmentContext';
import { categoryAPI } from '../../services/api';
import CourseSearchBar from '../search/CourseSearchBar';
import { BRAND_LOGO_URL, BRAND_NAME } from '../../config/brand';
export default function Navbar({ onCartClick }) {
  const { user, logout } = useAuthStore();
  const { enrollmentCart } = useEnrollment();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const isAuth = !!user;

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  const dashboardLink =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'instructor'
        ? '/instructor/dashboard'
        : '/student/dashboard';

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b border-slate-700/50">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="flex flex-col gap-3 py-3 lg:py-0 lg:flex-row lg:justify-between lg:h-16 lg:items-center"
        >
          <div className="flex justify-between items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold shrink-0">
            <img
              src={BRAND_LOGO_URL}
              alt={`${BRAND_NAME} logo`}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-400/30"
            />
            <span className="gradient-text">{BRAND_NAME}</span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCartClick}
              className="relative p-2 text-slate-300 hover:text-white"
            >
              <ShoppingCart className="text-xl" />
              {enrollmentCart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-xs rounded-full flex items-center justify-center">
                  {enrollmentCart.length}
                </span>
              )}
            </motion.button>
            <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          </div>

          <CourseSearchBar className="w-full lg:max-w-xl lg:mx-4 lg:flex-1" />

          <motion.div className="hidden lg:flex items-center gap-1 shrink-0">
            <motion.div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-indigo-300 rounded-lg hover:bg-slate-800/50 transition"
              >
                Categories
                <ChevronDown size={16} className={categoriesOpen ? 'rotate-180' : ''} />
              </button>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 top-full mt-1 w-72 max-h-80 overflow-y-auto glass rounded-xl py-2 shadow-xl z-50 grid grid-cols-1"
                  >
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/category/${c.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-indigo-300"
                      >
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                        {c.courseCount > 0 && (
                          <span className="ml-auto text-xs text-slate-500">{c.courseCount}</span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <Link to="/browse" className="px-3 py-2 text-sm text-slate-300 hover:text-indigo-300 rounded-lg hover:bg-slate-800/50">
              All Courses
            </Link>
            <Link to="/notes" className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-300 hover:text-indigo-300 rounded-lg hover:bg-slate-800/50">
              <FileText size={16} />
              Study Materials
            </Link>
            <Link to="/subscription" className="px-3 py-2 text-sm text-slate-300 hover:text-indigo-300 rounded-lg hover:bg-slate-800/50">
              Subscription
            </Link>
            <Link
              to="/#ai-search"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-violet-300 hover:text-violet-200 rounded-lg hover:bg-violet-500/10 border border-transparent hover:border-violet-500/30 transition"
            >
              <Sparkles size={15} />
              AI Search
            </Link>
          </motion.div>

          <motion.div className="hidden lg:flex items-center gap-3 shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCartClick}
              className="relative p-2 text-slate-300 hover:text-white"
            >
              <ShoppingCart className="text-xl" />
              {enrollmentCart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-xs rounded-full flex items-center justify-center">
                  {enrollmentCart.length}
                </span>
              )}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50"
              >
                {isAuth && user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40" />
                ) : isAuth ? (
                  <span className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                ) : (
                  <User size={20} />
                )}
                <span className="hidden sm:inline text-sm max-w-[120px] truncate">
                  {isAuth ? user.name : 'Account'}
                </span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 glass rounded-xl py-2 shadow-xl"
                  >
                    {isAuth ? (
                      <>
                        <Link to={dashboardLink} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800/50 text-sm">
                          <LineChart size={16} /> Dashboard
                        </Link>
                        <Link to="/my-courses" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-slate-800/50 text-sm">My Courses</Link>
                        <Link to="/account" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-slate-800/50 text-sm">Profile & Avatar</Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800/50 text-sm">
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-slate-800/50 text-sm">Sign In</Link>
                        <Link to="/signup" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-indigo-400 hover:bg-slate-800/50 text-sm">Create Account</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-slate-700/50 px-4 py-3 max-h-[32rem] overflow-y-auto"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">All Categories</p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-300"
              >
                <span>{c.icon}</span>
                {c.name}
              </Link>
            ))}
            <Link to="/browse" onClick={() => setMobileOpen(false)} className="block py-2 text-indigo-300 font-medium border-t border-slate-700/50 mt-2">
              All Courses
            </Link>
            <Link to="/notes" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-slate-300 hover:text-indigo-300">
              <FileText size={16} />
              Study Materials
            </Link>
            <Link to="/subscription" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-300 hover:text-indigo-300">
              Subscription
            </Link>
            <Link
              to="/#ai-search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-violet-300 font-medium"
            >
              <Sparkles size={16} />
              AI Search
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
