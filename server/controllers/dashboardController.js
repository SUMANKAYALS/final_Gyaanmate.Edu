import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';

export const studentDashboard = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
  const payments = await Payment.find({ student: req.user._id }).sort({ createdAt: -1 }).limit(5);
  const totalProgress =
    enrollments.reduce((s, e) => s + (e.progressPercentage || 0), 0) / (enrollments.length || 1);

  res.json({
    stats: {
      enrolledCourses: enrollments.length,
      completedCourses: enrollments.filter((e) => e.progressPercentage >= 100).length,
      averageProgress: Math.round(totalProgress),
      certificates: enrollments.filter((e) => e.certificateIssued).length,
    },
    recentEnrollments: enrollments.slice(0, 6),
    recentPayments: payments,
  });
};

export const instructorDashboard = async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map((c) => c._id);
  const enrollments = await Enrollment.find({ course: { $in: courseIds } });
  const payments = await Payment.find({ course: { $in: courseIds } });
  const revenue = payments.reduce((s, p) => s + p.amount, 0);

  res.json({
    stats: {
      totalCourses: courses.length,
      totalStudents: enrollments.length,
      totalRevenue: revenue,
      averageRating:
        courses.reduce((s, c) => s + c.rating, 0) / (courses.length || 1),
    },
    courses: courses.slice(0, 10),
    recentEnrollments: enrollments.slice(0, 10).map((e) => ({
      courseId: e.course,
      progress: e.progressPercentage,
      date: e.createdAt,
    })),
  });
};

export const adminDashboard = async (req, res) => {
  const [users, courses, enrollments, payments, instructors] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.countDocuments({ role: 'instructor' }),
  ]);

  const topCourses = await Course.find().sort({ students: -1 }).limit(5);
  const categoryStats = await Course.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(6).select('name email role createdAt');
  const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(6).populate('student', 'name email');

  res.json({
    stats: {
      totalUsers: users,
      totalCourses: courses,
      totalEnrollments: enrollments,
      totalRevenue: payments[0]?.total || 0,
      totalInstructors: instructors,
    },
    topCourses,
    categoryStats,
    recentUsers,
    recentPayments,
    aiAnalytics: {
      popularSearches: ['React courses', 'AI for beginners', 'Python', 'Cyber Security', 'Data Science'],
      searchConversionRate: '12.4%',
    },
  });
};
