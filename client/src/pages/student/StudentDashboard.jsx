import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardAPI, paymentAPI } from '../../services/api';
import CourseCard from '../../components/course/CourseCard';
import { Video } from '../../lib/icons';

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardAPI.student().then((r) => setData(r.data)).catch(() => {});
  }, []);

  const downloadReceipt = async (paymentId) => {
    const res = await paymentAPI.receipt(paymentId);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipt.pdf';
    a.click();
  };

  const stats = data?.stats || {};

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">Student Dashboard</h1>

      <div className="glass-card p-5 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="p-3 rounded-xl bg-violet-600/20 text-violet-300">
            <Video size={22} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">Join a live teacher session</h2>
            <p className="text-sm text-slate-400 mt-1">Use your instructor's room link for online teaching, screen sharing, and class chat.</p>
          </div>
        </div>
        <Link to="/live-session" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white">
          <Video size={18} /> Open session
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {[
          { label: 'Enrolled', value: stats.enrolledCourses || 0 },
          { label: 'Completed', value: stats.completedCourses || 0 },
          { label: 'Avg Progress', value: `${stats.averageProgress || 0}%` },
          { label: 'Certificates', value: stats.certificates || 0 },
        ].map((s) => (
          <motion.div key={s.label} className="glass-card p-6">
            <p className="text-slate-400 text-sm">{s.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {data?.recentEnrollments?.map((e) => e.course && <CourseCard key={e._id} course={e.course} />)}
      </motion.div>

      <h2 className="text-xl font-semibold mb-4">Payment Receipts</h2>
      <div className="space-y-2">
        {data?.recentPayments?.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.01 }}
            className="glass-card p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{p.courseName}</p>
              <p className="text-sm text-slate-400">
                ${p.amount} · {p.paymentId}
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadReceipt(p._id)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm"
            >
              Download PDF
            </button>
          </motion.div>
        ))}
      </div>

      <Link to="/my-courses" className="inline-block mt-6 text-indigo-400 hover:underline">
        View all my courses →
      </Link>
    </div>
  );
}
