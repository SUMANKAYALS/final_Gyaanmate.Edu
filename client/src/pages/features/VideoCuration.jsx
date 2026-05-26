import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaVideo } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { courseAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';

export default function VideoCuration() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    courseAPI.getAll({ limit: 8, sort: 'rating' }).then((r) => setCourses(r.data.courses || [])).catch(() => {});
  }, []);

  return (
    <FeaturePageShell
      title="Smart Video Curation"
      subtitle="Top-rated courses with video lessons, curated for you."
      icon={FaVideo}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {courses.map((c) => (
          <CourseCard key={c._id} course={c} />
        ))}
      </div>
      {courses.length === 0 && (
        <p className="text-slate-400 text-center py-8">No video courses available yet.</p>
      )}
      <Link to="/browse" className="text-violet-400 text-sm mt-4 inline-block hover:text-violet-300">
        Browse all courses →
      </Link>
    </FeaturePageShell>
  );
}
