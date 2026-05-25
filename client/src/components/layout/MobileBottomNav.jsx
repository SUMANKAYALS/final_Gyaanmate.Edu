import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  FileText,
  GraduationCap,
  Flame,
  User,
} from '../../lib/icons';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/browse', icon: BookOpen, label: 'Courses' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/my-courses', icon: GraduationCap, label: 'My Learning' },
  { to: '/streaks', icon: Flame, label: 'Streaks' },
  { to: '/account', icon: User, label: 'Profile' },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-slate-700/50 px-2 py-2"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                transition-all duration-200
                ${isActive 
                  ? 'text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-300'
                }
              `}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeMobileNav"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}
