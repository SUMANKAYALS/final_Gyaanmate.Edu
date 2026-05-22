// import { GoogleGenerativeAI } from '@google/generative-ai';

// let model = null;

// function getModel() {
//   const key = process.env.GEMINI_API_KEY;
//   if (!key) return null;
//   if (!model) {
//     const genAI = new GoogleGenerativeAI(key);
//     model = genAI.getGenerativeModel({
//       model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
//       generationConfig: {
//         responseMimeType: 'application/json',
//         temperature: 0.4,
//         maxOutputTokens: 700,
//       },
//     });
//   }
//   return model;
// }

// function delay(ms) {
//   return new Promise((res) => setTimeout(res, ms));
// }

// async function fetchWithRetry(fn, { maxAttempts = 3 } = {}) {
//   let attempt = 0;
//   while (true) {
//     try {
//       return await fn();
//     } catch (err) {
//       attempt += 1;
//       const status = err?.response?.status || err?.status;
//       // Only retry on transient errors: 429 (quota), 503 (service unavailable), or network errors (no status)
//       // Do NOT retry on 400 (bad request, e.g., expired API key), 401 (auth), 403 (forbidden)
//       const retryable = status === 429 || status === 503 || !status;
//       if (!retryable || attempt >= maxAttempts) throw err;

//       const headers = err?.response?.headers || {};
//       const retryAfterRaw = headers['retry-after'] || headers['Retry-After'];
//       let delayMs;
//       if (retryAfterRaw) {
//         const retryAfterSeconds = Number(retryAfterRaw);
//         if (!Number.isNaN(retryAfterSeconds)) {
//           delayMs = Math.max(1000, retryAfterSeconds * 1000);
//         } else {
//           const parsedDate = Date.parse(retryAfterRaw);
//           delayMs = Number.isNaN(parsedDate) ? null : Math.max(1000, parsedDate - Date.now());
//         }
//       }
//       if (!delayMs || delayMs < 1000) {
//         delayMs = Math.min(60000, Math.pow(2, attempt) * 1000 + Math.random() * 1000);
//       }

//       console.warn(`Gemini request failed (attempt ${attempt}) — retrying in ${Math.round(delayMs)}ms`);
//       await delay(delayMs);
//     }
//   }
// }

// // Simple deterministic fallback for when Gemini is unavailable or quota-limited.
// function fallbackForSearch(query, courses) {
//   const q = String(query || '').toLowerCase();
//   const scored = courses.map((c) => {
//     const title = (c.title || '').toLowerCase();
//     const tags = (c.tags || []).join(' ').toLowerCase();
//     let score = 0;
//     if (title.includes(q)) score += 10;
//     const parts = q.split(/\s+/).filter(Boolean);
//     for (const p of parts) {
//       if (title.includes(p)) score += 3;
//       if (tags.includes(p)) score += 2;
//     }
//     score += (c.rating || 0) * 0.1;
//     return { id: String(c._id), score };
//   });
//   scored.sort((a, b) => b.score - a.score);
//   const rankedCourseIds = scored.map((s) => s.id).slice(0, 10);
//   const message = `Sorry, the AI service is temporarily unavailable — here are ${rankedCourseIds.length} recommended courses based on your query.`;
//   return { message, relatedTopics: [], rankedCourseIds };
// }

// const SYSTEM_PROMPT = `You are GyaanMate.edu, a friendly course discovery assistant for a global online learning platform.
// Given a user search query and a list of courses, respond ONLY with valid JSON containing:
// - message: a helpful natural-language reply (2-3 sentences)
// - relatedTopics: array of 3-5 related skills/technologies to explore
// - rankedCourseIds: array of course id strings ordered by relevance (best first)`;

// export async function enhanceSearchWithGemini(query, courses) {
//   const gemini = getModel();
//   if (!gemini) return fallbackForSearch(query, courses);

