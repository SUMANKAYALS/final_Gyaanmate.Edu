import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';

const categories = [
  { name: 'Programming', slug: 'programming', icon: '💻', description: 'Learn to code in any language' },
  { name: 'Web Development', slug: 'web-development', icon: '🌐', description: 'Build modern web applications' },
  { name: 'AI & Machine Learning', slug: 'ai-machine-learning', icon: '🤖', description: 'Master AI and ML technologies' },
  { name: 'Cyber Security', slug: 'cyber-security', icon: '🔒', description: 'Protect systems and networks' },
  { name: 'Data Science', slug: 'data-science', icon: '📊', description: 'Analyze and visualize data' },
  { name: 'Medical & Healthcare', slug: 'medical-healthcare', icon: '🏥', description: 'Healthcare and medical training' },
  { name: 'Business & Finance', slug: 'business-finance', icon: '💼', description: 'Business skills and finance' },
  { name: 'Graphic Design', slug: 'graphic-design', icon: '🎨', description: 'Visual design and creativity' },
  { name: 'Video Editing', slug: 'video-editing', icon: '🎬', description: 'Edit professional videos' },
  { name: 'Language Learning', slug: 'language-learning', icon: '🗣️', description: 'Learn new languages' },
  { name: 'School/College Education', slug: 'school-college', icon: '📚', description: 'Academic subjects' },
  { name: 'Competitive Exams', slug: 'competitive-exams', icon: '📝', description: 'Exam preparation' },
  { name: 'Music & Arts', slug: 'music-arts', icon: '🎵', description: 'Music and creative arts' },
  { name: 'Marketing', slug: 'marketing', icon: '📣', description: 'Digital and traditional marketing' },
  { name: 'Photography', slug: 'photography', icon: '📷', description: 'Photography techniques' },
  { name: 'Fitness', slug: 'fitness', icon: '💪', description: 'Health and fitness training' },
  { name: 'Personal Development', slug: 'personal-development', icon: '🌟', description: 'Grow personally and professionally' },
];

import { courseTemplates } from './courseSeedData.js';

const ADMIN_EMAIL = 'gyaanmate.edu@gmail.com';
const OLD_ADMIN_EMAIL = 'admin@learnhub.ai';

const images = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
  'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800',
];

const demoUsers = [
  {
    name: 'Admin User',
    email: ADMIN_EMAIL,
    password: 'admin123',
    role: 'admin',
    emailVerified: true,
  },
  {
    name: 'Sarah Chen',
    email: 'instructor1@learnhub.ai',
    password: 'instructor123',
    role: 'instructor',
    instructorProfile: { expertise: ['Technology', 'Design'], totalStudents: 0, totalRevenue: 0 },
  },
  {
    name: 'Michael Torres',
    email: 'instructor2@learnhub.ai',
    password: 'instructor123',
    role: 'instructor',
    instructorProfile: { expertise: ['Technology', 'Design'], totalStudents: 0, totalRevenue: 0 },
  },
  {
    name: 'Emma Wilson',
    email: 'instructor3@learnhub.ai',
    password: 'instructor123',
    role: 'instructor',
    instructorProfile: { expertise: ['Technology', 'Design'], totalStudents: 0, totalRevenue: 0 },
  },
  {
    name: 'James Park',
    email: 'instructor4@learnhub.ai',
    password: 'instructor123',
    role: 'instructor',
    instructorProfile: { expertise: ['Technology', 'Design'], totalStudents: 0, totalRevenue: 0 },
  },
  {
    name: 'Lisa Kumar',
    email: 'instructor5@learnhub.ai',
    password: 'instructor123',
    role: 'instructor',
    instructorProfile: { expertise: ['Technology', 'Design'], totalStudents: 0, totalRevenue: 0 },
  },
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function ensureDemoUsers() {
  let created = 0;
  const oldAdmin = await User.findOne({ email: OLD_ADMIN_EMAIL });
  const newAdmin = await User.findOne({ email: ADMIN_EMAIL });

  if (oldAdmin && !newAdmin) {
    oldAdmin.email = ADMIN_EMAIL;
    oldAdmin.role = 'admin';
    oldAdmin.emailVerified = true;
    await oldAdmin.save();
  }

  for (const user of demoUsers) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      await User.create(user);
      created += 1;
    } else if (user.role === 'admin') {
      await User.updateOne(
        { _id: existing._id },
        { $set: { role: 'admin', emailVerified: true } }
      );
    }
  }

  return created;
}

