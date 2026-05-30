import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaClipboardList } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { aiAPI } from '../../services/api';
import { CheckCircle2, Clock, Loader2, Sparkles, X } from '../../lib/icons';

const FALLBACK_QUESTIONS = [
  {
    question: 'Which strategy is best when you do not know the answer to a multiple-choice question?',
    options: ['Leave it blank immediately', 'Eliminate clearly wrong options first', 'Always choose the longest option', 'Skip all difficult questions'],
    answer: 1,
    explanation: 'Eliminating wrong choices improves your odds and keeps your thinking structured.',
  },
  {
    question: 'What is the main purpose of a mock test?',
    options: ['Memorize answers only', 'Practice under realistic exam conditions', 'Avoid revision', 'Replace all studying'],
    answer: 1,
    explanation: 'Mock tests help measure readiness, timing, and weak areas.',
  },
  {
    question: 'After a mock test, what should you review first?',
    options: ['Only correct answers', 'Only the easiest questions', 'Incorrect and guessed answers', 'The title page'],
    answer: 2,
    explanation: 'Mistakes and guesses reveal the highest-value revision areas.',
  },
];

function buildFallbackQuestions(topic, count) {
  return Array.from({ length: count }, (_, index) => {
    const item = FALLBACK_QUESTIONS[index % FALLBACK_QUESTIONS.length];
    return {
      ...item,
      id: `fallback-${index}-${topic || 'general'}`,
      question: `${item.question} (${topic || 'General practice'})`,
    };
  });
}

function normalizeQuestion(item, index) {
  const question = String(item.question || '');
  return {
    id: `q-${index}-${question.slice(0, 24).replace(/\W+/g, '-')}`,
    question,
    options: Array.isArray(item.options) ? item.options.slice(0, 4).map(String) : [],
    answer: Number(item.answer),
    explanation: String(item.explanation || ''),
  };
}

function formatRemaining(seconds) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0');
  const rest = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

