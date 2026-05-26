import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Sparkles } from '../../lib/icons';
import { courseAPI, categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeleton';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('popular');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data.categories || [])).catch(() => {});
    courseAPI.getAll({ limit: 4, sort: 'popular' }).then((r) => setTrending(r.data.courses || [])).catch(() => {});
    courseAPI.getAll({ limit: 4, sort: 'rating' }).then((r) => setRecommended(r.data.courses || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { sort, limit: 100 };
    if (level) params.level = level;
    if (category) params.category = category;
    courseAPI
      .getAll(params)
      .then((r) => {
        let list = r.data.courses || [];
        if (priceMax) list = list.filter((c) => c.price <= Number(priceMax));
        setCourses(list);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [sort, level, category, priceMax]);

  const filterSelect = 'px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white text-sm focus:border-violet-500 focus:outline-none';

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Course Marketplace</h1>
        <p className="text-slate-400">Discover {categories.length}+ categories — Udemy & Coursera style learning</p>
      </motion.div>

      {!category && trending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-orange-400">🔥</span> Trending Courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        </section>
      )}

      {!category && recommended.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="text-violet-400" size={20} /> AI Recommended
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((c) => (
              <CourseCard key={`rec-${c._id}`} course={c} />
            ))}
          </div>
        </section>
      )}

      <div className="glass-card p-4 mb-6 border border-violet-500/15">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:border-violet-500 text-sm"
          >
            <Filter size={16} /> Filters
          </button>
          {showFilters && (
            <>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={filterSelect}>
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={filterSelect}>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
              </select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={filterSelect}>
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className={filterSelect}>
                <option value="">Any Price</option>
                <option value="20">Under $20</option>
                <option value="50">Under $50</option>
                <option value="100">Under $100</option>
              </select>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              !category ? 'bg-violet-600/30 border-violet-500 text-violet-200' : 'border-slate-600 text-slate-400'
            }`}
          >
            All
          </button>
          {categories.slice(0, 10).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                category === c.slug ? 'bg-violet-600/30 border-violet-500 text-violet-200' : 'border-slate-600 text-slate-400'
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">
        {category ? 'Filtered Courses' : 'All Courses'}
        <span className="text-sm font-normal text-slate-500 ml-2">({courses.length})</span>
      </h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((c) => (
            <motion.div key={c._id} variants={fadeInUp}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-16 glass-card">
          <p className="text-slate-400">No courses match your filters.</p>
          <button type="button" onClick={() => { setCategory(''); setLevel(''); setPriceMax(''); }} className="text-violet-400 mt-2">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
