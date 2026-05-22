import Feedback from '../models/Feedback.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';

async function recalculateCourseRating(courseId) {
  const visibleFeedbacks = await Feedback.find({ course: courseId, visible: true });
  const course = await Course.findById(courseId);
  if (!course) return;

  if (visibleFeedbacks.length === 0) {
    course.reviews = 0;
    course.rating = 4.5;
  } else {
    const sum = visibleFeedbacks.reduce((s, f) => s + f.rating, 0);
    course.reviews = visibleFeedbacks.length;
    course.rating = Math.round((sum / visibleFeedbacks.length) * 10) / 10;
  }
  await course.save();
}

function ownsCourse(course, user) {
  return (
    course.instructor.toString() === user._id.toString() || user.role === 'admin'
  );
}

/** Reviews only after checkout (completed payment) or 100% course completion. */
async function canAccessCourseReviews(user, courseId) {
  const course = await Course.findById(courseId);
  if (!course) return false;
  if (ownsCourse(course, user)) return true;

  const payment = await Payment.findOne({
    student: user._id,
    course: courseId,
    status: 'completed',
  });
  if (payment) return true;

  const enrollment = await Enrollment.findOne({
    student: user._id,
    course: courseId,
  });
  return (enrollment?.progressPercentage ?? 0) >= 100;
}

async function getCourseOr404(courseId, res) {
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404).json({ message: 'Course not found' });
    return null;
  }
  return course;
}

export const createFeedback = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const course = await getCourseOr404(courseId, res);
    if (!course) return;

    if (!course.feedbackEnabled) {
      return res.status(403).json({ message: 'Feedback is disabled for this course' });
    }

    const canReview = await canAccessCourseReviews(req.user, courseId);
    if (!canReview) {
      return res.status(403).json({
        message: 'You must purchase or complete this course before leaving feedback',
      });
    }

    const feedback = await Feedback.create({
      course: courseId,
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
      visible: true,
    });

    await recalculateCourseRating(courseId);

    res.status(201).json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCourseFeedbacks = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await getCourseOr404(courseId, res);
    if (!course) return;

    const isInstructor = ownsCourse(course, req.user);
    const canView = await canAccessCourseReviews(req.user, courseId);

    if (!isInstructor && !canView) {
      return res.status(403).json({
        message: 'Purchase this course to view student feedback',
      });
    }

    if (!course.feedbackEnabled && !isInstructor) {
      return res.json({
        feedbacks: [],
        feedbackEnabled: false,
        canManage: false,
      });
    }

    const filter = { course: courseId };
    if (!isInstructor) filter.visible = true;

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      feedbacks,
      feedbackEnabled: course.feedbackEnabled,
      canManage: isInstructor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFeedbackSettings = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    if (!ownsCourse(course, req.user)) {
      return res.status(403).json({ message: 'Not authorized to manage this course' });
    }

    if (typeof req.body.feedbackEnabled === 'boolean') {
      course.feedbackEnabled = req.body.feedbackEnabled;
    }
    await course.save();

    res.json({ course: { _id: course._id, feedbackEnabled: course.feedbackEnabled } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFeedbackVisibility = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    if (!ownsCourse(course, req.user)) {
      return res.status(403).json({ message: 'Not authorized to manage this course' });
    }

    const feedback = await Feedback.findOne({
      _id: req.params.feedbackId,
      course: req.params.id,
    });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    if (typeof req.body.visible === 'boolean') {
      feedback.visible = req.body.visible;
      await feedback.save();
      await recalculateCourseRating(req.params.id);
    }

    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    if (!ownsCourse(course, req.user)) {
      return res.status(403).json({ message: 'Not authorized to manage this course' });
    }

    const feedback = await Feedback.findOneAndDelete({
      _id: req.params.feedbackId,
      course: req.params.id,
    });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    await recalculateCourseRating(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