//   const courseSummary = courses.map((c) => ({
//     id: String(c._id),
//     title: c.title,
//     category: c.category,
//     level: c.level,
//     rating: c.rating,
//     tags: c.tags,
//   }));

//   try {
//     const prompt = `${SYSTEM_PROMPT}\n\nUser query: "${query}"\n\nCourses:\n${JSON.stringify(courseSummary)}`;
//     const result = await fetchWithRetry(() => gemini.generateContent(prompt));
//     return JSON.parse(result.response.text());
//   } catch (err) {
//     console.error('Gemini API error:', err.message);
//     return fallbackForSearch(query, courses);
//   }
// }

// export async function chatWithGemini(messages, courses = []) {
//   const gemini = getModel();
//   if (!gemini) {
//     const fb = fallbackForSearch(messages.map(m=>m.content).join(' '), courses);
//     return {
//       role: 'assistant',
//       content: fb.message,
//       relatedTopics: fb.relatedTopics || [],
//       rankedCourseIds: fb.rankedCourseIds || [],
//     };
//   }

//   const courseSummary = courses.slice(0, 15).map((c) => ({
//     id: String(c._id),
//     title: c.title,
//     category: c.category,
//   }));

//   try {
//     const conversation = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
//     const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversation}\n\nAvailable courses:\n${JSON.stringify(courseSummary)}`;
//     const result = await fetchWithRetry(() => gemini.generateContent(prompt));
//     const parsed = JSON.parse(result.response.text());
//     return {
//       role: 'assistant',
//       content: parsed.message,
//       relatedTopics: parsed.relatedTopics || [],
//       rankedCourseIds: parsed.rankedCourseIds || [],
//     };
//   } catch (err) {
//     console.error('Gemini chat error:', err.message);
//     const fb = fallbackForSearch(messages.map(m=>m.content).join(' '), courses);
//     return {
//       role: 'assistant',
//       content: fb.message,
//       relatedTopics: fb.relatedTopics || [],
//       rankedCourseIds: fb.rankedCourseIds || [],
//     };
//   }
// }

// const BOT_SYSTEM = `You are GyaanMate.edu, a friendly learning assistant on GyaanMate.edu — an online course platform (like Udemy/Coursera).
// Help users with: finding courses, learning paths, study tips, careers, and platform questions.
// Be warm, concise, and helpful. Use short paragraphs or bullet points when listing ideas.
// When course data is provided below, recommend 1–3 real courses from that list only (use exact titles). Never invent course names.
// If the user greets you, welcome them and offer to help find courses or learning advice.`;

// export async function chatBotWithGemini(messages, courses = []) {
//   const key = process.env.GEMINI_API_KEY;
//   if (!key) {
//     const fallbacks = (courses || [])
//       .slice()
//       .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//       .slice(0, 3)
//       .map((c) => `- ${c.title} (${c.category})`)
//       .join('\n');
//     return `AI not configured. Top courses:\n${fallbacks}`;
//   }

//   const courseBlock =
//     courses.length > 0
//       ? `\n\nCourses available on LearnHub right now:\n${courses
//           .map(
//             (c) =>
//               `- "${c.title}" | ${c.category} | ${c.level} | $${c.price} | id:${c._id}`
//           )
//           .join('\n')}`
//       : '';

//   try {
//     const genAI = new GoogleGenerativeAI(key);
//     const model = genAI.getGenerativeModel({
//       model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
//       systemInstruction: BOT_SYSTEM + courseBlock,
//       generationConfig: {
//         temperature: 0.75,
//         maxOutputTokens: 900,
//       },
//     });

//     const valid = (messages || []).filter((m) => m.role === 'user' || m.role === 'assistant');
//     if (!valid.length) return null;

//     const history = valid.slice(0, -1).map((m) => ({
//       role: m.role === 'user' ? 'user' : 'model',
//       parts: [{ text: m.content }],
//     }));

//     const last = valid[valid.length - 1];
//     if (last.role !== 'user') return null;

