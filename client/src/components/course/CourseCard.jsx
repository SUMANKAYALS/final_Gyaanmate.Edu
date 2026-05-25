import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock, Heart, ShoppingCart, Bookmark } from '../../lib/icons';
import { getMediaUrl } from '../../utils/media';
import { cardHover } from '../../animations/motionVariants';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function CourseCard({ course }) {
  const id = course._id || course.id;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover">
      <Card hover className="overflow-hidden group">
        <Link to={`/course/${id}`}>
          <div className="relative h-48 overflow-hidden">
            <img
              src={getMediaUrl(course.image)}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="primary" size="sm">{course.category}</Badge>
            </div>
            {course.discount && (
              <div className="absolute top-3 right-3">
                <Badge variant="danger" size="sm">-{course.discount}% OFF</Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
        <div className="p-5">
          <Link to={`/course/${id}`}>
            <h3 className="font-semibold text-white line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-300 transition">
              {course.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-400 mt-2">{course.instructorName || course.instructor?.name}</p>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Star size={14} className="fill-current" /> {course.rating?.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {(course.students || 0).toLocaleString()} students
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {course.duration}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-400">${course.price?.toFixed(2)}</span>
              {course.originalPrice && (
                <span className="text-sm text-slate-500 line-through">${course.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <Badge variant="secondary" size="sm">{course.level}</Badge>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition border border-slate-600/50"
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-400' : ''} />
              <span className="text-sm">Wishlist</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition border border-slate-600/50"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
