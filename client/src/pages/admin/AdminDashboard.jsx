import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardAPI.admin().then((r) => setData(r.data)).catch(() => {});
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold gradient-text mb-8">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Users', value: data?.stats?.totalUsers },
          { label: 'Courses', value: data?.stats?.totalCourses },
          { label: 'Enrollments', value: data?.stats?.totalEnrollments },
          { label: 'Revenue', value: `$${(data?.stats?.totalRevenue || 0).toFixed(0)}` },
          { label: 'Instructors', value: data?.stats?.totalInstructors },
        ].map((s) => (
          <div key={s.label} className="glass-card p-6">
            <p className="text-slate-400 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value ?? '—'}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-sm text-slate-400 mb-3">Recent Users</h3>
          {data?.recentUsers?.length ? (
            <ul className="space-y-2">
              {data.recentUsers.map((u) => (
                <li key={u._id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email} · {u.role}</div>
                  </div>
                  <div className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No recent users</p>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm text-slate-400 mb-3">Recent Payments</h3>
          {data?.recentPayments?.length ? (
            <ul className="space-y-2">
              {data.recentPayments.map((p) => (
                <li key={p._id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-white">{p.student?.name || '—'}</div>
                    <div className="text-xs text-slate-500">{p.student?.email || ''}</div>
                  </div>
                  <div className="text-sm text-slate-200">${p.amount.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No payments yet</p>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm text-slate-400 mb-3">Category Stats</h3>
          {data?.categoryStats?.length ? (
            <ul className="space-y-2 text-sm">
              {data.categoryStats.map((c) => (
                <li key={c._id} className="flex items-center justify-between">
                  <div className="text-slate-200">{c._id}</div>
                  <div className="text-slate-400">{c.count}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No category data</p>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">AI Analytics</h2>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6 mb-8"
      >
        <p className="text-slate-400 mb-2">Popular AI Searches</p>
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="flex flex-wrap gap-2"
        >
          {data?.aiAnalytics?.popularSearches?.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">{s}</span>
          ))}
        </motion.div>
        <p className="text-sm text-slate-500 mt-4">Search conversion: {data?.aiAnalytics?.searchConversionRate}</p>
      </motion.div>
      <h2 className="text-xl font-semibold mb-4">Top Courses</h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {data?.topCourses?.map((c, i) => (
          <div key={c._id} className="glass-card p-4 flex justify-between">
            <span>#{i + 1} {c.title}</span>
            <span className="text-slate-400">{c.students} students</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
