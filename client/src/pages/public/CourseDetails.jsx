import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users } from '../../lib/icons';
import { courseAPI, enrollmentAPI, paymentAPI } from '../../services/api';
import { getMediaUrl, isDirectVideoUrl } from '../../utils/media';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useAuthStore } from '../../store/authStore';

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden mb-8 glass-card border border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/40 via-slate-900/60 to-indigo-900/40" />
        {getMediaUrl(course.image) && (
          <img src={getMediaUrl(course.image)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        )}
        <div className="relative p-8 md:p-10">
          <span className="px-3 py-1 rounded-full bg-violet-500/30 text-violet-200 text-sm border border-violet-500/40">{course.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 max-w-3xl">{course.title}</h1>
          <p className="text-slate-300 mt-2 max-w-2xl">{course.description}</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8 px-0"
      >
        <div className="lg:col-span-2">
          <div className="flex gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Star size={16} className="fill-current" /> {course.rating}
              {canViewReviews && course.reviews > 0 && (
                <span className="text-slate-500">({course.reviews} reviews)</span>
              )}
            </span>
            <span className="flex items-center gap-1"><Users size={16} /> {course.students?.toLocaleString()} students</span>
            <span>{course.level} · {course.duration}</span>
          </div>
          <div className="mt-6 rounded-xl overflow-hidden border border-slate-700/50 bg-black">
            {course.introVideo && isDirectVideoUrl(course.introVideo) ? (
              <video
                src={getMediaUrl(course.introVideo)}
                controls
                poster={getMediaUrl(course.image)}
                className="w-full aspect-video"
              />
            ) : getMediaUrl(course.image) ? (
              <img
                src={getMediaUrl(course.image)}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
                }}
              />
            ) : (
              <div className="w-full h-64 md:h-80 flex items-center justify-center text-slate-500 bg-slate-900">
                No course image
              </div>
            )}
          </div>
          <div className="mt-8 glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">What you&apos;ll learn</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {((course.whatYouWillLearn?.length ? course.whatYouWillLearn : course.skills) || []).map((s) => (
                <li key={s} className="text-slate-300 text-sm">✓ {s}</li>
              ))}
            </ul>
            <p className="mt-4 text-slate-400">{course.descriptionFull}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Curriculum</h2>
            <div className="space-y-2">
              {course.lessons?.map((l, i) => (
                <details key={i} className="glass-card group">
                  <summary className="p-4 cursor-pointer flex justify-between items-center list-none">
                    <span className="font-medium text-white">{l.title}</span>
                    <span className="text-slate-500 text-sm">{l.duration}</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-slate-400 border-t border-slate-700/40 pt-3">
                    Lesson {i + 1} · {l.duration || 'Self-paced'}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-8 glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Student Feedback</h2>

            {!canViewReviews ? (
              <p className="text-sm text-slate-400">
                {!user ? (
                  <>
                    <Link to="/login" className="text-indigo-400">Sign in</Link> and purchase this course to read student reviews.
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
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="bg-slate-900 text-slate-200 px-2 py-1 rounded">
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>
                <div className="mb-3">
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your feedback (optional)" className="w-full bg-slate-900 text-slate-200 p-2 rounded" rows={4} />
                </div>
                {feedbackError && <p className="text-sm text-rose-400 mb-3">{feedbackError}</p>}
                <button disabled={submitting} type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white">{submitting ? 'Submitting...' : 'Submit Feedback'}</button>
              </form>
            ) : (
              <p className="text-sm text-slate-400 mb-4">Feedback is currently disabled for this course by the instructor.</p>
            )}

            {canViewReviews && (
              <div className="mt-6">
                {feedbacks.length === 0 ? (
                  <p className="text-slate-400">
                    {feedbackEnabled ? 'No feedback yet. Be the first to leave a review.' : 'No visible feedback yet.'}
                  </p>
                ) : (
                  feedbacks.map((f) => (
                    <div key={f._id} className="border-t border-slate-700/40 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{f.name || 'Student'}</p>
                          <p className="text-xs text-slate-500">{new Date(f.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-amber-400 font-semibold">{f.rating}★</div>
                      </div>
                      {f.comment && <p className="mt-2 text-slate-300 text-sm whitespace-pre-wrap">{f.comment}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="glass-card p-6 h-fit sticky top-24 border border-violet-500/20"
        >
          <p className="text-3xl font-bold text-emerald-400 mb-1">${course.price?.toFixed(2)}</p>
          <p className="text-sm text-slate-500 line-through mb-4">${((course.price || 0) * 1.35).toFixed(2)}</p>
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              {(course.instructorName || 'I')[0]}
            </div>
            <div>
              <p className="text-xs text-slate-500">Instructor</p>
              <p className="text-sm font-medium text-white">{course.instructorName}</p>
            </div>
          </div>
          {enrolled ? (
            <Link to={`/course/${id}/learn`} className="block w-full text-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-medium">
              Continue Learning
            </Link>
          ) : (
            <>
              <button onClick={handleEnroll} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 font-medium mb-2">
                Buy Now
              </button>
              <button onClick={handleEnroll} className="w-full py-3 rounded-xl border border-violet-500/50 text-violet-300 hover:bg-violet-500/10 font-medium">
                Add to Cart
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
