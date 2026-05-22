import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useAuthStore } from '../../store/authStore';
import { paymentAPI } from '../../services/api';

export default function Checkout() {
  const { enrollmentCart, getCartTotal, clearCart } = useEnrollment();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login', { state: { from: { pathname: '/checkout' } } });
    return null;
  }

  const handlePay = async () => {
    if (!enrollmentCart.length) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const courseIds = enrollmentCart.map((c) => c._id || c.id);
      const { data } = await paymentAPI.checkout(courseIds);
      clearCart();
      toast.success(`Payment successful! ${data.payments?.length} course(s) enrolled.`);
      navigate('/my-courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold gradient-text mb-6">Checkout</h1>
      <div className="glass-card p-6 space-y-4">
        {enrollmentCart.map((c) => (
          <motion.div key={c._id || c.id} className="flex justify-between text-sm">
            <span>{c.title}</span>
            <span className="text-emerald-400">${c.price?.toFixed(2)}</span>
          </motion.div>
        ))}
        <div className="border-t border-slate-700 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-emerald-400">${getCartTotal().toFixed(2)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium"
        >
          {loading ? 'Processing...' : 'Complete Payment'}
        </motion.button>
        <p className="text-xs text-slate-500 text-center">Receipt will be available in your dashboard</p>
      </div>
    </motion.div>
  );
}
