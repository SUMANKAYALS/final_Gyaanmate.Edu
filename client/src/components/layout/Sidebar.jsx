import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Home,
  BookOpen,
  Search,
  FileText,
  GraduationCap,
  Bookmark,
  ClipboardList,
  Flame,
  Crown,
  Library,
  Info,
  Mail,
  Shield,
  Settings,
  X,
  Menu,
  Sparkles,
  Moon,
  Sun,
} from '../../lib/icons';
import { useTheme } from '../../context/ThemeContext';
import { sidebarVariants } from '../../animations/motionVariants';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/browse', icon: BookOpen, label: 'Courses' },
  { to: '/#ai-search', icon: Search, label: 'AI Search' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/my-courses', icon: GraduationCap, label: 'My Learning' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/mock-tests', icon: ClipboardList, label: 'Mock Tests' },
  { to: '/streaks', icon: Flame, label: 'Streaks' },
  { to: '/subscription', icon: Crown, label: 'Subscription' },
  { to: '/study', icon: Library, label: 'Study Material' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/contact', icon: Mail, label: 'Contact Us' },
  { to: '/privacy-policy', icon: Shield, label: 'Privacy Policy' },
  { to: '/account', icon: Settings, label: 'Settings' },
];

const featureList = [
  { title: "AI Note Converter", icon: Sparkles, path: "/feature/note-converter" },
  { title: "Notes Upload", icon: FileText, path: "/feature/notes-upload" },
  { title: "Study Material", icon: Library, path: "/study" },
  { title: "Career Roadmap", icon: GraduationCap, path: "/career-roadmap" },
  { title: "Smart Video Curation", icon: Search, path: "/feature/video-curation" },
  { title: "Interactive Chat", icon: Sparkles, path: "/feature/interactive-chat" },
  { title: "Focus Assistance", icon: Flame, path: "/feature/focus-assistance" },
  { title: "Mock Test Generator", icon: ClipboardList, path: "/feature/mock-test" },
  { title: "Gamified Streaks", icon: Flame, path: "/feature/streaks" },
];

export default function Sidebar({ isOpen, onClose, isMobile }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.to || (item.to.startsWith('/#') && location.hash === item.to.substring(1));
    
    return (
      <NavLink
        to={item.to}
        onClick={onClick}
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-200 group
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border border-indigo-500/30' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }
        `}
      >
        <item.icon size={20} className={isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'} />
        <span className="font-medium">{item.label}</span>
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </NavLink>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">GyaanMate</span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-2">Main Menu</p>
        {navItems.slice(0, 6).map((item) => (
          <NavItem key={item.to} item={item} onClick={isMobile ? onClose : undefined} />
        ))}

        <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-2 mt-6">Learning</p>
        {navItems.slice(6, 10).map((item) => (
          <NavItem key={item.to} item={item} onClick={isMobile ? onClose : undefined} />
        ))}

        <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-2 mt-6">AI Features</p>
        <button
          onClick={() => setFeaturesOpen(!featuresOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={20} />
            <span className="font-medium">AI Tools</span>
          </div>
          <motion.div
            animate={{ rotate: featuresOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </button>

        <AnimatePresence>
          {featuresOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1 pl-4"
            >
              {featureList.map((feature) => (
                <NavLink
                  key={feature.path}
                  to={feature.path}
                  onClick={isMobile ? onClose : undefined}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all text-sm"
                >
                  <feature.icon size={16} />
                  <span>{feature.title}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-2 mt-6">Other</p>
        {navItems.slice(10).map((item) => (
          <NavItem key={item.to} item={item} onClick={isMobile ? onClose : undefined} />
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 glass border-r border-slate-700/50"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      className={`
        fixed left-0 top-0 h-full w-64 glass border-r border-slate-700/50 z-40
        transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}
    >
      {sidebarContent}
    </motion.aside>
  );
}
