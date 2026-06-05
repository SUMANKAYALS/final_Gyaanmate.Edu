import Groq from 'groq-sdk';

let groq;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not found');
  }
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

export const focusCoach = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        message: 'Prompt is required',
      });
    }

    const completion = await getGroqClient().chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
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
