import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  ShoppingCart,
  User,
  LineChart,
  GraduationCap,
  PanelLeftOpen,
  PanelLeftClose,
} from '../../lib/icons';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { getInitials } from '../../utils/avatar';
import CourseSearchBar from '../search/CourseSearchBar';

export default function TopNavbar({
  onMenuClick,
  onCartClick,
  desktopSidebarOpen = true,
  onToggleDesktopSidebar,
}) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { enrollmentCart } = useEnrollment();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const isAuth = !!user;

  const dashboardLink =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'instructor'
        ? '/instructor/dashboard'
        : '/student/dashboard';

  useEffect(() => {
    const close = () => {
      setProfileOpen(false);
      setNotifOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <header className="sticky top-0 z-20 glass border-b border-white/10">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-slate-300"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden lg:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition"
            aria-label={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {desktopSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          {!desktopSidebarOpen && (
            <Link to="/" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={18} />
              </div>
              <span className="font-bold gradient-text text-sm">GyaanMate</span>
            </Link>
          )}
        </div>

        <Link to="/" className="lg:hidden flex items-center gap-2 shrink-0">
          <GraduationCap className="text-violet-400" size={22} />
          <span className="font-bold gradient-text text-sm">GyaanMate</span>
        </Link>

        <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
          <CourseSearchBar className="w-full" placeholder="Search courses, topics, videos..." />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            className="p-2.5 rounded-xl hover:bg-white/10 text-slate-300 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl hover:bg-white/10 text-slate-300"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-72 glass rounded-2xl p-4 shadow-xl z-50"
                >
                  <p className="text-sm font-semibold text-white mb-2">Notifications</p>
                  <p className="text-xs text-slate-400">You&apos;re all caught up! Check back for course updates.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onCartClick}
            className="relative p-2.5 rounded-xl hover:bg-white/10 text-slate-300"
          >
            <ShoppingCart size={18} />
            {enrollmentCart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-violet-600 text-[10px] rounded-full flex items-center justify-center text-white font-bold">
                {enrollmentCart.length}
              </span>
            )}
          </motion.button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/10 transition"
            >
              {isAuth && user?.avatar ? (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40" />
              ) : isAuth ? (
                <span className="w-8 h-8 rounded-full bg-violet-600/60 flex items-center justify-center text-xs font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              ) : (
                <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <User size={16} className="text-slate-300" />
                </span>
              )}
              <span className="hidden md:inline text-sm text-slate-300 max-w-[100px] truncate">
                {isAuth ? user.name?.split(' ')[0] : 'Account'}
              </span>
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-56 glass rounded-2xl py-2 shadow-xl z-50"
                >
                  {isAuth ? (
                    <>
                      <Link to={dashboardLink} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5">
                        <LineChart size={16} /> Dashboard
                      </Link>
                      <Link to="/my-courses" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-white/5">
                        My Courses
                      </Link>
                      <Link to="/account" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-white/5">
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-white/5">Sign In</Link>
                      <Link to="/signup" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-violet-400 hover:bg-white/5">Create Account</Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <CourseSearchBar className="w-full" placeholder="Ask anything or search courses..." />
      </div>
    </header>
  );
}
