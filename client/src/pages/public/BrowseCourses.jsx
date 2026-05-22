import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI, categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('popular');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const params = { sort, limit: 100 };
    if (level) params.level = level;
    if (category) params.category = category;
    courseAPI.getAll(params).then((r) => setCourses(r.data.courses || [])).catch(() => {});
  }, [sort, level, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-2 gradient-text">
        All Courses
      </motion.h1>
      <p className="text-slate-400 mb-6">Browse {categories.length} categories and every course on GyaanMate.edu</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white min-w-[200px]">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white">
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white">
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </motion.div>

      <motion.div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setCategory('')}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            !category ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' : 'border-slate-600 text-slate-400 hover:border-slate-500'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              category === c.slug ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' : 'border-slate-600 text-slate-400 hover:border-slate-500'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </motion.div>

      <p className="text-slate-500 text-sm mb-4">{courses.length} courses found</p>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((c) => (
          <motion.div key={c._id} variants={fadeInUp}>
            <CourseCard course={c} />
          </motion.div>
        ))}
      </motion.div>

      {courses.length === 0 && (
        <motion.div className="text-center py-16 text-slate-400">
          <p>No courses in this category yet.</p>
          <Link to="/browse" className="text-indigo-400 hover:underline mt-2 inline-block" onClick={() => setCategory('')}>
            View all courses
          </Link>
        </motion.div>
      )}
    </div>
  );
}
