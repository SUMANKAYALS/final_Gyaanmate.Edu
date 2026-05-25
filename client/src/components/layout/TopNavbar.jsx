import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  GraduationCap,
  LineChart,
} from '../../lib/icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useEnrollment } from '../../context/EnrollmentContext';
import { getInitials } from '../../utils/avatar';

export default function TopNavbar({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { enrollmentCart } = useEnrollment();
  const navigate = useNavigate();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dashboardLink =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'instructor'
        ? '/instructor/dashboard'
        : '/student/dashboard';

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 glass border-b border-slate-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">GyaanMate</span>
            </Link>
          </div>

          {/* Center: Global Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, notes, videos..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 glass-card rounded-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-700/50">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={16} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white">New course available!</p>
                          <p className="text-xs text-slate-400">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <LineChart size={16} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white">Your progress increased!</p>
                          <p className="text-xs text-slate-400">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
              <ShoppingCart size={20} />
              {enrollmentCart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-xs rounded-full flex items-center justify-center">
                  {enrollmentCart.length}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/50 transition"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40" />
                ) : user ? (
                  <span className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User size={16} className="text-slate-400" />
                  </div>
                )}
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 glass-card rounded-xl overflow-hidden"
                  >
                    {user ? (
                      <>
                        <div className="p-4 border-b border-slate-700/50">
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to={dashboardLink}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
                          >
                            <LineChart size={16} />
                            <span className="text-sm">Dashboard</span>
                          </Link>
                          <Link
                            to="/account"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
                          >
                            <User size={16} />
                            <span className="text-sm">Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-800/50 transition"
                          >
                            <X size={16} />
                            <span className="text-sm">Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2">
                        <Link
                          to="/login"
                          onClick={() => setProfileOpen(false)}
                          className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition text-sm"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setProfileOpen(false)}
                          className="block px-3 py-2 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50 transition text-sm font-medium"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
