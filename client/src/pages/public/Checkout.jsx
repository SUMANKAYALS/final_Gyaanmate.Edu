import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useAuthStore } from '../../store/authStore';
import { paymentAPI } from '../../services/api';
import SuggestedCourseRail from '../../components/recommendations/SuggestedCourseRail';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/currency';

export default function Checkout() {
  const { enrollmentCart, getCartTotal, clearCart } = useEnrollment();
  const user = useAuthStore((s) => s.user);
  const { theme } = useTheme();
  const isLight = theme === 'light';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold gradient-text">Checkout</h1>
      <div className={`mx-auto max-w-lg rounded-xl border p-6 shadow-sm ${isLight ? 'border-blue-100 bg-white' : 'border-violet-500/20 bg-slate-900/70'} space-y-4`}>
        {enrollmentCart.map((c) => (
          <motion.div key={c._id || c.id} className="flex justify-between text-sm">
            <span>{c.title}</span>
            <span className="text-emerald-400">{formatCurrency(c.price)}</span>
          </motion.div>
        ))}
        <div className="border-t border-slate-700 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-emerald-400">{formatCurrency(getCartTotal())}</span>
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
      {enrollmentCart.length > 0 && (
        <div className="mt-8">
          <SuggestedCourseRail
            cartCourses={enrollmentCart}
            title="Recommended add-ons"
            subtitle="People who buy courses like these often add one more skill"
            compact={false}
            limit={4}
          />
        </div>
      )}
    </motion.div>
  );
}