//     const chat = model.startChat({ history });
//     const result = await fetchWithRetry(() => chat.sendMessage(last.content));
//     return result.response.text();
//   } catch (err) {
//     console.error('Gemini bot error:', err.message);
//     // graceful fallback: return a short text recommending top-rated courses
//     const fallbacks = (courses || [])
//       .slice()
//       .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//       .slice(0, 3)
//       .map((c) => `- ${c.title} (${c.category})`)
//       .join('\n');
//     return `Sorry, the AI service is currently unavailable. Meanwhile, here are some top courses:\n${fallbacks}`;
//   }
// }

// export function isGeminiConfigured() {
//   return Boolean(process.env.GEMINI_API_KEY);
// }




// import { GoogleGenerativeAI } from '@google/generative-ai';

// let model = null;

// function getModel() {
//   const key = process.env.GEMINI_API_KEY;
//   if (!key) return null;
//   if (!model) {
//     const genAI = new GoogleGenerativeAI(key);
//     model = genAI.getGenerativeModel({
//       model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
//       generationConfig: {
//         responseMimeType: 'application/json',
//         temperature: 0.4,
//         maxOutputTokens: 700,
//       },
//     });
//   }
//   return model;
// }

// function delay(ms) {
//   return new Promise((res) => setTimeout(res, ms));
// }

// async function fetchWithRetry(fn, { maxAttempts = 3 } = {}) {
//   let attempt = 0;
//   while (true) {
//     try {
//       return await fn();
//     } catch (err) {
//       attempt += 1;
//       const status = err?.response?.status || err?.status;
//       // Only retry on transient errors: 429 (quota), 503 (service unavailable), or network errors (no status)
//       // Do NOT retry on 400 (bad request, e.g., expired API key), 401 (auth), 403 (forbidden)
//       const retryable = status === 429 || status === 503 || !status;
//       if (!retryable || attempt >= maxAttempts) throw err;

//       const headers = err?.response?.headers || {};
//       const retryAfterRaw = headers['retry-after'] || headers['Retry-After'];
//       let delayMs;
//       if (retryAfterRaw) {
//         const retryAfterSeconds = Number(retryAfterRaw);
//         if (!Number.isNaN(retryAfterSeconds)) {
//           delayMs = Math.max(1000, retryAfterSeconds * 1000);
//         } else {
//           const parsedDate = Date.parse(retryAfterRaw);
//           delayMs = Number.isNaN(parsedDate) ? null : Math.max(1000, parsedDate - Date.now());
//         }
//       }
//       if (!delayMs || delayMs < 1000) {
//         delayMs = Math.min(60000, Math.pow(2, attempt) * 1000 + Math.random() * 1000);
//       }

//       console.warn(`Gemini request failed (attempt ${attempt}) — retrying in ${Math.round(delayMs)}ms`);
//       await delay(delayMs);
//     }
//   }
// }

// // Simple deterministic fallback for when Gemini is unavailable or quota-limited.
// function fallbackForSearch(query, courses) {
//   const q = String(query || '').toLowerCase();
//   const scored = courses.map((c) => {
//     const title = (c.title || '').toLowerCase();
//     const tags = (c.tags || []).join(' ').toLowerCase();
//     let score = 0;
//     if (title.includes(q)) score += 10;
//     const parts = q.split(/\s+/).filter(Boolean);
//     for (const p of parts) {
//       if (title.includes(p)) score += 3;
//       if (tags.includes(p)) score += 2;
//     }
//     score += (c.rating || 0) * 0.1;
//     return { id: String(c._id), score };
//   });
//   scored.sort((a, b) => b.score - a.score);
//   const rankedCourseIds = scored.map((s) => s.id).slice(0, 10);
//   const message = `Sorry, the AI service is temporarily unavailable — here are ${rankedCourseIds.length} recommended courses based on your query.`;
//   return { message, relatedTopics: [], rankedCourseIds };
// }

