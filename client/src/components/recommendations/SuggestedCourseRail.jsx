import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { aiAPI } from '../../services/api';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useTheme } from '../../context/ThemeContext';
import { getMediaUrl } from '../../utils/media';
import { formatCurrency } from '../../utils/currency';
import { Loader2, ShoppingCart, Sparkles, Star, Users } from '../../lib/icons';

export default function SuggestedCourseRail({
  currentCourse,
  cartCourses = [],
  title = 'Suggested for you',
  subtitle = 'Courses you may want to buy next',
  limit = 4,
  compact = false,
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { addToCart } = useEnrollment();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasContext = currentCourse || cartCourses.length;
    if (!hasContext) return undefined;

    let mounted = true;
    setLoading(true);

    aiAPI
      .suggestedCourses({ currentCourse, cartCourses })
      .then(({ data }) => {
        if (!mounted) return;
        setCourses((data.recommendations || []).slice(0, limit));
        setMessage(data.message || '');
      })
      .catch(() => {
        if (mounted) {
          setCourses([]);
          setMessage('');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [currentCourse?._id, cartCourses.length, limit]);

  const addSuggestedCourse = (course) => {
    addToCart({ ...course, id: course._id });
    toast.success('Suggested course added to cart');
  };

  if (loading) {
    return (
      <section className={`rounded-xl border p-5 ${isLight ? 'border-blue-100 bg-white shadow-sm' : 'border-slate-700 bg-slate-900/70'}`}>
        <div className="flex items-center gap-2 text-sm text-violet-400">
          <Loader2 size={18} className="animate-spin" />
          Finding smart course suggestions...
        </div>
      </section>
    );
  }

  if (!courses.length) return null;

  return (
    <section className={`rounded-xl border p-5 ${isLight ? 'border-blue-100 bg-white shadow-lg shadow-blue-100/40' : 'border-violet-500/20 bg-slate-900/70'}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className={`flex items-center gap-2 text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
            <Sparkles size={18} className="text-violet-500" />
            {title}
          </h2>
          <p className={`mt-1 text-sm ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
            {message || subtitle}
          </p>
        </div>
        <Link to="/recommendations" className="hidden text-sm font-medium text-violet-500 hover:text-violet-400 sm:inline">
          Tune AI
        </Link>
      </div>

      <div className={compact ? 'space-y-3' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4'}>
        {courses.map((course) => (
          <article
            key={course._id}
            className={`overflow-hidden rounded-xl border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-700 bg-slate-950/50'}`}
          >
            <Link to={`/course/${course._id}`} className="block">
              <div className={compact ? 'flex gap-3 p-3' : ''}>
                <img
                  src={getMediaUrl(course.image)}
                  alt={course.title}
                  className={compact ? 'h-20 w-24 shrink-0 rounded-lg object-cover' : 'h-36 w-full object-cover'}
                />
                <div className={compact ? 'min-w-0 flex-1' : 'p-3'}>
                  <p className={`line-clamp-2 text-sm font-semibold ${isLight ? 'text-slate-950' : 'text-white'}`}>{course.title}</p>
                  <p className={`mt-1 truncate text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {course.category} · {course.level}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-current" /> {Number(course.rating || 0).toFixed(1)}
                    </span>
                    <span className={`inline-flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Users size={12} /> {(course.students || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className={`mt-2 text-xs ${isLight ? 'text-violet-700' : 'text-violet-300'}`}>
                    {course.recommendationReasons?.[0] || 'Recommended for your learning path'}
                  </p>
                </div>
              </div>
            </Link>
            <div className={`flex items-center justify-between gap-2 border-t p-3 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
              <span className={`text-sm font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                {formatCurrency(course.price)}
              </span>
              <button
                type="button"
                onClick={() => addSuggestedCourse(course)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500"
              >
                <ShoppingCart size={13} />
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
