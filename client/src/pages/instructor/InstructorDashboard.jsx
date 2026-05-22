import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardAPI, courseAPI, enrollmentAPI, communityAPI } from '../../services/api';
import { Users, DollarSign, BookOpen, Star, TrendingUp, MessageSquare, Edit2, Trash2, Eye, Plus } from '../../lib/icons';

export default function InstructorDashboard() {
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [communityChannels, setCommunityChannels] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardRes, coursesRes, channelsRes] = await Promise.all([
        dashboardAPI.instructor(),
        courseAPI.getAll({ limit: 50 }),
        communityAPI.getChannels(),
      ]);
      setData(dashboardRes.data);
      setCourses(coursesRes.data.courses || []);
      setCommunityChannels(channelsRes.data.channels || []);
      
      // Load students from enrollments
      const enrollRes = await enrollmentAPI.my();
      const allEnrollments = enrollRes.data.enrollments || [];
      setStudents(allEnrollments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <motion.div>
      <h1 className="text-3xl font-bold gradient-text mb-8">Instructor Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'community', label: 'Community', icon: MessageSquare },
          { id: 'analytics', label: 'Analytics', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: 'Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-indigo-400' },
              { label: 'Students', value: stats.totalStudents, icon: Users, color: 'text-emerald-400' },
              { label: 'Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
              { label: 'Avg Rating', value: stats.averageRating?.toFixed(1) || 'N/A', icon: Star, color: 'text-yellow-400' },
            ].map((s) => (
              <motion.div key={s.label} className="glass-card p-6">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
                <p className="text-3xl font-bold text-white mt-1">{s.value ?? 0}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Courses</h3>
              <div className="space-y-3">
                {courses.slice(0, 5).map((c) => (
                  <div key={c._id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-sm text-slate-400">{c.students || 0} students</p>
                    </div>
                    <span className="text-emerald-400">${c.price || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Community Activity</h3>
              <div className="space-y-3">
                {communityChannels.slice(0, 5).map((ch) => (
                  <div key={ch._id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{ch.name}</p>
                      <p className="text-sm text-slate-400">{ch.members?.length || 0} members</p>
                    </div>
                    <span className="text-indigo-400">{ch.messageCount || 0} messages</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link to="/instructor/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500">
            <Plus className="w-5 h-5" />
            Upload New Course
          </Link>
        </motion.div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <Link to="/instructor/upload" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
              <Plus className="w-4 h-4" />
              New Course
            </Link>
          </div>
          <div className="grid gap-4">
            {courses.map((c) => (
              <motion.div key={c._id} whileHover={{ x: 4 }} className="glass-card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{c.description?.substring(0, 100)}...</p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-4 h-4" />
                        {c.students || 0} students
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <BookOpen className="w-4 h-4" />
                        {c.lessons?.length || 0} lessons
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                        ${c.price || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/course/${c._id}`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link to={`/instructor/edit/${c._id}`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-semibold mb-6">Enrolled Students</h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">Course</th>
                  <th className="text-left p-4">Progress</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((enrollment) => (
                  <tr key={enrollment._id} className="border-t border-slate-800">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={enrollment.user?.avatar || '/default-avatar.png'}
                          alt={enrollment.user?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{enrollment.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="p-4">{enrollment.course?.title || 'Unknown'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600"
                            style={{ width: `${enrollment.progressPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{enrollment.progressPercentage || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        enrollment.progressPercentage >= 100
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {enrollment.progressPercentage >= 100 ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Community Channels</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
              <Plus className="w-4 h-4" />
              Create Channel
            </button>
          </div>
          <div className="grid gap-4">
            {communityChannels.map((ch) => (
              <motion.div key={ch._id} whileHover={{ x: 4 }} className="glass-card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{ch.name}</h3>
                    <p className="text-sm text-slate-400 mb-3">{ch.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-4 h-4" />
                        {ch.members?.length || 0} members
                      </span>
                      <span className="flex items-center gap-1 text-indigo-400">
                        <MessageSquare className="w-4 h-4" />
                        {ch.messageCount || 0} messages
                      </span>
                    </div>
                  </div>
                  <Link to="/community" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg">
                    Open Channel
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Course</h3>
              <div className="space-y-3">
                {courses.map((c) => (
                  <div key={c._id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-emerald-400">${(c.price || 0) * (c.students || 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Revenue</span>
                  <span className="text-2xl font-bold text-emerald-400">${(stats.totalRevenue || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Average Course Rating</span>
                  <span className="text-2xl font-bold text-yellow-400">{stats.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Enrollments</span>
                  <span className="text-2xl font-bold text-indigo-400">{stats.totalStudents || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Courses</span>
                  <span className="text-2xl font-bold text-white">{stats.totalCourses || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
