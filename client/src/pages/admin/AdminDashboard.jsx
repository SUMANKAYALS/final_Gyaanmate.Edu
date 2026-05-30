import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import {
  Award,
  BookOpen,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Info,
  LineChart,
  Loader2,
  Shield,
  TrendingUp,
  Users,
} from '../../lib/icons';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatMoney(value) {
  return currency.format(Number(value || 0));
}

function formatNumber(value) {
  return compactNumber.format(Number(value || 0));
}

function statusClass(status, isDark) {
  if (status === 'completed') {
    return isDark
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (status === 'pending') {
    return isDark
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      : 'border-amber-200 bg-amber-50 text-amber-700';
  }
  return isDark
    ? 'border-red-500/30 bg-red-500/10 text-red-300'
    : 'border-red-200 bg-red-50 text-red-700';
}

function MetricCard({ icon: Icon, label, value, helper, tone = 'violet' }) {
  const { isDark } = useTheme();
  const tones = {
    violet: 'bg-violet-500/12 text-violet-300 ring-violet-500/20',
    emerald: 'bg-emerald-500/12 text-emerald-300 ring-emerald-500/20',
    sky: 'bg-sky-500/12 text-sky-300 ring-sky-500/20',
    amber: 'bg-amber-500/12 text-amber-300 ring-amber-500/20',
    rose: 'bg-rose-500/12 text-rose-300 ring-rose-500/20',
  };

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{label}</p>
          <p className={`mt-2 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{value}</p>
        </div>
        <div className={`rounded-lg p-2 ring-1 ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      {helper && <p className={`mt-3 text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{helper}</p>}
    </div>
  );
}

function Section({ title, action, children }) {
  const { isDark } = useTheme();
  return (
    <section className={`rounded-xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProgressBar({ value, tone = 'bg-violet-500' }) {
  const { isDark } = useTheme();
  return (
    <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }} />
    </div>
  );
}

function EmptyState({ children }) {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-lg border border-dashed py-8 text-center text-sm ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-500'}`}>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    dashboardAPI
      .admin()
      .then((response) => {
        if (mounted) setData(response.data);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Unable to load admin dashboard.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = data?.stats || {};
  const revenuePeak = useMemo(
    () => Math.max(...(data?.revenueTrend || []).map((item) => item.total), 1),
    [data?.revenueTrend]
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className={`flex items-center gap-3 rounded-xl border px-5 py-4 shadow-sm ${isDark ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
          <Loader2 size={20} className="animate-spin text-violet-300" />
          Loading admin data
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
        <div className="flex items-center gap-2 font-semibold">
          <Info size={18} />
          Admin data unavailable
        </div>
        <p className="mt-2 text-sm text-red-100/80">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`-m-6 min-h-screen space-y-6 p-6 md:-m-8 md:p-8 ${isDark ? 'bg-[#0b1120] text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-300">Platform operations</p>
          <h1 className={`mt-1 text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>Admin Dashboard</h1>
          <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Live metrics from users, courses, enrollments, payments, and certificates.
          </p>
        </div>
        <div className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
          Last updated <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Total users" value={formatNumber(stats.totalUsers)} helper={`${formatNumber(stats.newUsers30d)} joined in 30 days`} />
        <MetricCard icon={BookOpen} label="Courses" value={formatNumber(stats.totalCourses)} helper={`${formatNumber(stats.publishedCourses)} published, ${formatNumber(stats.draftCourses)} drafts`} tone="sky" />
        <MetricCard icon={CreditCard} label="Revenue" value={formatMoney(stats.totalRevenue)} helper={`${formatMoney(stats.revenue30d)} in 30 days`} tone="emerald" />
        <MetricCard icon={GraduationCap} label="Enrollments" value={formatNumber(stats.totalEnrollments)} helper={`${formatNumber(stats.enrollments30d)} new in 30 days`} tone="amber" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Shield} label="Instructors" value={formatNumber(stats.totalInstructors)} helper={`${formatNumber(stats.totalStudents)} student accounts`} />
        <MetricCard icon={Award} label="Certificates" value={formatNumber(stats.certificates)} helper={`${stats.completionRate || 0}% completion rate`} tone="emerald" />
        <MetricCard icon={TrendingUp} label="Avg rating" value={(stats.averageRating || 0).toFixed(1)} helper={`${stats.averageProgress || 0}% average learner progress`} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Section title="Revenue Trend" action={<LineChart size={18} className="text-violet-300" />}>
          <div className={`flex h-64 items-end gap-3 border-b pb-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            {(data?.revenueTrend || []).map((item) => (
              <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                <div className={`flex h-44 w-full items-end rounded-lg px-2 ${isDark ? 'bg-slate-950/80' : 'bg-slate-100'}`}>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-violet-400"
                    style={{ height: `${Math.max(6, (item.total / revenuePeak) * 100)}%` }}
                    title={`${item.month}: ${formatMoney(item.total)}`}
                  />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.month}</p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatMoney(item.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Platform Health" action={<CheckCircle2 size={18} className="text-emerald-300" />}>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Published courses</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{data?.systemHealth?.publishedCourseRate || 0}%</span>
              </div>
              <ProgressBar value={data?.systemHealth?.publishedCourseRate} tone="bg-sky-500" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Paid conversion</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{data?.systemHealth?.paidConversionRate || 0}%</span>
              </div>
              <ProgressBar value={data?.systemHealth?.paidConversionRate} tone="bg-emerald-500" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Course completion</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{stats.completionRate || 0}%</span>
              </div>
              <ProgressBar value={stats.completionRate} tone="bg-violet-500" />
            </div>
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section title="Role Mix">
          <div className="space-y-3">
            {(data?.roleStats || []).map((role) => (
              <div key={role._id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className={`capitalize ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{role._id || 'unknown'}</span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{role.count}</span>
                </div>
                <ProgressBar value={(role.count / Math.max(stats.totalUsers || 1, 1)) * 100} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Payment Status">
          <div className="space-y-3">
            {(data?.paymentStatusStats || []).length ? data.paymentStatusStats.map((item) => (
              <div key={item._id} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${isDark ? 'border-slate-700 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusClass(item._id, isDark)}`}>{item._id}</span>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.count} payments</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{formatMoney(item.total)}</span>
              </div>
            )) : <EmptyState>No payment data yet</EmptyState>}
          </div>
        </Section>

        <Section title="Course Levels">
          <div className="space-y-3">
            {(data?.levelStats || []).map((level) => (
              <div key={level._id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{level._id || 'Unspecified'}</span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{level.count}</span>
                </div>
                <ProgressBar value={(level.count / Math.max(stats.totalCourses || 1, 1)) * 100} tone="bg-amber-500" />
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <Section title="Top Courses">
          {(data?.topCourses || []).length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className={`border-b text-xs uppercase tracking-wider ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-500'}`}>
                  <tr>
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Students</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {data.topCourses.map((course) => (
                    <tr key={course._id}>
                      <td className={`py-3 pr-4 font-medium ${isDark ? 'text-white' : 'text-slate-950'}`}>{course.title}</td>
                      <td className={`py-3 pr-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{course.category}</td>
                      <td className={`py-3 pr-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{formatNumber(course.students)}</td>
                      <td className={`py-3 pr-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{Number(course.rating || 0).toFixed(1)}</td>
                      <td className={`py-3 pr-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{formatMoney(course.price)}</td>
                      <td className="py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${
                          course.isPublished
                            ? isDark
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : isDark
                              ? 'border-slate-700 bg-slate-800 text-slate-300'
                              : 'border-slate-300 bg-slate-100 text-slate-600'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState>No courses found</EmptyState>}
        </Section>

        <Section title="Category Performance">
          <div className="space-y-4">
            {(data?.categoryStats || []).length ? data.categoryStats.map((category) => (
              <div key={category._id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-950'}`}>{category._id}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{category.count} courses, {formatNumber(category.students)} students</p>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{Number(category.averageRating || 0).toFixed(1)}</span>
                </div>
                <ProgressBar value={(category.count / Math.max(stats.totalCourses || 1, 1)) * 100} tone="bg-sky-500" />
              </div>
            )) : <EmptyState>No category data yet</EmptyState>}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section title="Recent Users">
          <div className="space-y-3">
            {(data?.recentUsers || []).length ? data.recentUsers.map((user) => (
              <div key={user._id} className={`flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-950'}`}>{user.name}</p>
                  <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs capitalize ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{user.role}</p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            )) : <EmptyState>No users yet</EmptyState>}
          </div>
        </Section>

        <Section title="Recent Payments">
          <div className="space-y-3">
            {(data?.recentPayments || []).length ? data.recentPayments.map((payment) => (
              <div key={payment._id} className={`border-b pb-3 last:border-0 last:pb-0 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-950'}`}>{payment.student?.name || payment.studentName || 'Unknown student'}</p>
                    <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{payment.courseName}</p>
                  </div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{formatMoney(payment.amount)}</p>
                </div>
                <div className={`mt-2 flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className={`rounded-full border px-2 py-0.5 capitalize ${statusClass(payment.status, isDark)}`}>{payment.status}</span>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
              </div>
            )) : <EmptyState>No payments yet</EmptyState>}
          </div>
        </Section>

        <Section title="Recent Enrollments">
          <div className="space-y-3">
            {(data?.recentEnrollments || []).length ? data.recentEnrollments.map((enrollment) => (
              <div key={enrollment._id} className={`border-b pb-3 last:border-0 last:pb-0 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-slate-950'}`}>{enrollment.student?.name || 'Unknown student'}</p>
                    <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{enrollment.course?.title || 'Unknown course'}</p>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatDate(enrollment.createdAt)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={enrollment.progressPercentage} tone="bg-violet-500" />
                  <span className={`w-10 text-right text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{Math.round(enrollment.progressPercentage || 0)}%</span>
                </div>
              </div>
            )) : <EmptyState>No enrollments yet</EmptyState>}
          </div>
        </Section>
      </div>
    </motion.div>
  );
}
