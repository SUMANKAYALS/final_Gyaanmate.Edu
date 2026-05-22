import { v4 as uuidv4 } from 'uuid';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { generateReceiptPDF } from '../services/receiptService.js';

export const processPayment = async (req, res) => {
  const { courseIds, method = 'card' } = req.body;
  if (!courseIds?.length) return res.status(400).json({ message: 'No courses selected' });

  const courses = await Course.find({ _id: { $in: courseIds } });
  const payments = [];

  for (const course of courses) {
    const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
    if (existing) continue;

    const payment = await Payment.create({
      paymentId: `LH-${uuidv4().slice(0, 8).toUpperCase()}`,
      student: req.user._id,
      studentName: req.user.name,
      course: course._id,
      courseName: course.title,
      instructorName: course.instructorName,
      amount: course.price,
      status: 'completed',
      method,
    });

    await Enrollment.create({
      student: req.user._id,
      course: course._id,
      currentLesson: 1,
    });

    course.students += 1;
    await course.save();
    payments.push(payment);
  }

  res.status(201).json({
    message: 'Payment successful',
    payments,
    total: payments.reduce((s, p) => s + p.amount, 0),
  });
};

export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json({ payments });
};

export const downloadReceipt = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  if (payment.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const pdf = await generateReceiptPDF(payment);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=receipt-${payment.paymentId}.pdf`);
  res.send(pdf);
};
