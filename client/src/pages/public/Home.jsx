import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { courseAPI, categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import HeroSection from '../../components/home/HeroSection';
import DashboardWidgets from '../../components/home/DashboardWidgets';
import FeatureCards from '../../components/home/FeatureCards';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    courseAPI.getAll({ limit: 8, sort: 'popular' }).then((r) => setCourses(r.data.courses || [])).catch(() => {});
    courseAPI.getAll({ limit: 4, sort: 'rating' }).then((r) => setTrending(r.data.courses || [])).catch(() => {});
    categoryAPI.getAll().then((r) => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  return (
    <motion.div className="max-w-7xl mx-auto">
      <HeroSection />
      <DashboardWidgets />
      <FeatureCards />

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Browse Categories</h2>
          <Link to="/browse" className="text-sm text-violet-400 hover:text-violet-300">See all</Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {categories.slice(0, 12).map((cat) => (
            <motion.div key={cat.slug} variants={fadeInUp}>
              <Link
                to={`/category/${cat.slug}`}
                className="glass-card p-4 text-center block hover:border-violet-400/50"
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-sm font-medium mt-2 text-white">{cat.name}</p>
                <p className="text-xs text-slate-500">{cat.courseCount || 0} courses</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Trending Courses</h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trending.map((c) => (
              <motion.div key={c._id} variants={fadeInUp}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      <section id="featured">
        <h2 className="text-2xl font-bold mb-6 text-white">Popular Courses</h2>
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
