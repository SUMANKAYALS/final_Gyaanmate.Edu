import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const QUESTION_BANKS = {
  java: [
    {
      question: 'Which keyword is used to inherit a class in Java?',
      options: ['implements', 'extends', 'inherits', 'instanceof'],
      answer: 1,
      explanation: 'The extends keyword creates an inheritance relationship between classes.',
    },
    {
      question: 'What does a try-catch block do in Java?',
      options: ['Sorts arrays', 'Handles exceptions', 'Creates threads', 'Imports packages'],
      answer: 1,
      explanation: 'A try-catch block catches exceptions thrown while the try block runs.',
    },
    {
      question: 'Which collection stores key-value pairs in Java?',
      options: ['ArrayList', 'HashMap', 'Stack', 'Queue'],
      answer: 1,
      explanation: 'HashMap stores values by unique keys and provides fast lookup.',
    },
    {
      question: 'Which method is the entry point of a Java program?',
      options: ['start()', 'main()', 'run()', 'init()'],
      answer: 1,
      explanation: 'The JVM starts execution from public static void main(String[] args).',
    },
    {
      question: 'What is method overloading?',
      options: ['Same method name with different parameters', 'Replacing a parent method', 'Running two programs', 'Hiding a variable'],
      answer: 0,
      explanation: 'Overloading allows methods with the same name but different parameter lists.',
    },
  ],
  javascript: [
    {
      question: 'Which keyword declares a block-scoped variable in JavaScript?',
      options: ['var', 'let', 'global', 'static'],
      answer: 1,
      explanation: 'let creates a variable scoped to the current block.',
    },
    {
      question: 'What does === check in JavaScript?',
      options: ['Value only', 'Type only', 'Value and type', 'Object length'],
      answer: 2,
      explanation: 'Strict equality compares both value and type without coercion.',
    },
    {
      question: 'Which method converts JSON text into an object?',
      options: ['JSON.parse()', 'JSON.stringify()', 'Object.json()', 'parse.JSON()'],
      answer: 0,
      explanation: 'JSON.parse() reads a JSON string and returns a JavaScript value.',
    },
  ],
  react: [
    {
      question: 'Which hook is used to manage local component state?',
      options: ['useMemo', 'useState', 'useRef', 'useRoute'],
      answer: 1,
      explanation: 'useState stores and updates state inside a React component.',
    },
    {
      question: 'What is JSX?',
      options: ['A database query language', 'HTML-like syntax for React', 'A CSS compiler', 'A server framework'],
      answer: 1,
      explanation: 'JSX lets React components describe UI with HTML-like syntax.',
    },
    {
      question: 'Which hook runs side effects after render?',
      options: ['useEffect', 'useClass', 'useEvent', 'useStyle'],
      answer: 0,
      explanation: 'useEffect is used for effects such as fetching data or syncing with browser APIs.',
    },
  ],
  python: [
    {
      question: 'Which data type stores key-value pairs in Python?',
      options: ['list', 'tuple', 'dict', 'set'],
      answer: 2,
      explanation: 'A dict maps keys to values.',
    },
    {
      question: 'Which keyword defines a function in Python?',
      options: ['func', 'def', 'function', 'lambda'],
      answer: 1,
      explanation: 'Python uses def to define named functions.',
    },
    {
      question: 'What does len() return?',
      options: ['The type of an object', 'The length of a sequence', 'The memory address', 'The rounded number'],
      answer: 1,
      explanation: 'len() returns the number of items in a supported object.',
    },
  ],
  dsa: [
    {
      question: 'Which data structure follows FIFO order?',
      options: ['Stack', 'Queue', 'Tree', 'Graph'],
      answer: 1,
      explanation: 'A queue removes items in first-in, first-out order.',
    },
    {
      question: 'Which data structure follows LIFO order?',
      options: ['Queue', 'Stack', 'Hash Map', 'Heap'],
      answer: 1,
      explanation: 'A stack removes the most recently added item first.',
    },
    {
      question: 'What is the average lookup time for a hash table?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      answer: 0,
      explanation: 'A well-distributed hash table gives average constant-time lookup.',
    },
  ],
};

