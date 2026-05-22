import Course from '../models/Course.js';
import {
  parseSearchIntent,
  buildSearchQuery,
  fallbackKeywordSearch,
} from '../ai/searchEngine.js';
import { enhanceSearchWithGemini } from './geminiService.js';

export async function searchCoursesWithAI(query) {
  const intent = parseSearchIntent(query);
  let courses = [];

  try {
    courses = await buildSearchQuery(intent, Course);
    if (!courses?.length) {
      courses = await fallbackKeywordSearch(Course, query, intent);
    }
  } catch {
    courses = await fallbackKeywordSearch(Course, query, intent);
  }

  const courseList = courses.map((c) => c.toObject());

  const aiEnhancement = await enhanceSearchWithGemini(query, courseList);

  let message = `Found ${courseList.length} course(s) matching your search.`;
  let relatedTopics = intent.suggestions;

  if (aiEnhancement?.message) {
    message = aiEnhancement.message;
    relatedTopics = aiEnhancement.relatedTopics || relatedTopics;
    if (aiEnhancement.rankedCourseIds?.length) {
      const order = aiEnhancement.rankedCourseIds;
      courseList.sort((a, b) => order.indexOf(String(a._id)) - order.indexOf(String(b._id)));
    }
  } else if (query.toLowerCase().includes('react')) {
    message = 'Here are React and related frontend courses for you!';
    relatedTopics = ['React Native', 'Next.js', 'MERN Stack', 'Frontend Development', 'JavaScript'];
  } else if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('machine learning')) {
    message = intent.level === 'Beginner'
      ? 'Top beginner-friendly AI & Machine Learning courses:'
      : 'Here are AI & Machine Learning courses matching your interest:';
    relatedTopics = ['Deep Learning', 'Python for AI', 'NLP', 'Computer Vision', 'TensorFlow'];
  }

  return {
    query,
    intent: {
      category: intent.category,
      level: intent.level,
      keywords: intent.keywords.slice(0, 10),
    },
    message,
    courses: courseList,
    relatedTopics,
    total: courseList.length,
    provider: aiEnhancement ? 'gemini' : 'local',
  };
}
