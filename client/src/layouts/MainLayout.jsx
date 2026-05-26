import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/Footer';
import LearningCart from '../components/LearningCart';
import ChatBot from '../components/chat/ChatBot';
import { pageVariants } from '../animations/motionVariants';

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen flex flex-col"
    >
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <Footer />
      <LearningCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ChatBot />
    </motion.div>
  );
}
