import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, Clock, Play, Check, ChevronDown, ChevronUp } from '../../lib/icons';
import { courseAPI, enrollmentAPI, paymentAPI } from '../../services/api';
import { getMediaUrl, isDirectVideoUrl } from '../../utils/media';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { fadeInUp } from '../../animations/motionVariants';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [canViewReviews, setCanViewReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useEnrollment();
  const user = useAuthStore((s) => s.user);

  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState(null);

  const loadFeedbacks = async (allowView) => {
    if (!allowView || !user) {
      setFeedbacks([]);
      return;
    }
    try {
      const res = await courseAPI.getFeedbacks(id);
      setFeedbacks(res.data.feedbacks || []);
      setFeedbackEnabled(res.data.feedbackEnabled !== false);
    } catch {
      setFeedbacks([]);
      setFeedbackEnabled(true);
    }
  };

  const checkReviewAccess = (payments, enrollments, courseId) => {
    const purchased = (payments || []).some((p) => {
      const cid = p.course?._id || p.course;
      return String(cid) === String(courseId) && p.status === 'completed';
    });
    const completed = (enrollments || []).some((e) => {
      const cid = e.course?._id || e.course;
      return String(cid) === String(courseId) && (e.progressPercentage ?? 0) >= 100;
    });
    return purchased || completed;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const courseRes = await courseAPI.getById(id);
        setCourse(courseRes.data.course);
        let hasEnrollment = false;
        let reviewAccess = false;
        if (user) {
          const [enrollRes, payRes] = await Promise.all([
            enrollmentAPI.my(),
            paymentAPI.my().catch(() => ({ data: { payments: [] } })),
          ]);
          const enrollments = enrollRes.data.enrollments || [];
          const payments = payRes.data.payments || [];
          hasEnrollment = enrollments.some((e) => {
            const cid = e.course?._id || e.course;
            return String(cid) === String(id);
          });
          reviewAccess = checkReviewAccess(payments, enrollments, id);
          setEnrolled(hasEnrollment);
          setCanViewReviews(reviewAccess);
        } else {
          setEnrolled(false);
          setCanViewReviews(false);
        }
        await loadFeedbacks(reviewAccess);
      } catch {
        setCourse(null);
        setEnrolled(false);
        setCanViewReviews(false);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  if (loading) return <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity }} className="h-96 glass-card m-8" />;
  if (!course) return <div className="text-center py-20 text-slate-400">Course not found</div>;

  const handleEnroll = () => {
    if (!user) return navigate('/login');
    addToCart({ ...course, id: course._id });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2">
          <Badge variant="primary" size="md" className="mb-4">{course.category}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">{course.title}</h1>
          <p className="text-slate-400 mt-3 text-lg">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Star size={16} className="fill-current" /> {course.rating}
              {canViewReviews && course.reviews > 0 && (
                <span className="text-slate-500">({course.reviews} reviews)</span>
              )}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Users size={16} /> {course.students?.toLocaleString()} students
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={16} /> {course.duration}
            </span>
            <Badge variant="secondary" size="sm">{course.level}</Badge>
          </div>

          {/* Video Preview */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-slate-700/50 bg-black">
            {course.introVideo && isDirectVideoUrl(course.introVideo) ? (
              <video
                src={getMediaUrl(course.introVideo)}
                controls
                poster={getMediaUrl(course.image)}
                className="w-full aspect-video"
              />
            ) : getMediaUrl(course.image) ? (
              <div className="relative">
                <img
                  src={getMediaUrl(course.image)}
                  alt={course.title}
                  className="w-full h-64 md:h-80 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 md:h-80 flex items-center justify-center text-slate-500 bg-slate-900">
                No course image
              </div>
            )}
          </div>

          {/* What You'll Learn */}
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">What you'll learn</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {((course.whatYouWillLearn?.length ? course.whatYouWillLearn : course.skills) || []).map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-slate-300 text-sm"
                >
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{s}</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Description */}
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Course Description</h2>
            <p className="text-slate-300 leading-relaxed">{course.descriptionFull}</p>
          </Card>

          {/* Curriculum */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Curriculum</h2>
            <div className="space-y-2">
              {course.lessons?.map((l, i) => (
                <Card key={i} className="p-4">
                  <button
                    onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-medium text-sm">
                        {i + 1}
                      </div>
                      <span className="text-white font-medium">{l.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm">{l.duration}</span>
                      {expandedLesson === i ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedLesson === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-slate-700/50 text-slate-400 text-sm"
                      >
                        {l.description || 'Lesson content preview...'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </div>

          {/* Student Feedback */}
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Student Feedback</h2>

            {!canViewReviews ? (
              <p className="text-sm text-slate-400">
                {!user ? (
                  <>
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link> and purchase this course to read student reviews.
                  </>
                ) : (
                  'Purchase this course to read student reviews and leave your own feedback.'
                )}
              </p>
            ) : feedbackEnabled ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!rating) return;
                setSubmitting(true);
                setFeedbackError('');
                try {
                  await courseAPI.submitFeedback(id, { rating, comment });
                  setRating(5);
                  setComment('');
                  const courseRes = await courseAPI.getById(id);
                  setCourse(courseRes.data.course);
                  await loadFeedbacks(true);
                } catch (err) {
                  setFeedbackError(err.response?.data?.message || 'Unable to submit feedback. Please try again.');
                } finally {
                  setSubmitting(false);
                }
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm text-slate-300">Rating</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg border border-slate-600/60 focus:outline-none focus:border-indigo-500/70">
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Very Poor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback (optional)"
                    className="w-full bg-slate-800/60 text-slate-200 p-3 rounded-xl border border-slate-600/60 focus:outline-none focus:border-indigo-500/70 resize-none"
                    rows={4}
                  />
                </div>
                {feedbackError && <p className="text-sm text-rose-400 mb-3">{feedbackError}</p>}
                <Button disabled={submitting} loading={submitting}>
                  Submit Feedback
                </Button>
              </form>
            ) : (
              <p className="text-sm text-slate-400 mb-4">Feedback is currently disabled for this course by the instructor.</p>
            )}

            {canViewReviews && (
              <div className="mt-6 space-y-4">
                {feedbacks.length === 0 ? (
                  <p className="text-slate-400">
                    {feedbackEnabled ? 'No feedback yet. Be the first to leave a review.' : 'No visible feedback yet.'}
                  </p>
                ) : (
                  feedbacks.map((f) => (
                    <div key={f._id} className="border-t border-slate-700/40 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-white">{f.name || 'Student'}</p>
                          <p className="text-xs text-slate-500">{new Date(f.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star size={14} className="fill-current" /> {f.rating}
                        </div>
                      </div>
                      {f.comment && <p className="mt-2 text-slate-300 text-sm whitespace-pre-wrap">{f.comment}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 sticky top-24">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-emerald-400">${course.price?.toFixed(2)}</span>
              {course.originalPrice && (
                <span className="text-lg text-slate-500 line-through">${course.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            <div className="space-y-3 mb-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{course.students?.toLocaleString()} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-400 fill-current" />
                <span>{course.rating} rating</span>
              </div>
            </div>

            {enrolled ? (
              <Link to={`/course/${id}/learn`} className="block w-full text-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-medium transition">
                Continue Learning
              </Link>
            ) : (
              <Button size="lg" className="w-full" onClick={handleEnroll}>
                Add to Cart
              </Button>
            )}

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 mb-2">Instructor</p>
              <p className="text-white font-medium">{course.instructorName}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 mb-2">Includes</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>{course.lessons?.length || 0} lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Full lifetime access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
