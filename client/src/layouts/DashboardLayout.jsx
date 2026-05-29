import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from '../lib/icons';
import { pageVariants, sidebarVariants } from '../animations/motionVariants';
import { BRAND_LOGO_URL, BRAND_NAME } from '../config/brand';

export default function DashboardLayout({ title, links }) {
  const location = useLocation();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen flex bg-[#0b0b0f]">
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate="open"
        className="w-64 glass border-r border-violet-500/20 p-4 hidden md:block"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 text-lg font-bold">
          <img
            src={BRAND_LOGO_URL}
            alt={`${BRAND_NAME} logo`}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-violet-400/30"
          />
          <span className="gradient-text">{BRAND_NAME}</span>
        </Link>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">{title}</p>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block px-3 py-2.5 rounded-xl text-sm transition ${
                location.pathname === l.to
                  ? 'sidebar-active'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 mt-6 text-sm text-slate-500 hover:text-violet-300">
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
