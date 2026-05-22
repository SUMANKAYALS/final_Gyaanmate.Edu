import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Home } from '../lib/icons';
import { pageVariants, sidebarVariants } from '../animations/motionVariants';

export default function DashboardLayout({ title, links }) {
  const location = useLocation();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen flex">
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate="open"
        className="w-64 glass border-r border-slate-700/50 p-4 hidden md:block"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 text-lg font-bold">
          <GraduationCap className="text-indigo-400" />
          <span className="gradient-text">LearnHub</span>
        </Link>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">{title}</p>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                location.pathname === l.to
                  ? 'bg-indigo-600/30 text-indigo-300'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-2 px-3 py-2 mt-6 text-sm text-slate-500 hover:text-white">
            <Home size={16} /> Back to site
          </Link>
        </nav>
      </motion.aside>
      <motion.div className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </motion.div>
    </motion.div>
  );
}
