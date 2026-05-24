import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Award, Calendar, CheckCircle2, Loader2 } from '../lib/icons';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { getMediaUrl } from '../utils/media';
import { fadeInUp } from '../animations/motionVariants';

export default function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  console.log('Certificate component mounted, ID:', id, 'User:', user?.name);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('useEffect running, user:', !!user);
    if (!user) {
      console.log('No user, redirecting to login');
      navigate('/login', { state: { from: { pathname: `/course/${id}/certificate` } } });
      return;
    }

    const load = async () => {
      console.log('Starting load function');
      setLoading(true);
      setError(null);
      try {
        console.log('Loading certificate for course ID:', id);
        const [courseRes, enrollRes] = await Promise.all([
          courseAPI.getById(id),
          enrollmentAPI.my(),
        ]);
        console.log('Course response:', courseRes);
        console.log('Enrollment response:', enrollRes);
        
        const c = courseRes.data.course;
        setCourse(c);
        const match = (enrollRes.data.enrollments || []).find((e) => {
          const cid = e.course?._id || e.course;
          return String(cid) === String(id);
        });
        
        console.log('Matching enrollment:', match);
        
        if (!match) {
          console.log('No matching enrollment found');
          setError('No enrollment found for this course');
          setCourse(null);
          setEnrollment(null);
          setLoading(false);
          return;
        }
        
        setEnrollment(match);
      } catch (error) {
        console.error('Error loading certificate:', error);
        setError(error.message || 'Failed to load certificate');
        setCourse(null);
        setEnrollment(null);
      } finally {
        console.log('Load function complete, loading:', false);
        setLoading(false);
      }
    };

    load();
  }, [id, user, navigate]);

  // Simple test render to verify component is working
  console.log('Rendering certificate, loading:', loading, 'error:', error, 'course:', !!course, 'enrollment:', !!enrollment);

  const downloadCertificate = async () => {
    if (!isCompleted) return;
    try {
      setDownloadLoading(true);
      const response = await enrollmentAPI.certificate(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${course?.title?.replace(/\s+/g, '_')}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      console.error('Certificate download error:', err);
      setError(err.response?.data?.message || 'Unable to download certificate');
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
          <p>Loading certificate...</p>
          <p className="text-sm">Course ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-red-400 font-medium mb-2">Error loading certificate</p>
            <p className="text-slate-400 text-sm">{error}</p>
            <p className="text-slate-400 text-sm mt-2">Course ID: {id}</p>
          </div>
          <Link to="/my-courses" className="text-indigo-400 hover:underline">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-red-400 font-medium mb-2">Certificate not available</p>
            <p className="text-slate-400 text-sm">Course ID: {id}</p>
            <p className="text-slate-400 text-sm">Course loaded: {course ? 'Yes' : 'No'}</p>
            <p className="text-slate-400 text-sm">Enrollment loaded: {enrollment ? 'Yes' : 'No'}</p>
          </div>
          <Link to="/my-courses" className="text-indigo-400 hover:underline">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = enrollment.progressPercentage >= 100;

  console.log('About to render certificate, isCompleted:', isCompleted);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/my-courses"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            ← Back to My Courses
          </Link>
        </div>

        {!isCompleted && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
            <p className="text-amber-400 font-medium">
              ⚠️ Course not yet completed ({enrollment.progressPercentage}%). Complete all lessons to receive your official certificate.
            </p>
          </div>
        )}

        <div
          id="certificate-content"
          className={`bg-gradient-to-br rounded-2xl p-8 md:p-12 border shadow-2xl ${
            isCompleted
              ? 'from-slate-800 to-slate-900 border-slate-700'
              : 'from-slate-800/50 to-slate-900/50 border-slate-600/50 opacity-75'
          }`}
        >
          {/* Certificate Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600/20 rounded-full mb-4">
              <Award className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              {isCompleted ? 'Certificate of Completion' : 'Certificate Preview'}
            </h1>
            <p className="text-slate-400">This certifies that</p>
          </div>

          {/* Student Name */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              {user?.name || 'Student'}
            </h2>
            <p className="text-slate-400">has successfully completed</p>
          </div>

          {/* Course Title */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-indigo-400 mb-4">
              {course.title}
            </h3>
            {course.instructorName && (
              <p className="text-slate-400">Instructed by {course.instructorName}</p>
            )}
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Completed</p>
              <p className="font-semibold">
                {new Date(enrollment.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Progress</p>
              <p className="font-semibold">{enrollment.progressPercentage}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Lessons</p>
              <p className="font-semibold">{course.lessons?.length || 0} Completed</p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="border-t border-slate-700 pt-6 text-center">
            <p className="text-slate-400 text-sm mb-2">
              Issued by Gyaanmate Platform
            </p>
            <p className="text-slate-500 text-xs">
              Certificate ID: {enrollment._id}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {isCompleted ? (
            <button
              onClick={downloadCertificate}
              disabled={downloadLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium transition disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              <Download size={18} />
              {downloadLoading ? 'Downloading...' : 'Download Certificate'}
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-700 text-slate-400 cursor-not-allowed font-medium transition"
            >
              <Download size={18} />
              Download (Complete course first)
            </button>
          )}
          <Link
            to={`/course/${id}/learn`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-medium transition"
          >
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Link>
        </div>
      </div>
    </div>
  );
}