// const SYSTEM_PROMPT = `You are GyaanMate.edu, a friendly course discovery assistant for a global online learning platform.
// Given a user search query and a list of courses, respond ONLY with valid JSON containing:
// - message: a helpful natural-language reply (2-3 sentences)
// - relatedTopics: array of 3-5 related skills/technologies to explore
// - rankedCourseIds: array of course id strings ordered by relevance (best first)`;

// export async function enhanceSearchWithGemini(query, courses) {
//   const gemini = getModel();
//   if (!gemini) return fallbackForSearch(query, courses);

//   const courseSummary = courses.map((c) => ({
//     id: String(c._id),
//     title: c.title,
//     category: c.category,
//     level: c.level,
//     rating: c.rating,
//     tags: c.tags,
//   }));

//   try {
//     const prompt = `${SYSTEM_PROMPT}\n\nUser query: "${query}"\n\nCourses:\n${JSON.stringify(courseSummary)}`;
//     const result = await fetchWithRetry(() => gemini.generateContent(prompt));
//     return JSON.parse(result.response.text());
//   } catch (err) {
//     console.error('Gemini API error:', err.message);
//     return fallbackForSearch(query, courses);
//   }
// }

// export async function chatWithGemini(messages, courses = []) {
//   const gemini = getModel();
//   if (!gemini) {
//     const fb = fallbackForSearch(messages.map(m=>m.content).join(' '), courses);
//     return {
//       role: 'assistant',
//       content: fb.message,
//       relatedTopics: fb.relatedTopics || [],
//       rankedCourseIds: fb.rankedCourseIds || [],
//     };
//   }

//   const courseSummary = courses.slice(0, 15).map((c) => ({
//     id: String(c._id),
//     title: c.title,
//     category: c.category,
//   }));

//   try {
//     const conversation = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
//     const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversation}\n\nAvailable courses:\n${JSON.stringify(courseSummary)}`;
//     const result = await fetchWithRetry(() => gemini.generateContent(prompt));
//     const parsed = JSON.parse(result.response.text());
//     return {
//       role: 'assistant',
//       content: parsed.message,
//       relatedTopics: parsed.relatedTopics || [],
//       rankedCourseIds: parsed.rankedCourseIds || [],
//     };
//   } catch (err) {
//     console.error('Gemini chat error:', err.message);
//     const fb = fallbackForSearch(messages.map(m=>m.content).join(' '), courses);
//     return {
//       role: 'assistant',
//       content: fb.message,
//       relatedTopics: fb.relatedTopics || [],
//       rankedCourseIds: fb.rankedCourseIds || [],
//     };
//   }
// }

// const BOT_SYSTEM = `You are GyaanMate.edu, a friendly learning assistant on GyaanMate.edu — an online course platform (like Udemy/Coursera).
// Help users with: finding courses, learning paths, study tips, careers, and platform questions.
// Be warm, concise, and helpful. Use short paragraphs or bullet points when listing ideas.
// When course data is provided below, recommend 1–3 real courses from that list only (use exact titles). Never invent course names.
// If the user greets you, welcome them and offer to help find courses or learning advice.`;

// export async function chatBotWithGemini(messages, courses = []) {
//   const key = process.env.GEMINI_API_KEY;
//   if (!key) {
//     const fallbacks = (courses || [])
//       .slice()
//       .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//       .slice(0, 3)
//       .map((c) => `- ${c.title} (${c.category})`)
//       .join('\n');
//     return `AI not configured. Top courses:\n${fallbacks}`;
//   }

//   const courseBlock =
//     courses.length > 0
//       ? `\n\nCourses available on LearnHub right now:\n${courses
//           .map(
//             (c) =>
//               `- "${c.title}" | ${c.category} | ${c.level} | $${c.price} | id:${c._id}`
//           )
//           .join('\n')}`
//       : '';

//   try {
//     const genAI = new GoogleGenerativeAI(key);
//     const model = genAI.getGenerativeModel({
//       model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
//       systemInstruction: BOT_SYSTEM + courseBlock,
//       generationConfig: {
//         temperature: 0.75,
//         maxOutputTokens: 900,
//       },
//     });

