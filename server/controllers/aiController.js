import { searchCoursesWithAI } from '../services/aiSearchService.js';
import { chatWithGemini, chatBotWithGemini, isGeminiConfigured } from '../services/geminiService.js';

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
    return "Hello! I'm GyaanMate.edu. I can help you discover courses, plan what to learn next, or answer study questions. What would you like to learn?";
  }
  return "I'm GyaanMate.edu! Ask me about any topic — for example: \"React for beginners\", \"best AI courses\", or \"how do I start coding?\". I'll suggest courses from our catalog.";
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

export const aiStatus = async (_req, res) => {
  res.json({
    gemini: isGeminiConfigured(),
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  });
};