async function ensureCategories() {
  let created = 0;

  for (const category of categories) {
    const existing = await Category.findOne({ slug: category.slug });
    if (!existing) {
      await Category.create(category);
      created += 1;
    } else {
      await Category.updateOne(
        { slug: category.slug },
        {
          $set: {
            name: category.name,
            icon: category.icon,
            description: category.description,
          },
        }
      );
    }
  }

  return created;
}

async function ensureCourses() {
  const instructors = await User.find({ email: { $in: demoUsers.map((user) => user.email) } }).lean();
  const instructorMap = new Map(instructors.map((instructor) => [instructor.email, instructor]));
  let created = 0;

  for (const [index, template] of courseTemplates.entries()) {
    const category = categories.find((item) => item.name === template.category);
    const instructor = instructorMap.get(`instructor${(index % 5) + 1}@learnhub.ai`) ?? instructors[0];

    if (!instructor) {
      throw new Error('No instructor accounts were found for demo course seeding.');
    }

    const courseSlug = slugify(template.title);
    const courseData = {
      title: template.title,
      slug: courseSlug,
      description: `Master ${template.title.split(' ').slice(0, 3).join(' ')} with hands-on projects and expert instruction.`,
      descriptionFull: `This comprehensive course on ${template.title} covers everything from fundamentals to advanced topics. Perfect for ${template.level.toLowerCase()} learners.`,
      instructor: instructor._id,
      instructorName: instructor.name,
      instructorImage: `https://i.pravatar.cc/150?u=${instructor._id}`,
      price: template.price,
      category: template.category,
      categorySlug: category?.slug || slugify(template.category),
      image: images[index % images.length],
      rating: template.rating,
      students: template.students,
      duration: `${6 + (index % 6)} weeks`,
      level: template.level,
      reviews: Math.floor(template.students * 0.08),
      tags: template.tags,
      skills: template.tags.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)),
      lessons: [
        { title: 'Introduction & Setup', duration: '15 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Core Concepts', duration: '45 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Hands-on Project', duration: '60 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Advanced Techniques', duration: '50 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Final Assessment', duration: '30 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
      ],
      isPublished: true,
    };

    const existingCourse = await Course.findOne({ slug: courseSlug });
    if (!existingCourse) {
      await Course.create(courseData);
      created += 1;
      continue;
    }

    Object.assign(existingCourse, courseData);
    await existingCourse.save();
  }

  return created;
}

async function updateCategoryCounts() {
  for (const category of categories) {
    const count = await Course.countDocuments({ category: category.name });
    await Category.updateOne({ slug: category.slug }, { courseCount: count });
  }
}

async function seedDemoData() {
  await connectDB();
  const createdUsers = await ensureDemoUsers();
  const createdCategories = await ensureCategories();
  const createdCourses = await ensureCourses();
  await updateCategoryCounts();

  console.log('✅ Demo data is up to date.');
  console.log(`Created users: ${createdUsers}`);
  console.log(`Created categories: ${createdCategories}`);
  console.log(`Created courses: ${createdCourses}`);
  console.log('Demo accounts: gyaanmate.edu@gmail.com / admin123 | instructor1@learnhub.ai / instructor123');
  await mongoose.disconnect();
}

seedDemoData().catch(async (error) => {
  console.error('❌ Failed to seed demo data:', error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
