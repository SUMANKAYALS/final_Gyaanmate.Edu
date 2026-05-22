import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles } from '../../lib/icons';
import { courseAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function SearchResults() {
  const { runAiSearch } = useChatBot();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    courseAPI
      .getAll({ search: q.trim(), limit: 48, sort: 'popular' })
      .then((r) => setCourses(r.data.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Search className="text-indigo-400" size={24} />
        <h1 className="text-2xl font-bold gradient-text">Search results</h1>
      </div>
      <p className="text-slate-400 mb-4">
        {q ? (
          <>
            Showing courses matching <span className="text-white font-medium">&quot;{q}&quot;</span>
          </>
        ) : (
          'Enter a keyword in the search bar above'
        )}
      </p>
      <Link
        to={q ? `/?ai=${encodeURIComponent(q)}#ai-search` : '/#ai-search'}
        className="inline-flex items-center gap-2 mb-8 text-sm text-violet-300 hover:text-violet-200 transition"
      >
        <Sparkles size={16} />
        Try smart AI course search on home
      </Link>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card h-72 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {courses.map((c) => (
            <motion.div key={c._id} variants={fadeInUp}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center max-w-md mx-auto"
        >
          <p className="text-lg text-slate-300 font-medium">No courses found</p>
          <p className="text-slate-500 text-sm mt-2 mb-6">Try another keyword or browse all categories.</p>
          <Link to="/browse" className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
            Browse all courses
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