//     const valid = (messages || []).filter((m) => m.role === 'user' || m.role === 'assistant');
//     if (!valid.length) return null;

//     const history = valid.slice(0, -1).map((m) => ({
//       role: m.role === 'user' ? 'user' : 'model',
//       parts: [{ text: m.content }],
//     }));

//     const last = valid[valid.length - 1];
//     if (last.role !== 'user') return null;

//     const chat = model.startChat({ history });
//     const result = await fetchWithRetry(() => chat.sendMessage(last.content));
//     return result.response.text();
//   } catch (err) {
//     console.error('Gemini bot error:', err.message);
//     // graceful fallback: return a short text recommending top-rated courses
//     const fallbacks = (courses || [])
//       .slice()
//       .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//       .slice(0, 3)
//       .map((c) => `- ${c.title} (${c.category})`)
//       .join('\n');
//     return `Sorry, the AI service is currently unavailable. Meanwhile, here are some top courses:\n${fallbacks}`;
//   }
// }

// export function isGeminiConfigured() {
//   return Boolean(process.env.GEMINI_API_KEY);
// }




import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'; // free & fast

function getClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return new Groq({ apiKey: key });
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithRetry(fn, { maxAttempts = 3 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      const status = err?.status || err?.response?.status;
      const message = err?.message || '';
      
      // Retry on: 429 (rate limit), 503 (service unavailable), 502 (bad gateway), or network errors
      // Also retry on "overloaded" or "temporarily unavailable" messages
      const isOverloaded = message.toLowerCase().includes('overloaded') || 
                         message.toLowerCase().includes('temporarily unavailable') ||
                         message.toLowerCase().includes('currently unavailable');
      const retryable = status === 429 || status === 503 || status === 502 || !status || isOverloaded;
      
      if (!retryable || attempt >= maxAttempts) {
        console.error(`Groq API failed after ${attempt} attempts:`, message);
        throw err;
      }

      // Exponential backoff with jitter
      const delayMs = Math.min(60000, Math.pow(2, attempt) * 1000 + Math.random() * 1000);
      console.warn(`Groq request failed (attempt ${attempt}/${maxAttempts}) — retrying in ${Math.round(delayMs)}ms: ${message}`);
      await delay(delayMs);
    }
  }
}

// Deterministic fallback (no API needed)
function fallbackForSearch(query, courses) {
  const q = String(query || '').toLowerCase();
  const scored = courses.map((c) => {
    const title = (c.title || '').toLowerCase();
    const tags  = (c.tags  || []).join(' ').toLowerCase();
    let score = 0;
    if (title.includes(q)) score += 10;
    for (const part of q.split(/\s+/).filter(Boolean)) {
      if (title.includes(part)) score += 3;
      if (tags.includes(part))  score += 2;
    }
    score += (c.rating || 0) * 0.1;
    return { id: String(c._id), score };
  });
  scored.sort((a, b) => b.score - a.score);
  const rankedCourseIds = scored.map((s) => s.id).slice(0, 10);
  const message = `Sorry, the AI service is temporarily unavailable — here are ${rankedCourseIds.length} recommended courses based on your query.`;
  return { message, relatedTopics: [], rankedCourseIds };
}

const SEARCH_SYSTEM = `You are gyaanmate.edu, a friendly course discovery assistant for a global online learning platform.
Given a user search query and a list of courses, respond ONLY with valid JSON (no markdown fences) containing:
- message: a helpful natural-language reply (2-3 sentences)
- relatedTopics: array of 3-5 related skills/technologies to explore
- rankedCourseIds: array of course id strings ordered by relevance (best first)`;

