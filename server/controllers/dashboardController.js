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
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    users,
    courses,
    enrollments,
    payments,
    instructors,
    students,
    publishedCourses,
    draftCourses,
    newUsers30d,
    enrollments30d,
    revenue30d,
    certificates,
    averageProgressResult,
    averageRatingResult,
    roleStats,
    paymentStatusStats,
    levelStats,
    revenueTrendRaw,
    totalPayments,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.countDocuments({ role: 'instructor' }),
    User.countDocuments({ role: 'student' }),
    Course.countDocuments({ isPublished: true }),
    Course.countDocuments({ isPublished: false }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Enrollment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Payment.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Enrollment.countDocuments({ certificateIssued: true }),
    Enrollment.aggregate([{ $group: { _id: null, average: { $avg: '$progressPercentage' } } }]),
    Course.aggregate([{ $group: { _id: null, average: { $avg: '$rating' } } }]),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } }, { $sort: { count: -1 } }]),
    Course.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Payment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Payment.countDocuments(),
  ]);

  const [topCourses, categoryStats, recentUsers, recentPayments, recentEnrollments] = await Promise.all([
    Course.find()
      .sort({ students: -1, rating: -1 })
      .limit(8)
      .select('title category students rating price isPublished instructorName'),
    Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, students: { $sum: '$students' }, averageRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    User.find().sort({ createdAt: -1 }).limit(8).select('name email role emailVerified createdAt'),
    Payment.find().sort({ createdAt: -1 }).limit(8).populate('student', 'name email').select('student studentName courseName amount status method createdAt'),
    Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('student', 'name email')
      .populate('course', 'title category')
      .select('student course progressPercentage certificateIssued createdAt'),
  ]);

  const trendMap = new Map(revenueTrendRaw.map((item) => [item._id, item]));
  const revenueTrend = Array.from({ length: 6 }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + offset, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const item = trendMap.get(key);
    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      total: item?.total || 0,
      count: item?.count || 0,
    };
  });

  const totalRevenue = payments[0]?.total || 0;
  const completionRate = enrollments ? Math.round((certificates / enrollments) * 100) : 0;
  const averageProgress = Math.round(averageProgressResult[0]?.average || 0);
  const averageRating = Number((averageRatingResult[0]?.average || 0).toFixed(1));

  res.json({
    stats: {
      totalUsers: users,
      totalStudents: students,
      totalCourses: courses,
      publishedCourses,
      draftCourses,
      totalEnrollments: enrollments,
      totalRevenue,
      totalInstructors: instructors,
      certificates,
      completionRate,
      averageProgress,
      averageRating,
      newUsers30d,
      enrollments30d,
      revenue30d: revenue30d[0]?.total || 0,
    },
    topCourses,
    categoryStats,
    recentUsers,
    recentPayments,
    recentEnrollments,
    roleStats,
    paymentStatusStats,
    levelStats,
    revenueTrend,
    systemHealth: {
      publishedCourseRate: courses ? Math.round((publishedCourses / courses) * 100) : 0,
      paidConversionRate: enrollments ? Math.round((totalPayments / enrollments) * 100) : 0,
      verifiedUsers: recentUsers.filter((user) => user.emailVerified).length,
    },
  });
};
