import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  BookOpen,
  Receipt,
  Settings,
  LayoutDashboard,
  Mail,
  Shield,
  Loader2,
  Download,
  GraduationCap,
} from '../lib/icons';
import { useAuthStore } from '../store/authStore';
import { authAPI, enrollmentAPI, paymentAPI } from '../services/api';
import { fadeInUp } from '../animations/motionVariants';
import AvatarSection from '../components/profile/AvatarSection';
import { getInitials } from '../utils/avatar';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'learning', label: 'My Learning', icon: BookOpen },
  { id: 'payments', label: 'Payments', icon: Receipt },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Account() {
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [meRes, enrollRes, payRes] = await Promise.all([
          authAPI.me().catch(() => ({ data: { user: authUser } })),
          enrollmentAPI.my().catch(() => ({ data: { enrollments: [] } })),
          paymentAPI.my().catch(() => ({ data: { payments: [] } })),
        ]);
        setProfile(meRes.data.user || authUser);
        setEnrollments(enrollRes.data.enrollments || []);
        setPayments(payRes.data.payments || []);
      } catch {
        setProfile(authUser);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authUser]);

  const downloadReceipt = async (paymentId) => {
    try {
      const res = await paymentAPI.receipt(paymentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'receipt.pdf';
      a.click();
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Could not download receipt');
    }
  };

  if (loading) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
        <p>Loading your profile...</p>
      </motion.div>
    );
  }

  const user = profile || authUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-10"
    >
      <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <motion.div>
          <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your Gyaanmate account</p>
        </motion.div>
        <Link
          to={user?.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-indigo-500/30 text-indigo-300 hover:border-indigo-400 text-sm"
        >
          <LayoutDashboard size={18} />
          Go to Dashboard
        </Link>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div className="glass-card p-4 lg:col-span-1 h-fit">
          <motion.div className="flex flex-col items-center text-center pb-4 mb-4 border-b border-slate-700/50">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-indigo-500/50 bg-slate-800 flex items-center justify-center mb-3">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-indigo-300">{getInitials(user?.name)}</span>
              )}
            </div>
            <p className="font-semibold text-white text-lg">{user?.name || 'Student'}</p>
            <p className="text-sm text-slate-400 truncate max-w-full">{user?.email}</p>
            <span className="mt-2 px-3 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 capitalize">
              {user?.role || 'student'}
            </span>
          </motion.div>
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  activeTab === id
                    ? 'bg-indigo-600/30 text-indigo-300'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </motion.div>

        <motion.div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
            <AvatarSection user={user} onUpdated={setProfile} />
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User size={22} className="text-indigo-400" />
                Personal Information
              </h2>
              <motion.div className="grid sm:grid-cols-2 gap-4">
                <motion.div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">Full Name</label>
                  <p className="mt-1 text-white font-medium">{user?.name || '—'}</p>
                </motion.div>
                <motion.div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">Email</label>
                  <p className="mt-1 text-white font-medium flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    {user?.email || '—'}
                  </p>
                </motion.div>
                <motion.div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">Account Type</label>
                  <p className="mt-1 text-white font-medium capitalize flex items-center gap-2">
                    <Shield size={16} className="text-slate-400" />
                    {user?.role || 'student'}
                  </p>
                </motion.div>
                <motion.div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">Member ID</label>
                  <p className="mt-1 text-slate-300 text-sm font-mono truncate">{user?.id || user?._id || '—'}</p>
                </motion.div>
              </motion.div>
              {user?.bio && (
                <motion.div className="mt-4 pt-4 border-t border-slate-700/50">
                  <label className="text-xs text-slate-500 uppercase tracking-wide">Bio</label>
                  <p className="mt-1 text-slate-300">{user.bio}</p>
                </motion.div>
              )}
            </motion.div>
            </>
          )}

          {activeTab === 'learning' && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen size={22} className="text-indigo-400" />
                Enrolled Courses
              </h2>
              {enrollments.length === 0 ? (
                <motion.div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">You have not enrolled in any courses yet.</p>
                  <Link to="/browse" className="inline-block px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
                    Browse Courses
                  </Link>
                </motion.div>
              ) : (
                <motion.div className="space-y-3">
                  {enrollments.map((e) => (
                    <motion.div
                      key={e._id}
                      whileHover={{ x: 4 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50"
                    >
                      <motion.div>
                        <p className="font-medium text-white">{e.course?.title || 'Course'}</p>
                        <p className="text-sm text-slate-400">{e.course?.category}</p>
                        <motion.div className="mt-2 h-2 w-full max-w-xs bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${e.progressPercentage || 0}%` }}
                          />
                        </motion.div>
                        <p className="text-xs text-slate-500 mt-1">{e.progressPercentage || 0}% complete</p>
                      </motion.div>
                      {e.course?._id && (
                        <Link
                          to={`/course/${e.course._id}/learn`}
                          className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm text-white text-center"
                        >
                          Continue
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  <Link to="/my-courses" className="inline-block text-indigo-400 hover:underline text-sm mt-2">
                    View all courses →
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Receipt size={22} className="text-indigo-400" />
                Payment History
              </h2>
              {payments.length === 0 ? (
                <p className="text-slate-400 py-8 text-center">No payments yet. Enroll in a course to see receipts here.</p>
              ) : (
                <motion.div className="space-y-3">
                  {payments.map((p) => (
                    <motion.div
                      key={p._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50"
                    >
                      <motion.div>
                        <p className="font-medium text-white">{p.courseName}</p>
                        <p className="text-sm text-slate-400">
                          {p.paymentId} · {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-emerald-400 font-semibold mt-1">${p.amount?.toFixed(2)}</p>
                      </motion.div>
                      <button
                        type="button"
                        onClick={() => downloadReceipt(p._id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm text-white"
                      >
                        <Download size={16} />
                        Receipt PDF
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings size={22} className="text-indigo-400" />
                Preferences
              </h2>
              <motion.div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <span className="text-slate-300">Email notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings((s) => ({ ...s, emailNotifications: e.target.checked }))}
                    className="w-5 h-5 rounded accent-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <span className="text-slate-300">Course update alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.courseUpdates}
                    onChange={(e) => setSettings((s) => ({ ...s, courseUpdates: e.target.checked }))}
                    className="w-5 h-5 rounded accent-indigo-500"
                  />
                </label>
              </motion.div>
              <motion.div className="mt-8 pt-6 border-t border-slate-700/50">
                <p className="text-sm text-slate-500 mb-3">Danger zone</p>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    toast.success('Signed out');
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm"
                >
                  Sign out of all devices
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
