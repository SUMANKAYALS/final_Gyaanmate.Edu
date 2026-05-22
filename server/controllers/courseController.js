import Course from '../models/Course.js';
import {
  isCloudinaryConfigured,
  uploadImage,
  uploadVideo,
  uploadPdf,
  getCloudinaryErrorMessage,
} from '../services/cloudinaryService.js';

function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      /* fall through */
    }
    return value
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

async function buildCoursePayload(body, files) {
  const data = {
    title: body.title?.trim(),
    description: body.description?.trim(),
    descriptionFull: body.descriptionFull?.trim() || '',
    price: parseFloat(body.price) || 0,
    category: body.category,
    categorySlug:
      body.categorySlug ||
      body.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    level: body.level || 'Beginner',
    duration: body.duration?.trim() || '8 weeks',
    language: body.language?.trim() || 'English',
    tags: parseList(body.tags),
    skills: parseList(body.skills),
    requirements: parseList(body.requirements),
    whatYouWillLearn: parseList(body.whatYouWillLearn),
  };

  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env'
    );
  }

  const thumb = files?.thumbnail?.[0];
  if (thumb) {
    data.image = await uploadImage(thumb.buffer);
  } else if (body.image?.startsWith('http')) {
    data.image = body.image;
  }

  const video = files?.introVideo?.[0];
  if (video) {
    data.introVideo = await uploadVideo(video.buffer);
  }

  const pdfs = files?.pdfs || [];
  if (pdfs.length) {
    data.resources = await Promise.all(
      pdfs.map((f) => uploadPdf(f.buffer, f.originalname))
    );
  }

  const lessons = [];
  if (data.introVideo) {
    lessons.push({
      title: 'Course Introduction',
      duration: body.duration?.trim() || '10 min',
      videoUrl: data.introVideo,
      order: 1,
    });
  }
  if (lessons.length) data.lessons = lessons;

  return data;
}

export const getCourses = async (req, res) => {
  const { category, level, search, sort = 'rating', limit = 24 } = req.query;
  const filter = { isPublished: true };
  if (category) filter.categorySlug = category;
  if (level) filter.level = level;
  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { title: pattern },
      { description: pattern },
      { category: pattern },
      { tags: pattern },
      { skills: pattern },
    ];
  }

  const sortMap = {
    rating: { rating: -1 },
    popular: { students: -1 },
    newest: { createdAt: -1 },
    price_low: { price: 1 },
    price_high: { price: -1 },
  };

  const courses = await Course.find(filter)
    .sort(sortMap[sort] || sortMap.rating)
    .limit(Number(limit))
    .populate('instructor', 'name avatar');

  res.json({ courses, total: courses.length });
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (err) {
    console.error('getCourseById:', err);
    res.status(400).json({ message: 'Invalid course id' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const payload = await buildCoursePayload(req.body, req.files);
    if (!payload.title || !payload.description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    if (!payload.image) {
      return res.status(400).json({ message: 'Course thumbnail is required' });
    }

    const course = await Course.create({
      ...payload,
      instructor: req.user._id,
      instructorName: req.user.name,
      instructorImage: req.user.avatar || '',
    });
    res.status(201).json({ course });
  } catch (err) {
    console.error('Create course error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A course with this title already exists. Try a different title.' });
    }
    const message = getCloudinaryErrorMessage(err);
    res.status(400).json({
      message: message.includes('Cloudinary') || err.http_code
        ? `Upload failed: ${message}`
        : message || 'Failed to create course',
    });
  }
};

export const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  Object.assign(course, req.body);
  await course.save();
  res.json({ course });
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
};

export const getInstructorCourses = async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
  res.json({ courses });
};
