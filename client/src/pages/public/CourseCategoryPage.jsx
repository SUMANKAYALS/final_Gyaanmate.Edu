import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';

export default function CourseCategoryPage() {
  const { category } = useParams();
  const [data, setData] = useState({ courses: [], category: null });

  useEffect(() => {
    categoryAPI.getCourses(category).then((r) => setData(r.data)).catch(() => {});
  }, [category]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold gradient-text mb-2">
        {data.category?.icon} {data.category?.name || category}
      </h1>
      <p className="text-slate-400 mb-8">{data.category?.description}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.courses?.map((c) => (
          <CourseCard key={c._id} course={c} />
        ))}
      </div>
    </motion.div>
  );
}
