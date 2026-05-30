import Course from '../models/Course.js';
import Note from '../models/Note.js';
import { parseSearchIntent } from '../ai/searchEngine.js';

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const STOP_WORDS = new Set([
  'and',
  'are',
  'best',
  'course',
  'courses',
  'for',
  'from',
  'how',
  'learn',
  'learning',
  'material',
  'materials',
  'need',
  'roadmap',
  'study',
  'the',
  'to',
  'want',
  'with',
]);

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/[^a-z0-9+#.]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getRequestedLevel(level, intentLevel) {
  const normalized = String(level || intentLevel || '').toLowerCase();
  return LEVEL_ORDER.find((item) => item.toLowerCase() === normalized) || intentLevel || '';
}

function getCourseText(course) {
  return [
    course.title,
    course.description,
    course.descriptionFull,
    course.category,
    course.level,
    course.language,
    ...(course.tags || []),
    ...(course.skills || []),
    ...(course.requirements || []),
    ...(course.whatYouWillLearn || []),
  ]
    .filter(Boolean)
    .join(' ');
}

function scoreCourse(course, context) {
  const haystack = normalizeText(getCourseText(course));
  let score = 0;
  const reasons = [];

  const keywordHits = context.keywords.filter((keyword) => haystack.includes(normalizeText(keyword)));
  if (keywordHits.length) {
    score += keywordHits.length * 12;
    reasons.push(`Matches ${keywordHits.slice(0, 3).join(', ')}`);
  }

  if (context.category && course.category === context.category) {
    score += 22;
    reasons.push(`Strong fit for ${context.category}`);
  }

  if (context.level) {
    if (course.level === context.level || course.level === 'All Levels') {
      score += 16;
      reasons.push(`${course.level} level matches your readiness`);
    } else {
      const requestedIndex = LEVEL_ORDER.indexOf(context.level);
      const courseIndex = LEVEL_ORDER.indexOf(course.level);
      if (requestedIndex >= 0 && courseIndex >= 0 && Math.abs(requestedIndex - courseIndex) === 1) {
        score += 5;
      }
    }
  }

  if (Number.isFinite(context.budget) && course.price <= context.budget) {
    score += 8;
    reasons.push(`Within your budget`);
  }

  score += Math.min(Number(course.rating || 0) * 3, 15);
  score += Math.min(Number(course.students || 0) / 250, 10);
  score += Math.min((course.skills || []).length, 8);

  if (course.rating >= 4.5) reasons.push('Highly rated by learners');
  if (course.students >= 1000) reasons.push('Popular with students');
  if ((course.lessons || []).length >= 4) reasons.push('Structured lesson plan');

  return {
    course,
    score: Math.round(score),
    reasons: unique(reasons).slice(0, 4),
    matchedKeywords: unique(keywordHits).slice(0, 8),
  };
}

function scoreNote(note, context) {
  const haystack = normalizeText([
    note.title,
    note.description,
    note.category,
    note.department,
    note.subject,
    ...(note.tags || []),
  ].join(' '));

  const keywordHits = context.keywords.filter((keyword) => haystack.includes(normalizeText(keyword)));
  let score = keywordHits.length * 10;
  if (context.category && note.category === context.category) score += 12;
  score += Math.min(Number(note.downloads || 0) / 20, 8);
  score += Math.min(Number(note.likes || 0), 8);

  return {
    note,
    score: Math.round(score),
    reason: keywordHits.length
      ? `Supports ${keywordHits.slice(0, 3).join(', ')}`
      : 'Useful supporting study material',
  };
}

