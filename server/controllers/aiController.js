import { searchCoursesWithAI } from '../services/aiSearchService.js';
import { chatWithGemini, chatBotWithGemini, isGeminiConfigured } from '../services/geminiService.js';
import {
  createTextPdfBuffer,
  extractTextFromFile,
  getTextPdfFileName,
} from '../services/ocrPdfService.js';
import { generateMockTestQuestions } from '../services/mockTestService.js';
import { recommendLearningResources } from '../services/recommendationService.js';
import { analyzeSentiment } from '../services/sentimentService.js';

export const aiSearch = async (req, res) => {
  const { query } = req.body;
  if (!query?.trim()) {
    return res.status(400).json({ message: 'Query is required' });
  }
  const result = await searchCoursesWithAI(query.trim());
  res.json(result);
};

export const aiChat = async (req, res) => {
  const { messages } = req.body;
  const lastUser = [...(messages || [])].reverse().find((m) => m.role === 'user');
  const query = lastUser?.content || '';

  const searchResult = await searchCoursesWithAI(query);
  let courses = searchResult.courses;

  if (isGeminiConfigured()) {
    const geminiReply = await chatWithGemini(messages, courses);
    if (geminiReply?.content) {
      if (geminiReply.rankedCourseIds?.length) {
        const order = geminiReply.rankedCourseIds;
        courses = [...courses].sort(
          (a, b) => order.indexOf(String(a._id)) - order.indexOf(String(b._id))
        );
      }
      return res.json({
        role: 'assistant',
        content: geminiReply.content,
        courses,
        relatedTopics: geminiReply.relatedTopics || searchResult.relatedTopics,
        intent: searchResult.intent,
        provider: 'gemini',
      });
    }
  }

  res.json({
    role: 'assistant',
    content: searchResult.message,
    courses: searchResult.courses,
    relatedTopics: searchResult.relatedTopics,
    intent: searchResult.intent,
    provider: searchResult.provider || 'local',
  });
};

function localBotReply(query, courses) {
  const q = (query || '').toLowerCase();
  if (courses?.length) {
    const list = courses
      .slice(0, 4)
      .map((c) => `• ${c.title} (${c.category})`)
      .join('\n');
    return `Here are some courses that match what you asked:\n\n${list}\n\nTap a course card below to view details, or browse all courses on LearnHub!`;
  }
  if (/^(hi|hello|hey|good\s)/.test(q)) {
    return "Hello! I'm Gyaanmate. I can help you discover courses, plan what to learn next, or answer study questions. What would you like to learn?";
  }
  return "I'm Gyaanmate! Ask me about any topic — for example: \"React for beginners\", \"best AI courses\", or \"how do I start coding?\". I'll suggest courses from our catalog.";
}

/** General conversational chatbot (not JSON-only search mode) */
export const botChat = async (req, res) => {
  const { messages } = req.body;
  if (!messages?.length) {
    return res.status(400).json({ message: 'Messages are required' });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const query = lastUser?.content?.trim() || '';

  let courses = [];
  if (query.length > 1) {
    const searchResult = await searchCoursesWithAI(query);
    courses = searchResult.courses?.slice(0, 6) || [];
  }

  if (isGeminiConfigured()) {
    const text = await chatBotWithGemini(messages, courses);
    if (text) {
      return res.json({
        role: 'assistant',
        content: text,
        courses: courses.length ? courses : undefined,
        provider: 'gemini',
      });
    }
  }

  res.json({
    role: 'assistant',
    content: localBotReply(query, courses),
    courses: courses.length ? courses : undefined,
    provider: 'local',
  });
};

export const generateMockTest = async (req, res) => {
  const { topic, difficulty, count } = req.body;
  if (!topic?.trim()) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  const result = await generateMockTestQuestions({
    topic: topic.trim(),
    difficulty,
    count,
  });

  res.json(result);
};

export const aiRecommendations = async (req, res) => {
  const goal = String(req.body?.goal || '').trim();
  const interests = req.body?.interests;
  const hasInterests = Array.isArray(interests)
    ? interests.some((item) => String(item || '').trim())
    : String(interests || '').trim();

  if (!goal && !hasInterests) {
    return res.status(400).json({ message: 'Learning goal or interests are required' });
  }

  const result = await recommendLearningResources(req.body);
  res.json(result);
};

export const aiSuggestedCourses = async (req, res) => {
  const currentCourse = req.body?.currentCourse || {};
  const cartCourses = Array.isArray(req.body?.cartCourses) ? req.body.cartCourses : [];
  const excludeCourseIds = [
    currentCourse._id || currentCourse.id,
    ...cartCourses.map((course) => course?._id || course?.id),
  ]
    .map(String)
    .filter(Boolean);

  const cartText = cartCourses
    .map((course) => [course?.title, course?.category, course?.level, ...(course?.skills || [])].filter(Boolean).join(' '))
    .join(' ');

  const goal = req.body?.goal || [
    currentCourse.title,
    currentCourse.category,
    currentCourse.level,
    currentCourse.description,
    cartText,
  ]
    .filter(Boolean)
    .join(' ');

  const result = await recommendLearningResources({
    goal,
    category: req.body?.category || currentCourse.category || '',
    level: req.body?.level || currentCourse.level || '',
    interests: req.body?.interests || [
      ...(currentCourse.tags || []),
      ...(currentCourse.skills || []),
      currentCourse.category,
      cartText,
    ].filter(Boolean),
    budget: req.body?.budget,
    excludeCourseIds,
  });

  res.json({
    ...result,
    message: result.recommendations?.length
      ? 'Suggested courses you may want to buy next, based on what you are viewing or adding to cart.'
      : 'No extra course suggestions found right now.',
  });
};

export const sentimentAnalytics = async (req, res) => {
  const text = String(req.body?.text || '').trim();
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const result = await analyzeSentiment(text);
  res.json(result);
};

export const aiStatus = async (_req, res) => {
  const ocrProviders = [
    process.env.GEMINI_API_KEY ? 'gemini-handwriting' : null,
    'tesseract',
    process.env.OCR_SPACE_API_KEY ? 'ocrspace' : 'ocrspace-demo',
  ].filter(Boolean);

  res.json({
    gemini: isGeminiConfigured(),
    ocr: true,
    ocrProvider: ocrProviders.join('+'),
    model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    ocrModel: process.env.GEMINI_OCR_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  });
};

export const convertToTextPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const text = await extractTextFromFile(file);
    const pdf = await createTextPdfBuffer({
      text,
      sourceName: file.originalname,
    });
    const fileName = getTextPdfFileName(file.originalname);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdf.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdf);
  } catch (err) {
    if (err.status && err.status < 500) {
      console.warn('OCR PDF conversion warning:', err.message);
    } else {
      console.error('OCR PDF conversion error:', err);
    }
    res.status(err.status || 500).json({
      message: err.message || 'Failed to convert file',
    });
  }
};

export const extractText = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const text = await extractTextFromFile(file);
    res.json({
      fileName: file.originalname,
      text,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Failed to extract text',
    });
  }
};
