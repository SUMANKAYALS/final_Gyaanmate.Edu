import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Sparkles,
  TrendingUp,
  Flame,
  Clock,
  GraduationCap,
  ArrowRight,
} from '../../lib/icons';
import { courseAPI, categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import AISearchEngine from '../../components/search/AISearchEngine';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

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

  const dashboardWidgets = [
    {
      title: 'Continue Learning',
      icon: BookOpen,
      value: '3',
      label: 'courses in progress',
      color: 'from-indigo-500 to-purple-500',
      link: '/my-courses',
    },
    {
      title: 'AI Suggestions',
      icon: Sparkles,
      value: '5',
      label: 'recommended for you',
      color: 'from-cyan-500 to-blue-500',
      link: '/browse',
    },
    {
      title: 'Learning Progress',
      icon: TrendingUp,
      value: '68%',
      label: 'completion rate',
      color: 'from-emerald-500 to-teal-500',
      link: '/student/dashboard',
    },
    {
      title: 'Daily Streak',
      icon: Flame,
      value: '12',
      label: 'days streak',
      color: 'from-orange-500 to-red-500',
      link: '/streaks',
    },
    {
      title: 'Upcoming Tests',
      icon: Clock,
      value: '2',
      label: 'mock tests scheduled',
      color: 'from-violet-500 to-purple-500',
      link: '/mock-tests',
    },
    {
      title: 'Recommended',
      icon: GraduationCap,
      value: '8',
      label: 'new courses',
      color: 'from-pink-500 to-rose-500',
      link: '/browse',
    },
  ];

  return (
    <motion.div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-slate-900/30" aria-hidden />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1920')] bg-cover bg-center opacity-10" aria-hidden />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto text-center z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6"
          >
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">AI-Powered Learning Platform</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            <span className="text-white">Learn Smarter.</span>
            <br />
            <span className="gradient-text">Achieve More.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            A global learning platform for programming, AI, design, business, languages, and 15+ categories. Powered by cutting-edge AI technology.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/browse">
              <Button size="lg" icon={BookOpen} iconPosition="right">
                Explore Courses
              </Button>
            </Link>
            <Link to="/#ai-search">
              <Button variant="outline" size="lg" icon={Sparkles} iconPosition="right">
                Ask AI Anything
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* AI Search */}
        <motion.div
          id="ai-search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative max-w-3xl mx-auto mt-16 scroll-mt-24"
        >
          <AISearchEngine initialQuery={aiQuery} onQueryChange={handleQueryChange} />
        </motion.div>
      </section>

      {/* Dashboard Widgets */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dashboardWidgets.map((widget, index) => (
            <motion.div key={widget.title} variants={fadeInUp}>
              <Link to={widget.link}>
                <Card hover className="relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${widget.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.color}`}>
                        <widget.icon size={24} className="text-white" />
                      </div>
                      <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{widget.value}</h3>
                    <p className="text-slate-400 text-sm">{widget.label}</p>
                    <p className="text-slate-300 font-medium mt-2">{widget.title}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Browse Categories</h2>
          <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </Link>
        </div>
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

      {/* Popular Courses */}
      <section id="featured" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Popular Courses</h2>
          <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </Link>
        </div>
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
