import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from '../../lib/icons';
import { courseAPI, categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import AISearchEngine from '../../components/search/AISearchEngine';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const aiQuery = params.get('ai') || '';
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    courseAPI.getAll({ limit: 8, sort: 'popular' }).then((r) => setCourses(r.data.courses)).catch(() => {});
    categoryAPI.getAll().then((r) => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  const handleQueryChange = (q) => {
    setParams(q ? { ai: q } : {}, { replace: true });
  };

  return (
    <motion.div>
      <section className="relative overflow-hidden py-16 md:py-20 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1920')] bg-cover bg-center opacity-20" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900/60" aria-hidden />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="text-white">Learn Anything.</span>
            <br />
            <span className="gradient-text">Powered by AI.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            A global learning platform for programming, AI, design, business, languages, and 15+ categories.
          </p>
        </motion.div>

        <motion.div id="ai-search" className="relative max-w-3xl mx-auto scroll-mt-24">
          <AISearchEngine initialQuery={aiQuery} onQueryChange={handleQueryChange} />

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative flex flex-wrap justify-center gap-4 mt-10"
        >
          <Link to="/browse" className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition">
            Explore Courses
          </Link>
          <Link to="/signup" className="px-8 py-3 rounded-xl glass border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 font-medium">
            Start Learning Free
          </Link>
        </motion.div>
        <p className="relative text-center text-sm text-slate-500 mt-6">
          <span className="text-indigo-300/90">Chat with AI</span> (bottom-right) is for conversation — not course search.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Browse Categories</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={fadeInUp}>
              <Link
                to={`/category/${cat.slug}`}
                className="glass-card p-4 text-center block hover:border-indigo-400/50"
              >
                <span className="text-3xl">{cat.icon}</span>
                <p className="text-sm font-medium mt-2 text-white">{cat.name}</p>
                <p className="text-xs text-slate-500">{cat.courseCount || 0} courses</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="featured" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Courses</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {courses.map((c) => (
            <motion.div key={c._id} variants={fadeInUp}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
