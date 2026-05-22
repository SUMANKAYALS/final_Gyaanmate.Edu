import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock } from '../../lib/icons';
import { getMediaUrl } from '../../utils/media';
import { cardHover } from '../../animations/motionVariants';

export default function CourseCard({ course }) {
  const id = course._id || course.id;
  return (
  <motion.div variants={cardHover} initial="rest" whileHover="hover" className="glass-card overflow-hidden group">
      <Link to={`/course/${id}`}>
        <div className="relative h-44 overflow-hidden">
          <img
            src={getMediaUrl(course.image)}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs rounded-full bg-indigo-600/90 text-white">
            {course.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 min-h-[3rem] group-hover:text-indigo-300 transition">
            {course.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{course.instructorName || course.instructor?.name}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Star size={14} className="fill-current" /> {course.rating?.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {(course.students || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {course.duration}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
            <span className="text-lg font-bold text-emerald-400">${course.price?.toFixed(2)}</span>
            <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">{course.level}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