const BOT_SYSTEM = `You are gyaanmate.edu, a friendly learning assistant on gyaanmate.edu — an online course platform (like Udemy/Coursera).
Help users with: finding courses, learning paths, study tips, careers, and platform questions.
Be warm, concise, and helpful. Use short paragraphs or bullet points when listing ideas.
When course data is provided below, recommend 1-3 real courses from that list only (use exact titles). Never invent course names.
If the user greets you, welcome them and offer to help find courses or learning advice.`;

export async function enhanceSearchWithGemini(query, courses) {
  const client = getClient();
  if (!client) return fallbackForSearch(query, courses);

  const courseSummary = courses.map((c) => ({
    id: String(c._id), title: c.title, category: c.category,
    level: c.level, rating: c.rating, tags: c.tags,
  }));

  try {
    const response = await fetchWithRetry(() => client.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SEARCH_SYSTEM },
        { role: 'user', content: `User query: "${query}"\n\nCourses:\n${JSON.stringify(courseSummary)}` },
      ],
    }));

    const text = response.choices[0].message.content;
    const clean = text.replace(/```(?:json)?|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('Groq API error after retries:', err.message);
    return fallbackForSearch(query, courses);
  }
}

export async function chatWithGemini(messages, courses = []) {
  const client = getClient();
  if (!client) {
    const fb = fallbackForSearch(messages.map((m) => m.content).join(' '), courses);
    return { role: 'assistant', content: fb.message, relatedTopics: fb.relatedTopics || [], rankedCourseIds: fb.rankedCourseIds || [] };
  }

  const courseSummary = courses.slice(0, 15).map((c) => ({
    id: String(c._id), title: c.title, category: c.category,
  }));

  try {
    const conversation = messages.map((m) => `${m.role}: ${m.content}`).join('\n');

    const response = await fetchWithRetry(() => client.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SEARCH_SYSTEM },
        { role: 'user', content: `Conversation:\n${conversation}\n\nAvailable courses:\n${JSON.stringify(courseSummary)}` },
      ],
    }));

    const text = response.choices[0].message.content;
    const clean = text.replace(/```(?:json)?|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      role: 'assistant', content: parsed.message,
      relatedTopics: parsed.relatedTopics || [], rankedCourseIds: parsed.rankedCourseIds || [],
    };
  } catch (err) {
    console.error('Groq chat error after retries:', err.message);
    const fb = fallbackForSearch(messages.map((m) => m.content).join(' '), courses);
    return { role: 'assistant', content: fb.message, relatedTopics: fb.relatedTopics || [], rankedCourseIds: fb.rankedCourseIds || [] };
  }
}

export async function chatBotWithGemini(messages, courses = []) {
  const client = getClient();
  if (!client) {
    const fallbacks = (courses || []).slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3).map((c) => `- ${c.title} (${c.category})`).join('\n');
    return `AI not configured. Top courses:\n${fallbacks}`;
  }

  const courseBlock = courses.length > 0
    ? `\n\nCourses available on LearnHub right now:\n${courses
        .map((c) => `- "${c.title}" | ${c.category} | ${c.level} | $${c.price} | id:${c._id}`)
        .join('\n')}`
    : '';

  const valid = (messages || []).filter((m) => m.role === 'user' || m.role === 'assistant');
  if (!valid.length) return null;
  const last = valid[valid.length - 1];
  if (last.role !== 'user') return null;

  // Build proper multi-turn history for Groq
  const history = valid.map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }));

  try {
    const response = await fetchWithRetry(() => client.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 900,
      messages: [
        { role: 'system', content: BOT_SYSTEM + courseBlock },
        ...history,
      ],
    }));

    return response.choices[0].message.content;
  } catch (err) {
    console.error('Groq bot error after retries:', err.message);
    const fallbacks = (courses || []).slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3).map((c) => `- ${c.title} (${c.category})`).join('\n');
    return `Sorry, the AI service is currently unavailable. Meanwhile, here are some top courses:\n${fallbacks}`;
  }
}

export function isGeminiConfigured() {
  return Boolean(process.env.GROQ_API_KEY);
}