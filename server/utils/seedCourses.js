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

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Course.deleteMany({})]);

  await User.create({
    name: 'Admin User',
    email: 'gyaanmate.edu@gmail.com',
    password: 'admin123',
    role: 'admin',
    emailVerified: true,
  });

  const instructorNames = ['Sarah Chen', 'Michael Torres', 'Emma Wilson', 'James Park', 'Lisa Kumar'];
  const instructors = [];
  for (let i = 0; i < instructorNames.length; i++) {
    const inst = await User.create({
      name: instructorNames[i],
      email: `instructor${i + 1}@learnhub.ai`,
      password: 'instructor123',
      role: 'instructor',
      instructorProfile: { expertise: ['Technology', 'Design'], totalStudents: 0, totalRevenue: 0 },
    });
    instructors.push(inst);
  }

  await Category.insertMany(categories);

  const images = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800',
  ];

  const courses = courseTemplates.map((t, i) => {
    const instructor = instructors[i % instructors.length];
    const cat = categories.find((c) => c.name === t.category);
    return {
      title: t.title,
      slug: slugify(t.title),
      description: `Master ${t.title.split(' ').slice(0, 3).join(' ')} with hands-on projects and expert instruction.`,
      descriptionFull: `This comprehensive course on ${t.title} covers everything from fundamentals to advanced topics. Perfect for ${t.level.toLowerCase()} learners.`,
      instructor: instructor._id,
      instructorName: instructor.name,
      instructorImage: `https://i.pravatar.cc/150?u=${instructor._id}`,
      price: t.price,
      category: t.category,
      categorySlug: cat?.slug || slugify(t.category),
      image: images[i % images.length],
      rating: t.rating,
      students: t.students,
      duration: `${6 + (i % 6)} weeks`,
      level: t.level,
      reviews: Math.floor(t.students * 0.08),
      tags: t.tags,
      skills: t.tags.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)),
      lessons: [
        { title: 'Introduction & Setup', duration: '15 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Core Concepts', duration: '45 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Hands-on Project', duration: '60 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Advanced Techniques', duration: '50 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Final Assessment', duration: '30 min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
      ],
      isPublished: true,
    };
  });

  await Course.insertMany(courses);

  for (const cat of categories) {
    const count = await Course.countDocuments({ category: cat.name });
    await Category.updateOne({ slug: cat.slug }, { courseCount: count });
  }

  console.log('✅ Seed complete!');
  console.log('Admin: gyaanmate.edu@gmail.com / admin123');
  console.log('Instructor: instructor1@learnhub.ai / instructor123');
  console.log(`Courses: ${courses.length}, Categories: ${categories.length}`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
