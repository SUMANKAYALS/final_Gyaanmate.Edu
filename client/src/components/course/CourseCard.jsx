import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock, Heart, ShoppingCart } from '../../lib/icons';
import { getMediaUrl } from '../../utils/media';
import { cardHover } from '../../animations/motionVariants';
import { useEnrollment } from '../../context/EnrollmentContext';
import toast from 'react-hot-toast';

export default function CourseCard({ course, showDiscount = true }) {
  const id = course._id || course.id;
  const { addToCart } = useEnrollment();
  const originalPrice = course.originalPrice || course.price * 1.4;
  const hasDiscount = showDiscount && originalPrice > course.price;

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(course);
    toast.success('Added to cart');
  };

  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover" className="glass-card overflow-hidden group relative">
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500 text-white">
          {Math.round((1 - course.price / originalPrice) * 100)}% OFF
        </span>
      )}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); toast.success('Added to wishlist'); }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900 transition opacity-0 group-hover:opacity-100"
        aria-label="Wishlist"
      >
        <Heart size={16} />
      </button>

      <Link to={`/course/${id}`}>
        <div className="relative h-44 overflow-hidden">
          <img
            src={getMediaUrl(course.image)}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs rounded-full bg-violet-600/90 text-white backdrop-blur-sm">
            {course.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 min-h-[2.75rem] group-hover:text-violet-300 transition text-sm leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 truncate">{course.instructorName || course.instructor?.name || 'Instructor'}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-0.5 text-amber-400 font-medium">
              <Star size={12} className="fill-current" /> {course.rating?.toFixed(1) || '4.5'}
            </span>
            <span className="flex items-center gap-0.5">
              <Users size={12} /> {(course.students || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock size={12} /> {course.duration || '—'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-400">${course.price?.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">{course.level}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 -mt-1">
        <button
          type="button"
          onClick={handleCart}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:from-violet-600 hover:to-indigo-600 text-white text-sm font-medium transition opacity-0 group-hover:opacity-100"
        >
          <ShoppingCart size={14} /> Add to cart
        </button>
      </div>
    </motion.div>
  );
}