function buildContext(input) {
  const goal = String(input?.goal || '').trim();
  const interests = Array.isArray(input?.interests)
    ? input.interests.join(' ')
    : String(input?.interests || '');
  const query = `${goal} ${interests}`.trim();
  const intent = parseSearchIntent(query || 'programming');
  const keywords = unique([
    ...tokenize(query),
    ...(intent.keywords || []),
    ...(input?.skills ? tokenize(input.skills) : []),
  ]).slice(0, 24);

  const budget = input?.budget === '' || input?.budget == null ? null : Number(input.budget);

  return {
    query,
    goal,
    category: input?.category || intent.category || '',
    level: getRequestedLevel(input?.level, intent.level),
    keywords,
    budget: Number.isFinite(budget) ? budget : null,
    intent,
    excludeCourseIds: Array.isArray(input?.excludeCourseIds)
      ? input.excludeCourseIds.map(String).filter(Boolean)
      : [],
  };
}

function buildMessage(context, recommendations) {
  if (!recommendations.length) {
    return 'No strong matches were found yet. Try broadening your goal or browsing all courses.';
  }

  const categoryText = context.category ? ` in ${context.category}` : '';
  const levelText = context.level ? ` for ${context.level.toLowerCase()} learners` : '';
  return `Recommended ${recommendations.length} course${recommendations.length === 1 ? '' : 's'}${categoryText}${levelText}, ranked by topic fit, level, rating, popularity, and available learning resources.`;
}

export async function recommendLearningResources(input = {}) {
  const context = buildContext(input);
  const regex = new RegExp(context.keywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') || context.query || 'course', 'i');

  const courseFilter = {
    isPublished: true,
    $or: [
      { title: regex },
      { description: regex },
      { descriptionFull: regex },
      { category: regex },
      { tags: regex },
      { skills: regex },
      { whatYouWillLearn: regex },
    ],
  };

  if (context.excludeCourseIds.length) {
    courseFilter._id = { $nin: context.excludeCourseIds };
  }
  if (context.category) courseFilter.category = context.category;
  if (Number.isFinite(context.budget)) courseFilter.price = { $lte: context.budget };

  let courses = await Course.find(courseFilter)
    .sort({ rating: -1, students: -1 })
    .limit(40)
    .populate('instructor', 'name avatar')
    .select('-searchText');

  if (!courses.length) {
    const fallbackFilter = { isPublished: true };
    if (context.excludeCourseIds.length) {
      fallbackFilter._id = { $nin: context.excludeCourseIds };
    }
    courses = await Course.find(fallbackFilter)
      .sort({ rating: -1, students: -1 })
      .limit(40)
      .populate('instructor', 'name avatar')
      .select('-searchText');
  }

  const ranked = courses
    .map((course) => scoreCourse(course.toObject(), context))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const noteFilter = {
    isApproved: true,
    $or: [
      { title: regex },
      { description: regex },
      { category: regex },
      { subject: regex },
      { tags: regex },
    ],
  };
  if (context.category) noteFilter.category = context.category;

  const notes = await Note.find(noteFilter)
    .sort({ downloads: -1, likes: -1, createdAt: -1 })
    .limit(12)
    .select('title description category subject tags file thumbnail downloads likes createdAt');

  const materials = notes
    .map((note) => scoreNote(note.toObject(), context))
    .filter((item) => item.score > 0 || ranked.length)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => ({
      ...item.note,
      score: item.score,
      reason: item.reason,
    }));

  const recommendations = ranked.map((item, index) => ({
    ...item.course,
    rank: index + 1,
    recommendationScore: Math.max(1, Math.min(100, item.score)),
    recommendationReasons: item.reasons.length ? item.reasons : ['Good overall match for your learning goal'],
    matchedKeywords: item.matchedKeywords,
  }));

  return {
    query: context.query,
    message: buildMessage(context, recommendations),
    intent: {
      category: context.category,
      level: context.level,
      keywords: context.keywords.slice(0, 10),
      budget: context.budget,
    },
    recommendations,
    studyMaterials: materials,
    nextSteps: [
      recommendations[0] ? `Start with "${recommendations[0].title}"` : 'Browse the course marketplace',
      materials[0] ? `Review "${materials[0].title}" as supporting material` : 'Save useful notes while studying',
      'Take a mock test after completing the first module',
    ],
    provider: 'local-recommender',
  };
}
