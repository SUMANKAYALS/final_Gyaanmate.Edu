import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { generateCertificatePDF } from '../services/receiptService.js';

export const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course')
    .sort({ updatedAt: -1 });
  res.json({ enrollments });
};

export const enrollInCourse = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  let enrollment = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (enrollment) return res.status(400).json({ message: 'Already enrolled' });

  enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id,
    currentLesson: 1,
  });

  course.students += 1;
  await course.save();

  res.status(201).json({ enrollment: await enrollment.populate('course') });
};

export const updateProgress = async (req, res) => {
  const { lessonId, completed } = req.body;
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

  if (completed && !enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }
  enrollment.currentLesson = lessonId;
  const course = await Course.findById(req.params.courseId);
  const total = course?.lessons?.length || 1;
  enrollment.progressPercentage = Math.round((enrollment.completedLessons.length / total) * 100);
  if (enrollment.progressPercentage >= 100) enrollment.certificateIssued = true;
  await enrollment.save();
  res.json({ enrollment });
};

export const downloadCertificate = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  }).populate('course');

  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
  if (enrollment.progressPercentage < 100) return res.status(403).json({ message: 'Course not yet completed' });

  const course = enrollment.course;
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const pdf = await generateCertificatePDF({
    courseTitle: course.title,
    studentName: req.user.name || 'Student',
    instructorName: course.instructorName || 'Instructor',
    completedAt: enrollment.updatedAt,
    certificateId: enrollment._id,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${course.title.replace(/\s+/g, '_')}_Certificate.pdf"`
  );
  res.send(pdf);
};
