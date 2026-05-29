import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BookOpen, Loader2, ShoppingCart } from '../lib/icons';
import { useEnrollment } from '../context/EnrollmentContext';
import { useAuthStore } from '../store/authStore';
import { enrollmentAPI } from '../services/api';
import { getMediaUrl } from '../utils/media';
import { fadeInUp, staggerContainer } from '../animations/motionVariants';
import { useTheme } from '../context/ThemeContext';

export default function MyCourses() {
  const user = useAuthStore((s) => s.user);
  const { enrollmentCart } = useEnrollment();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    enrollmentAPI
      .my()
      .then((r) => setEnrollments(r.data.enrollments || []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold gradient-text mb-8">My Courses</h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-12 text-center max-w-lg mx-auto ${isLight ? 'border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/60' : ''}`}
        >
          <div className="text-5xl mb-4">📚</div>
          <p className={`text-lg mb-2 ${isLight ? 'text-gray-800' : 'text-slate-300'}`}>You haven&apos;t enrolled in any courses yet</p>
          {enrollmentCart.length > 0 && (
            <p className="text-sm text-amber-400/90 mb-6 flex items-center justify-center gap-2">
              <ShoppingCart size={16} />
              You have {enrollmentCart.length} course(s) in your cart — complete checkout to start learning.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {enrollmentCart.length > 0 && (
              <Link
                to="/checkout"
                className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
              >
                Go to Checkout
              </Link>
            )}
            <Link
              to="/browse"
              className={`inline-block px-6 py-3 rounded-xl border font-medium transition ${isLight ? 'border-blue-300 text-blue-700 hover:bg-blue-50' : 'border-slate-600 text-slate-200 hover:border-indigo-500'}`}
            >
              Explore Courses
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold gradient-text mb-8 flex items-center gap-2">
        <BookOpen className="text-indigo-400" />
        My Learning
      </h1>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {enrollments.map((enrollment) => {
          const course = enrollment.course;
          if (!course) return null;
          const courseId = course._id;
          const progress = enrollment.progressPercentage || 0;
          const totalLessons = course.lessons?.length || 0;
          const completed = enrollment.completedLessons?.length || 0;

          return (
            <motion.div key={enrollment._id} variants={fadeInUp} className="glass-card overflow-hidden group">
              <div className="relative">
                <img src={getMediaUrl(course.image)} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Link
                    to={`/course/${courseId}/learn`}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-500"
                  >
                    <Play size={18} /> Continue
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className={`text-lg font-semibold mb-1 line-clamp-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>{course.title}</h3>
                <p className={`text-sm mb-4 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{course.instructorName}</p>
                <div className="mb-4">
                  <motion.div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">
                      {completed}/{totalLessons} lessons
                    </span>
                    <span className="text-indigo-300 font-medium">{Math.round(progress)}%</span>
                  </motion.div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <Link
                  to={progress >= 100 ? `/course/${courseId}/certificate` : `/course/${courseId}/learn`}
                  className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
                >
                  {progress >= 100 ? 'View certificate' : 'Continue learning'}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