export default function MockTestGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!testStarted || submitted) return undefined;
    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setSubmitted(true);
          setTestStarted(false);
          toast.error('Time is up. Test submitted.');
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [submitted, testStarted]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
  }, [answers, questions, submitted]);

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const currentQuestion = questions[activeQuestion];

  const resetExamState = () => {
    setSubmitted(false);
    setAnswers({});
    setMarked({});
    setActiveQuestion(0);
    setTestStarted(false);
    setRemainingSeconds(duration * 60);
  };

  const generate = async () => {
    const t = topic.trim();
    if (!t) {
      toast.error('Enter a topic');
      return;
    }

    setLoading(true);
    resetExamState();
    try {
      const { data } = await aiAPI.mockTest({ topic: t, difficulty, count });
      const sourceQuestions = Array.isArray(data.questions) ? data.questions : [];
      if (!sourceQuestions.length) throw new Error('Bad question format');

      const normalized = sourceQuestions
        .slice(0, count)
        .map(normalizeQuestion)
        .filter((item) => item.question && item.options.length === 4 && item.answer >= 0 && item.answer < 4);

      setQuestions(normalized.length ? normalized : buildFallbackQuestions(t, count));
    } catch {
      setQuestions(buildFallbackQuestions(t, count));
      toast.error('AI generator unavailable, using practice questions');
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    if (!questions.length) return;
    setAnswers({});
    setMarked({});
    setActiveQuestion(0);
    setSubmitted(false);
    setRemainingSeconds(duration * 60);
    setTestStarted(true);
  };

  const submit = () => {
    if (!questions.length) return;
    setTestStarted(false);
    setSubmitted(true);
  };

  const selectAnswer = (optionIndex) => {
    if (!testStarted || submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  return (
    <FeaturePageShell
      title="Mock Test Generator"
      subtitle="Take a timed exam-style mock test with question navigation, review marking, and instant scoring."
      icon={FaClipboardList}
      wide
    >
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-5">
          <label className="mb-2 block text-sm font-medium text-slate-300">Topic</label>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Data Structures, React Hooks..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
          />

          <label className="mb-2 mt-4 block text-sm font-medium text-slate-300">Difficulty</label>
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            disabled={testStarted}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white focus:border-violet-500 focus:outline-none disabled:opacity-60"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label className="mb-2 mt-4 block text-sm font-medium text-slate-300">Questions</label>
          <input
            type="number"
            min="3"
            max="15"
            value={count}
            disabled={testStarted}
            onChange={(event) => setCount(Math.max(3, Math.min(15, Number(event.target.value) || 5)))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white focus:border-violet-500 focus:outline-none disabled:opacity-60"
          />

          <label className="mb-2 mt-4 block text-sm font-medium text-slate-300">Duration</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white">
            <Clock size={18} className="text-violet-300" />
            <input
              type="number"
              min="5"
              max="120"
              value={duration}
              disabled={testStarted}
              onChange={(event) => setDuration(Math.max(5, Math.min(120, Number(event.target.value) || 10)))}
              className="min-w-0 flex-1 bg-transparent focus:outline-none disabled:opacity-60"
            />
            <span className="text-sm text-slate-400">min</span>
          </div>

          <button type="button" onClick={generate} disabled={loading || testStarted} className="btn-primary mt-5 w-full disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Generate Test
          </button>

          {questions.length > 0 && !testStarted && !submitted && (
            <button type="button" onClick={startTest} className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500">
              Start Real Test
            </button>
          )}
        </aside>

        <section className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{topic || 'Untitled'} Mock Test</p>
              <p className="text-xs capitalize text-slate-500">{difficulty} - {questions.length || count} questions - {duration} minutes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {testStarted && (
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${remainingSeconds < 60 ? 'bg-red-500/10 text-red-300' : 'bg-violet-500/10 text-violet-300'}`}>
                  {formatRemaining(remainingSeconds)}
                </div>
              )}
              {submitted && (
                <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  Score {score}/{questions.length}
                </div>
              )}
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 text-center">
              <FaClipboardList size={42} className="mb-3 text-violet-300" />
              <p className="font-semibold text-white">No test generated yet</p>
              <p className="mt-1 max-w-md text-sm text-slate-400">Choose a topic and generate a mock test to start practicing.</p>
            </div>
          ) : !testStarted && !submitted ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 text-center">
              <Clock size={42} className="mb-3 text-emerald-300" />
              <p className="font-semibold text-white">Test is ready</p>
              <p className="mt-1 max-w-md text-sm text-slate-400">Start exam mode to begin the timer and answer one question at a time.</p>
              <button type="button" onClick={startTest} className="btn-primary mt-5">
                Start Real Test
              </button>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300">
                    Question {activeQuestion + 1} of {questions.length}
                  </span>
                  {testStarted && (
                    <button
                      type="button"
                      onClick={() => setMarked((prev) => ({ ...prev, [activeQuestion]: !prev[activeQuestion] }))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${marked[activeQuestion] ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-800 text-slate-400'}`}
                    >
                      {marked[activeQuestion] ? 'Marked' : 'Mark for review'}
                    </button>
                  )}
                </div>

                <p className="text-lg font-semibold leading-7 text-white">{currentQuestion.question}</p>
                <div className="mt-5 grid gap-3">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected = answers[currentQuestion.id] === optionIndex;
                    const isAnswer = submitted && currentQuestion.answer === optionIndex;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectAnswer(optionIndex)}
                        className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                          isAnswer
                            ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-200'
                            : isSelected
                              ? 'border-violet-500/70 bg-violet-500/10 text-violet-100'
                              : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-violet-500/40'
                        }`}
                      >
                        <span>{option}</span>
                        {isAnswer && <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`mt-5 flex gap-2 rounded-lg p-3 text-sm ${answers[currentQuestion.id] === currentQuestion.answer ? 'bg-emerald-500/10 text-emerald-200' : 'bg-red-500/10 text-red-200'}`}>
                    {answers[currentQuestion.id] === currentQuestion.answer ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <X size={16} className="mt-0.5 shrink-0" />}
                    <p>{currentQuestion.explanation || 'Review this concept before your next attempt.'}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={() => setActiveQuestion((index) => Math.max(index - 1, 0))} disabled={activeQuestion === 0} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 disabled:opacity-40">
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {testStarted && activeQuestion === questions.length - 1 && (
                      <button type="button" onClick={submit} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                        Submit Test
                      </button>
                    )}
                    {activeQuestion < questions.length - 1 && (
                      <button type="button" onClick={() => setActiveQuestion((index) => Math.min(index + 1, questions.length - 1))} className="rounded-xl border border-violet-500/50 px-4 py-2 text-sm font-semibold text-violet-300">
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <aside className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Question palette</p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {questions.map((question, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveQuestion(index)}
                      className={`h-9 rounded-lg text-xs font-bold ${
                        activeQuestion === index
                          ? 'bg-violet-600 text-white'
                          : marked[index]
                            ? 'bg-amber-500/20 text-amber-300'
                            : answers[question.id] !== undefined
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-5 space-y-2 text-sm text-slate-400">
                  <p>Answered: <span className="text-emerald-300">{answeredCount}</span></p>
                  <p>Marked: <span className="text-amber-300">{markedCount}</span></p>
                  <p>Remaining: <span className="text-slate-200">{Math.max(0, questions.length - answeredCount)}</span></p>
                </div>
              </aside>
            </div>
          )}
        </section>
      </div>
    </FeaturePageShell>
  );
}
