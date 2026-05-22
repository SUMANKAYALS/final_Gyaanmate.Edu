/**
 * Intelligent course search with intent detection and synonym expansion.
 * Uses MongoDB text search + semantic keyword mapping.
 * Optional OpenAI enhancement when OPENAI_API_KEY is set.
 */

const TECH_SYNONYMS = {
  react: ['react', 'reactjs', 'react.js', 'frontend', 'jsx', 'hooks'],
  'react native': ['react native', 'mobile', 'expo', 'cross-platform'],
  nextjs: ['next.js', 'nextjs', 'next js', 'ssr', 'fullstack react'],
  mern: ['mern', 'mongodb', 'express', 'node', 'full stack javascript'],
  javascript: ['javascript', 'js', 'ecmascript', 'vanilla js'],
  python: ['python', 'django', 'flask', 'data science python'],
  ai: ['artificial intelligence', 'machine learning', 'deep learning', 'neural', 'llm', 'chatgpt'],
  ml: ['machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 'data science'],
  cybersecurity: ['cyber security', 'security', 'ethical hacking', 'penetration', 'network security'],
  'web development': ['html', 'css', 'javascript', 'frontend', 'backend', 'full stack'],
  data: ['data science', 'analytics', 'sql', 'pandas', 'visualization'],
};

const INTENT_PATTERNS = [
  { pattern: /best|top|popular|highest rated/i, sort: { rating: -1, students: -1 } },
  { pattern: /beginner|starter|intro|basics|from scratch/i, level: 'Beginner' },
  { pattern: /advanced|expert|professional/i, level: 'Advanced' },
  { pattern: /intermediate/i, level: 'Intermediate' },
  { pattern: /cheap|affordable|budget|under \$(\d+)/i, maxPrice: true },
  { pattern: /free/i, free: true },
];

const CATEGORY_ALIASES = {
  programming: 'Programming',
  'web development': 'Web Development',
  'ai & machine learning': 'AI & Machine Learning',
  'machine learning': 'AI & Machine Learning',
  cybersecurity: 'Cyber Security',
  'cyber security': 'Cyber Security',
  'data science': 'Data Science',
  medical: 'Medical & Healthcare',
  healthcare: 'Medical & Healthcare',
  business: 'Business & Finance',
  finance: 'Business & Finance',
  design: 'Graphic Design',
  'graphic design': 'Graphic Design',
  'video editing': 'Video Editing',
  language: 'Language Learning',
  music: 'Music & Arts',
  marketing: 'Marketing',
  photography: 'Photography',
  fitness: 'Fitness',
  'personal development': 'Personal Development',
  exam: 'Competitive Exams',
  school: 'School/College Education',
};

export function parseSearchIntent(query) {
  const intent = { keywords: [], sort: { rating: -1 }, level: null, category: null, suggestions: [] };
  const lower = query.toLowerCase().trim();

  for (const [alias, category] of Object.entries(CATEGORY_ALIASES)) {
    if (lower.includes(alias)) {
      intent.category = category;
      break;
    }
  }

  for (const [tech, synonyms] of Object.entries(TECH_SYNONYMS)) {
    if (synonyms.some((s) => lower.includes(s)) || lower.includes(tech)) {
      intent.keywords.push(...synonyms);
      intent.suggestions.push(
        ...Object.keys(TECH_SYNONYMS)
          .filter((k) => k !== tech)
          .slice(0, 4)
          .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
      );
    }
  }

  if (intent.keywords.length === 0) {
    intent.keywords = lower.split(/\s+/).filter((w) => w.length > 2);
  }

  for (const { pattern, sort, level, maxPrice, free } of INTENT_PATTERNS) {
    if (pattern.test(query)) {
      if (sort) intent.sort = sort;
      if (level) intent.level = level;
      if (maxPrice) intent.maxPrice = 50;
      if (free) intent.maxPrice = 0;
    }
  }

  intent.suggestions = [...new Set(intent.suggestions)].slice(0, 5);
  return intent;
}

export function buildSearchQuery(intent, Course) {
  const conditions = [{ isPublished: true }];

  if (intent.category) {
    conditions.push({ category: intent.category });
  }

  if (intent.level) {
    conditions.push({ level: intent.level });
  }

  if (intent.maxPrice !== undefined) {
    conditions.push({ price: { $lte: intent.maxPrice } });
  }

  const searchTerms = [...new Set(intent.keywords)].join(' ');

  if (searchTerms.length > 0) {
    return Course.find({ $and: conditions, $text: { $search: searchTerms } })
      .sort({ score: { $meta: 'textScore' }, ...intent.sort })
      .populate('instructor', 'name avatar')
      .limit(20)
      .select('-searchText');
  }

  return Course.find({ $and: conditions })
    .sort(intent.sort)
    .populate('instructor', 'name avatar')
    .limit(20);
}

export async function fallbackKeywordSearch(Course, query, intent) {
  const regex = new RegExp(intent.keywords.join('|') || query, 'i');
  const filter = {
    isPublished: true,
    $or: [
      { title: regex },
      { description: regex },
      { category: regex },
      { tags: regex },
      { skills: regex },
    ],
  };
  if (intent.category) filter.category = intent.category;
  if (intent.level) filter.level = intent.level;

  return Course.find(filter)
    .sort(intent.sort)
    .populate('instructor', 'name avatar')
    .limit(20);
}

// Gemini enhancement is handled in server/services/geminiService.js
