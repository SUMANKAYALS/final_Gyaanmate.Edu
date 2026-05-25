import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp, Lightbulb, ArrowRight, X } from '../../lib/icons';
import { courseAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

const trendingSearches = [
  'Python programming',
  'Machine Learning',
  'Web Development',
  'Data Science',
  'React.js',
  'JavaScript',
];

const aiSuggestions = [
  'Best courses for beginners in programming',
  'How to learn AI and Machine Learning',
  'Full stack web development path',
  'Data science with Python',
];

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setParams({ q: searchInput.trim() });
    }
  };

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
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <Search className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">AI-Powered Search</h1>
            <p className="text-slate-400 text-sm">Find the perfect course with intelligent recommendations</p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-8">
          <Input
            icon={Sparkles}
            placeholder="Search for courses, topics, or skills..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-12 pr-14 py-4 text-lg"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setParams({});
              }}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
            >
              <X size={18} />
            </button>
          )}
          <Button
            type="submit"
            size="lg"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Search
          </Button>
        </form>

        {/* Trending Searches */}
        {!q && (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-indigo-400" />
              <h3 className="font-semibold text-white">Trending Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchInput(search);
                    setParams({ q: search });
                  }}
                  className="px-4 py-2 rounded-full bg-slate-800/60 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border border-slate-600/50 hover:border-indigo-500/50 transition text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* AI Suggestions */}
        {!q && (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-amber-400" />
              <h3 className="font-semibold text-white">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchInput(suggestion);
                    setParams({ q: suggestion });
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 text-left transition group"
                >
                  <span className="text-slate-300 group-hover:text-white">{suggestion}</span>
                  <ArrowRight size={16} className="text-slate-500 group-hover:text-indigo-400" />
                </button>
              ))}
            </div>
          </Card>
        )}
      </motion.div>

      {/* Search Results */}
      {q && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Results for <span className="gradient-text">"{q}"</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">{courses.length} courses found</p>
            </div>
            <Link
              to={`/?ai=${encodeURIComponent(q)}#ai-search`}
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              <Sparkles size={16} />
              Try AI Search
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card h-80 animate-pulse bg-slate-800/50 rounded-2xl" />
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
            <Card className="p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Search size={32} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-slate-400 text-sm mb-6">
                Try adjusting your search terms or browse all categories
              </p>
              <Link to="/browse">
                <Button icon={ArrowRight} iconPosition="right">
                  Browse All Courses
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
