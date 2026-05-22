import {
  enhanceSearchWithGemini,
  chatWithGemini,
  chatBotWithGemini,
  isGeminiConfigured,
} from './services/geminiService.js';

const sampleCourses = [
  { _id: 'c1', title: 'JavaScript Essentials', category: 'Programming', level: 'Beginner', rating: 4.6, tags: ['javascript', 'web'] },
  { _id: 'c2', title: 'Advanced Node.js', category: 'Programming', level: 'Advanced', rating: 4.8, tags: ['node', 'backend'] },
  { _id: 'c3', title: 'React from Zero', category: 'Programming', level: 'Intermediate', rating: 4.7, tags: ['react', 'frontend'] },
];

async function run() {
  console.log('GEMINI_API_KEY present?', isGeminiConfigured());

  try {
    const res1 = await enhanceSearchWithGemini('learn async javascript', sampleCourses);
    console.log('enhanceSearchWithGemini ->', JSON.stringify(res1, null, 2));
  } catch (e) {
    console.error('enhanceSearchWithGemini error', e.message);
  }

  try {
    const res2 = await chatWithGemini([
      { role: 'user', content: 'Recommend courses to learn backend JS' },
    ], sampleCourses);
    console.log('chatWithGemini ->', JSON.stringify(res2, null, 2));
  } catch (e) {
    console.error('chatWithGemini error', e.message);
  }

  try {
    const res3 = await chatBotWithGemini([
      { role: 'user', content: 'Hi, what should I study next?' },
    ], sampleCourses);
    console.log('chatBotWithGemini ->', res3);
  } catch (e) {
    console.error('chatBotWithGemini error', e.message);
  }
}

run().then(()=>process.exit(0)).catch(()=>process.exit(1));