const GENERAL_QUESTIONS = [
  {
    question: 'Which step should come first when solving a programming problem?',
    options: ['Write random code', 'Understand the requirements', 'Optimize immediately', 'Skip testing'],
    answer: 1,
    explanation: 'Clear requirements prevent wrong assumptions and wasted implementation time.',
  },
  {
    question: 'What is the main purpose of testing?',
    options: ['Make code longer', 'Find and prevent bugs', 'Remove all comments', 'Slow down development'],
    answer: 1,
    explanation: 'Testing checks behavior and helps catch regressions.',
  },
  {
    question: 'What does debugging mean?',
    options: ['Designing a logo', 'Finding and fixing defects', 'Publishing an app', 'Deleting source code'],
    answer: 1,
    explanation: 'Debugging is the process of locating and correcting problems in code.',
  },
];

function getClient() {
  return process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
}

function extractJson(text) {
  const clean = String(text || '').replace(/```(?:json)?|```/g, '').trim();
  const starts = [clean.indexOf('{'), clean.indexOf('[')].filter((index) => index >= 0);
  const start = Math.min(...starts);
  if (!Number.isFinite(start)) throw new Error('No JSON found');

  const open = clean[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < clean.length; i += 1) {
    const ch = clean[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === open) depth += 1;
    if (ch === close) depth -= 1;
    if (depth === 0) return JSON.parse(clean.slice(start, i + 1));
  }

  throw new Error('Incomplete JSON');
}

function normalizeQuestion(item, index, topic) {
  const question = String(item?.question || '').trim();
  const options = Array.isArray(item?.options) ? item.options.slice(0, 4).map((option) => String(option).trim()) : [];
  const answer = Number(item?.answer);
  return {
    id: `ai-${index}-${question.slice(0, 30).replace(/\W+/g, '-').toLowerCase() || topic}`,
    question,
    options,
    answer,
    explanation: String(item?.explanation || '').trim(),
  };
}

function pickBank(topic) {
  const key = String(topic || '').toLowerCase();
  if (key.includes('java') && !key.includes('javascript')) return QUESTION_BANKS.java;
  if (key.includes('javascript') || key.includes('js')) return QUESTION_BANKS.javascript;
  if (key.includes('react')) return QUESTION_BANKS.react;
  if (key.includes('python')) return QUESTION_BANKS.python;
  if (key.includes('data structure') || key.includes('dsa') || key.includes('algorithm')) return QUESTION_BANKS.dsa;
  return GENERAL_QUESTIONS;
}

function buildLocalQuestions(topic, count) {
  const bank = pickBank(topic);
  return Array.from({ length: count }, (_, index) => {
    const item = bank[index % bank.length];
    return {
      ...item,
      id: `local-${index}-${String(topic || 'general').replace(/\W+/g, '-').toLowerCase()}`,
    };
  });
}

export async function generateMockTestQuestions({ topic, difficulty = 'medium', count = 5 }) {
  const safeTopic = String(topic || '').trim();
  const safeCount = Math.max(3, Math.min(15, Number(count) || 5));
  const safeDifficulty = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const client = getClient();

  if (!client) {
    return { provider: 'local', questions: buildLocalQuestions(safeTopic, safeCount) };
  }

  try {
    const response = await client.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.35,
      max_tokens: 1800,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You generate exam-style multiple-choice tests. Return only JSON with a "questions" array. No markdown.',
        },
        {
          role: 'user',
          content: `Create ${safeCount} ${safeDifficulty} multiple-choice questions about "${safeTopic}".
Each item must be:
{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"..."}
The answer must be the zero-based index of the correct option.`,
        },
      ],
    });

    const parsed = extractJson(response.choices?.[0]?.message?.content);
    const rawQuestions = Array.isArray(parsed) ? parsed : parsed.questions;
    const questions = (rawQuestions || [])
      .slice(0, safeCount)
      .map((item, index) => normalizeQuestion(item, index, safeTopic))
      .filter((item) => item.question && item.options.length === 4 && item.answer >= 0 && item.answer < 4);

    if (questions.length) {
      return { provider: 'groq', questions };
    }
  } catch (err) {
    console.warn('Mock test Groq generation failed, using local questions:', err.message);
  }

  return { provider: 'local', questions: buildLocalQuestions(safeTopic, safeCount) };
}
