import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from '../../lib/icons';
import { courseAPI, categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('popular');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const params = { sort, limit: 100 };
    if (level) params.level = level;
    if (category) params.category = category;
    if (priceRange) params.priceRange = priceRange;
    if (search) params.search = search;
    courseAPI.getAll(params).then((r) => setCourses(r.data.courses || [])).catch(() => {});
  }, [sort, level, category, priceRange, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text">All Courses</h1>
        <p className="text-slate-400 mt-1">Browse {categories.length} categories and every course on Gyaanmate</p>
      </motion.div>

      {/* Search and Filters */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={SlidersHorizontal}
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            <Button
              variant="outline"
              icon={Filter}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm text-slate-400 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="under_50">Under $50</option>
                <option value="50_100">$50 - $100</option>
                <option value="over_100">Over $100</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Duration</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70">
                <option value="">All Durations</option>
                <option value="short">Under 5 hours</option>
                <option value="medium">5-20 hours</option>
                <option value="long">Over 20 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Rating</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70">
                <option value="">All Ratings</option>
                <option value="4.5">4.5 & up</option>
                <option value="4.0">4.0 & up</option>
                <option value="3.5">3.5 & up</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setCategory('');
                  setLevel('');
                  setPriceRange('');
                  setSearch('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        <button
          type="button"
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            !category 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-600/50'
          }`}
        >
          All
        </button>
        {categories.slice(0, 8).map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === c.slug 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-600/50'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </motion.div>

      {/* Results Count */}
      <p className="text-slate-400 text-sm mb-6">{courses.length} courses found</p>

      {/* Course Grid */}
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

      {/* Empty State */}
      {courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Filter size={32} className="text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
          <Button
            onClick={() => {
              setCategory('');
              setLevel('');
              setPriceRange('');
              setSearch('');
            }}
          >
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
