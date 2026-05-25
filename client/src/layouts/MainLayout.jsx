import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import Footer from '../components/Footer';
import LearningCart from '../components/LearningCart';
import FloatingAIChat from '../components/ai/FloatingAIChat';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import { pageVariants } from '../animations/motionVariants';

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen flex flex-col"
    >
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={false} />
        </div>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="lg:hidden">
              <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isMobile={true} />
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar 
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            isMobileMenuOpen={mobileMenuOpen}
          />
          
          <main className="flex-1 pb-20 lg:pb-0">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>

      <LearningCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <FloatingAIChat />
      <MobileBottomNav />
    </motion.div>
  );
}
