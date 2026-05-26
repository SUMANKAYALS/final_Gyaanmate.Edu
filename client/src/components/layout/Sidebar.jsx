import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  X,
  ChevronLeft,
  Crown,
  Settings,
} from '../../lib/icons';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../utils/avatar';
import { mainNavLinks, featureList, infoNavLinks } from '../../config/navigation';
import { useChat } from '../../context/ChatContext';
import { NavIcon } from './IconMap';
import SidebarItem from './SidebarItem';

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 260;

function SectionLabel({ children, expanded }) {
  if (!expanded) return null;
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="gyaan-sidebar-section-label"
    >
      {children}
    </motion.p>
  );
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  desktopExpanded,
  onToggleDesktop,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { openChat } = useChat();
  const isAuth = !!user;
  const [featuresOpen, setFeaturesOpen] = useState(true);

  const isExpanded = desktopExpanded;
  const width = isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const isActive = (item) => {
    const path = location.pathname;
    if (item.end) return path === item.to;
    return path === item.to;
  };

  const isFeatureActive = (path) => location.pathname === path;

  const handleFeature = (feature) => {
    if (feature.action === 'openChat') {
      openChat();
      onMobileClose?.();
      return;
    }
    if (feature.auth && !isAuth) {
      navigate('/login');
      onMobileClose?.();
      return;
    }
    navigate(feature.path);
    onMobileClose?.();
  };

  const isFeatureItemActive = (feature) => {
    if (feature.action === 'openChat') return false;
    return location.pathname === feature.path;
  };

  const visibleNav = mainNavLinks.filter((item) => !item.auth || isAuth);

  const sidebarBody = (forceExpanded = false) => {
    const expanded = forceExpanded || isExpanded;

    return (
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div
          className={`shrink-0 flex items-center border-b border-white/10 ${
            expanded ? 'justify-between px-4 h-14' : 'justify-center h-14'
          }`}
        >
          <Link
            to="/"
            onClick={() => onMobileClose?.()}
            className={`flex items-center gap-2.5 min-w-0 ${expanded ? '' : 'justify-center'}`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/25">
              <GraduationCap className="text-white" size={20} />
            </div>
            {expanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-white text-base tracking-tight truncate"
              >
                GyaanMate
              </motion.span>
            )}
          </Link>

          {expanded && (
            <button
              type="button"
              onClick={onToggleDesktop}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          <SectionLabel expanded={expanded}>Explorer</SectionLabel>
          <nav className="space-y-0.5">
            {visibleNav.map((item) => (
              <SidebarItem
                key={item.id}
                to={item.to}
                label={item.label}
                active={isActive(item)}
                expanded={expanded}
                onClick={() => onMobileClose?.()}
                icon={<NavIcon name={item.icon} size={expanded ? 18 : 22} />}
              />
            ))}
          </nav>

          <div className={expanded ? 'mt-4' : 'mt-3'}>
            {expanded && (
              <button
                type="button"
                onClick={() => setFeaturesOpen((o) => !o)}
                className="gyaan-sidebar-section-label w-full flex items-center justify-between hover:text-slate-300"
              >
                <span>Features</span>
                <span className="text-[10px] opacity-60">{featuresOpen ? '▼' : '▶'}</span>
              </button>
            )}
            {!expanded && <div className="mx-3 mb-2 border-t border-white/10" aria-hidden />}
            {(expanded ? featuresOpen : true) && (
              <div className={`space-y-0.5 ${expanded ? 'mt-1' : ''}`}>
                {featureList.map((f) => (
                  <SidebarItem
                    key={f.title}
                    asButton
                    label={f.title}
                    active={isFeatureItemActive(f)}
                    expanded={expanded}
                    onClick={() => handleFeature(f)}
                    icon={<f.icon size={expanded ? 16 : 20} className="text-violet-400" />}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={expanded ? 'mt-4' : 'mt-3'}>
            {!expanded && <div className="mx-3 mb-2 border-t border-white/10" aria-hidden />}
            <SectionLabel expanded={expanded}>Information</SectionLabel>
            <nav className={`space-y-0.5 ${expanded ? 'mt-1' : ''}`}>
              {infoNavLinks.map((item) => (
                <SidebarItem
                  key={item.id}
                  to={item.to}
                  label={item.label}
                  active={isFeatureActive(item.to)}
                  expanded={expanded}
                  onClick={() => onMobileClose?.()}
                  icon={<NavIcon name={item.icon} size={expanded ? 18 : 22} />}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className={`shrink-0 border-t border-white/10 ${expanded ? 'p-3 space-y-2' : 'py-3 flex flex-col items-center gap-2'}`}>
          {expanded ? (
            <>
              <Link
                to="/subscription"
                onClick={() => onMobileClose?.()}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/30 transition"
              >
                <Crown size={16} />
                Upgrade to Pro
              </Link>
              {isAuth ? (
                <Link
                  to="/account"
                  onClick={() => onMobileClose?.()}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-violet-500/40 object-cover" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-violet-600/60 flex items-center justify-center text-xs font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-violet-400">View profile</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => onMobileClose?.()}
                  className="block text-center text-sm text-violet-400 hover:text-violet-300 py-2"
                >
                  Sign in
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/account"
                title="Settings"
                className={`gyaan-sidebar-item w-11 h-11 flex items-center justify-center rounded-lg ${
                  location.pathname === '/account'
                    ? 'gyaan-sidebar-item--active-collapsed'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings size={22} />
                <span className="gyaan-sidebar-tooltip">Settings</span>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop unified sidebar */}
      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="gyaan-sidebar hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:shrink-0 z-30 overflow-hidden"
      >
        {sidebarBody(false)}
      </motion.aside>

      {/* Mobile drawer — always expanded */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="gyaan-sidebar fixed left-0 top-0 bottom-0 z-50 lg:hidden"
              style={{ width: EXPANDED_WIDTH }}
            >
              {sidebarBody(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
