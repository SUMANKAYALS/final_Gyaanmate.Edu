import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/Footer';
import LearningCart from '../components/LearningCart';
import ChatBot from '../components/chat/ChatBot';
import { ChatProvider } from '../context/ChatContext';
import { pageVariants } from '../animations/motionVariants';
import useActivityTracker from '../hooks/useActivityTracker';

const SIDEBAR_STORAGE_KEY = 'gyaanmate-sidebar-desktop';

/** Default: collapsed (icons only), matching reference */
function readDesktopSidebarExpanded() {
  try {
    const v = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (v === null) return false;
    return v === 'open';
  } catch {
    return false;
  }
}

export default function MainLayout() {
  useActivityTracker();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(readDesktopSidebarExpanded);
  const location = useLocation();

  const toggleDesktopSidebar = useCallback(() => {
    setDesktopSidebarExpanded((open) => {
      const next = !open;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? 'open' : 'closed');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const handleMenuClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      toggleDesktopSidebar();
    } else {
      setMobileSidebarOpen(true);
    }
  }, [toggleDesktopSidebar]);

  return (
    <ChatProvider>
      <div className="min-h-screen flex">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          desktopExpanded={desktopSidebarExpanded}
          onToggleDesktop={toggleDesktopSidebar}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar
            onMenuClick={handleMenuClick}
            desktopSidebarOpen={desktopSidebarExpanded}
            onToggleDesktopSidebar={toggleDesktopSidebar}
            onCartClick={() => setCartOpen(true)}
          />

          <motion.main
            key={location.pathname}
            initial="initial"
            animate="animate"
            variants={pageVariants}
            className="flex-1 px-4 lg:px-8 py-6 pb-28 lg:pb-8"
          >
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </motion.main>

          <div className="hidden lg:block">
            <Footer />
          </div>
        </div>

        <MobileBottomNav />
        <LearningCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <ChatBot />
      </div>
    </ChatProvider>
  );
}
