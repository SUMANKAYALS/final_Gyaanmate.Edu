import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronLeft, CheckCircle2, Circle, Loader2, Play, FileText, Upload, X } from '../lib/icons';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { getMediaUrl, isDirectVideoUrl } from '../utils/media';

function lessonKey(lesson, index) {
  return String(lesson.order ?? lesson._id ?? index + 1);
}

export default function CoursePlayer() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPdfSection, setShowPdfSection] = useState(false);
  const [courseResources, setCourseResources] = useState([]);
  const [downloadingResource, setDownloadingResource] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/course/${id}/learn` } } });
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [courseRes, enrollRes] = await Promise.all([
          courseAPI.getById(id),
          enrollmentAPI.my(),
        ]);
        const c = courseRes.data.course;
        setCourse(c);
        setCourseResources(c.resources || []);
        const match = (enrollRes.data.enrollments || []).find((e) => {
          const cid = e.course?._id || e.course;
          return String(cid) === String(id);
        });
        setEnrollment(match || null);
      } catch {
        setCourse(null);
        setEnrollment(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user, navigate]);

  useEffect(() => {
    if (!course?.lessons?.length || lessonId) return;
    const first = course.lessons[0];
    navigate(`/course/${id}/learn/${lessonKey(first, 0)}`, { replace: true });
  }, [course, lessonId, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 mb-4">Course not found</p>
        <Link to="/browse" className="text-indigo-400 hover:underline">
          Browse courses
        </Link>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <motion.div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-300 text-lg mb-2">You need to enroll before watching this course</p>
        <p className="text-slate-500 text-sm mb-6">Add the course to your cart and complete checkout.</p>
        <div className="flex gap-3 justify-center">
          <Link
            to={`/course/${id}`}
            className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white hover:border-indigo-500"
          >
            View course
          </Link>
          <Link
            to="/checkout"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
          >
            Go to checkout
          </Link>
        </div>
      </motion.div>
    );
  }

  const lessons = [...(course.lessons || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const currentIndex = lessons.findIndex((l, i) => lessonKey(l, i) === String(lessonId));
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentLesson = lessons[activeIndex];
  const activeKey = lessonKey(currentLesson, activeIndex);
  const completed = enrollment.completedLessons || [];
  const isLessonCompleted =
    completed.includes(currentLesson.order) || completed.includes(Number(activeKey));

  const markComplete = async () => {
    try {
      const { data } = await enrollmentAPI.updateProgress(id, {
        lessonId: currentLesson.order ?? Number(activeKey),
        completed: true,
      });
      setEnrollment(data.enrollment);
      toast.success('Lesson marked complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update progress');
    }
  };

  const goToLesson = (lesson, index) => {
    navigate(`/course/${id}/learn/${lessonKey(lesson, index)}`);
  };

  const downloadResource = async (resource) => {
    if (!resource?.url) return;
    setDownloadingResource(resource.url);
    try {
      const response = await fetch(resource.url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = resource.name || `resource-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      toast.error('Unable to download PDF resource');
    } finally {
      setDownloadingResource(null);
    }
  };

  const videoUrl = getMediaUrl(currentLesson.videoUrl);
  const embedUrl = currentLesson.videoUrl?.includes('youtube.com/embed')
    ? currentLesson.videoUrl
    : currentLesson.videoUrl?.includes('watch?v=')
      ? currentLesson.videoUrl.replace('watch?v=', 'embed/')
      : null;
  const directVideo = videoUrl && isDirectVideoUrl(currentLesson.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white"
    >
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(`/course/${id}`)}
          className="flex items-center gap-2 text-slate-300 hover:text-white text-sm"
        >
          <ChevronLeft size={18} /> Back to course
        </button>
        <h1 className="text-lg font-semibold text-center flex-1 line-clamp-1">{course.title}</h1>
        <span className="text-sm text-slate-500">
          Lesson {activeIndex + 1} / {lessons.length}
        </span>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 p-4 md:p-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="aspect-video bg-black">
              {embedUrl ? (
                <iframe
                  title={currentLesson.title}
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : directVideo ? (
                <video
                  key={videoUrl}
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  playsInline
                />
              ) : (
                <motion.div className="w-full h-full flex flex-col items-center justify-center text-slate-500" aria-hidden>
                  <Play size={48} className="text-indigo-400 mb-2" />
                  <p>Video lesson</p>
                  <p className="text-sm mt-1">{currentLesson.duration}</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
            <p className="text-slate-400 text-sm mb-6">Duration: {currentLesson.duration}</p>
            <motion.div className="flex flex-wrap gap-3">
              {isLessonCompleted ? (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 size={18} /> Completed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={markComplete}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
                >
                  Mark as complete
                </button>
              )}
            </motion.div>
          </div>

          {/* PDF Notes Section */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Course Notes & Resources
              </h3>
              <button
                onClick={() => setShowPdfSection(!showPdfSection)}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                {showPdfSection ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showPdfSection && (
              <div className="space-y-3">
                {courseResources.length > 0 ? (
                  courseResources.map((resource, index) => (
                    <div key={index} className="flex flex-col gap-3 p-3 bg-slate-800/50 rounded-lg sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm font-medium">{resource.name || `Resource ${index + 1}`}</p>
                          <p className="text-xs text-slate-500">{resource.url ? 'Available' : 'Uploaded'}</p>
                        </div>
                      </div>
                      {resource.url && (
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => downloadResource(resource)}
                            disabled={downloadingResource === resource.url}
                            className="inline-flex items-center justify-center px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {downloadingResource === resource.url ? 'Downloading...' : 'Download'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No PDF resources uploaded by instructor yet.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => goToLesson(lessons[activeIndex - 1], activeIndex - 1)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600"
              >
                ← Previous
              </button>
            )}
            {activeIndex < lessons.length - 1 && (
              <button
                type="button"
                onClick={() => goToLesson(lessons[activeIndex + 1], activeIndex + 1)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
              >
                Next lesson →
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-4 sticky top-4">
            <h3 className="font-semibold mb-3">Course content</h3>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{enrollment.progressPercentage || 0}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${enrollment.progressPercentage || 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-1 max-h-[28rem] overflow-y-auto">
              {lessons.map((lesson, index) => {
                const key = lessonKey(lesson, index);
                const done =
                  completed.includes(lesson.order) || completed.includes(Number(key));
                const active = key === activeKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => goToLesson(lesson, index)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition ${
                      active ? 'bg-indigo-600/40 border border-indigo-500/50' : 'hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex gap-2 items-start">
                      {done ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle size={16} className="text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <span className="line-clamp-2">
                        {index + 1}. {lesson.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
