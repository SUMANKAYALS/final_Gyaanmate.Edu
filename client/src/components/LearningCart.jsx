import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from '../lib/icons';
import { useEnrollment } from '../context/EnrollmentContext';
import { modalVariants } from '../animations/motionVariants';
import { getMediaUrl } from '../utils/media';

export default function LearningCart({ isOpen, onClose }) {
  const { enrollmentCart, removeFromCart, getCartTotal } = useEnrollment();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-md glass z-50 flex flex-col border-l border-slate-700/50"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
              <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="flex items-center gap-2">
                <ShoppingCart className="text-indigo-400" />
                <h2 className="text-xl font-bold">Learning Cart</h2>
              </motion.div>
              <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {enrollmentCart.length === 0 ? (
                <p className="text-center text-slate-500 py-12">Your cart is empty</p>
              ) : (
                enrollmentCart.map((course) => (
                  <motion.div
                    key={course._id || course.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-4 mb-3 flex gap-3"
                  >
                    <img src={getMediaUrl(course.image)} alt="" className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{course.title}</p>
                      <p className="text-emerald-400 text-sm">${course.price?.toFixed(2)}</p>
                      <button onClick={() => removeFromCart(course._id || course.id)} className="text-xs text-red-400 mt-1">Remove</button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {enrollmentCart.length > 0 && (
              <div className="p-6 border-t border-slate-700/50">
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="flex justify-between mb-4 font-bold text-lg"
                >
                  <span>Total</span>
                  <span className="text-emerald-400">${getCartTotal().toFixed(2)}</span>
                </motion.div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
