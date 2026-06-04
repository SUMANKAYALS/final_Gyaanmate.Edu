import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY not found');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

export const focusCoach = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        message: 'Prompt is required',
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    res.json({
      content:
        completion.choices?.[0]?.message?.content ||
        'No response generated.',
    });
  } catch (error) {
    console.error('Focus Coach Error:', error);

    res.status(500).json({
      message: 'Failed to generate AI response',
    });
  }
};