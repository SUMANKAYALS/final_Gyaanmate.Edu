

// cspell:disable
import { useState, useEffect, useRef, useCallback } from 'react';
import { FaBullseye } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { aiAPI } from '../../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const QUOTES = [
  {
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    theme: 'momentum',
  },
  {
    text: 'Focus is the art of knowing what to ignore.',
    author: 'Anonymous',
    theme: 'focus',
  },
  {
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: 'Albert Einstein',
    theme: 'persistence',
  },
  {
    text: 'Deep work is the superpower of the 21st century.',
    author: 'Cal Newport',
    theme: 'focus',
  },
  {
    text: "You don't rise to the level of your goals. You fall to the level of your systems.",
    author: 'James Clear',
    theme: 'systems',
  },
  {
    text: 'Concentrate all your thoughts upon the work in hand.',
    author: 'Nikola Tesla',
    theme: 'focus',
  },
  {
    text: 'The more you sweat in practice, the less you bleed in battle.',
    author: 'Richard Marcinko',
    theme: 'persistence',
  },
  {
    text: 'An investment in knowledge pays the best interest.',
    author: 'Benjamin Franklin',
    theme: 'learning',
  },
];

// Resonance options shown in the quote test
const RESONANCE_OPTIONS = [
  { emoji: '🔥', label: 'Totally fired up!', bonus: 10, value: 4 },
  { emoji: '😊', label: 'Yeah, this hits', bonus: 5, value: 3 },
  { emoji: '😐', label: 'It is what it is', bonus: 2, value: 2 },
  { emoji: '🥱', label: 'Not really my vibe', bonus: 0, value: 1 },
];

const STORAGE_KEY = 'gyaanmate_focus_history';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
  } catch { }
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function AIContent({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm leading-relaxed text-slate-300">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const headingMatch = line.match(/^#{1,3}\s+(.+)/) || line.match(/^\*\*(.+)\*\*$/);
        if (headingMatch) {
          return (
            <p key={i} className="font-semibold text-violet-300 mt-3">
              {headingMatch[1]}
            </p>
          );
        }
        if (/^[-*•]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())) {
          const content = line.replace(/^[-*•\d.]\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400" />
              <span>{content}</span>
            </div>
          );
        }
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="text-white font-semibold">{part}</strong>
              ) : (
                part
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── AI Card ──────────────────────────────────────────────────────────────────
function AICard({ title, emoji, content, loading, error, accent = 'violet' }) {
  const colors = {
    violet: {
      border: 'border-violet-500/30',
      bg: 'bg-violet-500/5',
      header: 'text-violet-300',
      badge: 'bg-violet-500/20 text-violet-300',
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      header: 'text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300',
    },
  };
  const c = colors[accent] || colors.violet;
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 text-left`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{emoji}</span>
        <h3 className={`font-semibold text-base ${c.header}`}>{title}</h3>
        {loading && (
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${c.badge} animate-pulse`}>
            Generating…
          </span>
        )}
      </div>
      {loading && (
        <div className="space-y-2">
          {[80, 60, 72, 55].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-slate-700 animate-pulse"
              style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      )}
      {error && !loading && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && content && <AIContent text={content} />}
    </div>
  );
}

// ─── Quote Resonance Test ─────────────────────────────────────────────────────
// Shows before a session starts; user picks how much the quote resonates.
// The chosen bonus is added to their starting focus score.
function QuoteResonanceTest({ quote, onDone }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    // Short delay so the user sees the confirmation flash, then continue
    setTimeout(() => onDone(selected.bonus), 900);
  };

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">💬</span>
        <h3 className="font-semibold text-violet-300 text-base">Quote of the Session</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
          Quick check-in
        </span>
      </div>

      {/* Quote */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-4 text-center">
        <p className="text-sm text-slate-200 italic leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="mt-2 text-xs text-slate-500">— {quote.author}</p>
      </div>

      {/* Question */}
      <p className="text-sm text-slate-400 text-center">
        How much does this resonate with you right now?
      </p>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {RESONANCE_OPTIONS.map((opt) => {
          const isSelected = selected?.value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt)}
              disabled={confirmed}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-left transition disabled:opacity-60 ${isSelected
                ? 'border-violet-500 bg-violet-500/20 text-violet-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
            >
              <span className="text-base">{opt.emoji}</span>
              <span className="leading-tight">{opt.label}</span>
              {isSelected && opt.bonus > 0 && (
                <span className="ml-auto text-xs text-emerald-400 font-semibold">
                  +{opt.bonus}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!selected || confirmed}
        className="w-full btn-primary disabled:opacity-40"
      >
        {confirmed
          ? selected?.bonus > 0
            ? `🎉 +${selected.bonus} bonus points! Starting…`
            : '✓ Got it! Starting…'
          : 'Continue to session →'}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FocusAssistance() {
  // Timer
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  // Goal & score
  const [goal, setGoal] = useState('');
  const [focusScore, setFocusScore] = useState(100);

  // Quote — pick once, persist for the page lifetime
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  );

  // Quote test flow:
  //   'idle'     → user hasn't clicked Start yet (show normal Start button)
  //   'testing'  → quote resonance card is shown
  //   'done'     → quote test completed, session can run
  const [quoteTestState, setQuoteTestState] = useState('idle');

  // Warning
  const [warning, setWarning] = useState('');
  const warningTimer = useRef(null);

  // AI states
  const [studyPlan, setStudyPlan] = useState('');
  const [studyPlanLoading, setStudyPlanLoading] = useState(false);
  const [studyPlanError, setStudyPlanError] = useState('');

  const [sessionReview, setSessionReview] = useState('');
  const [sessionReviewLoading, setSessionReviewLoading] = useState(false);
  const [sessionReviewError, setSessionReviewError] = useState('');

  // Session history
  const [history, setHistory] = useState(loadHistory);

  // Refs
  const mouseMoveStreak = useRef(0);
  const lastMouseMove = useRef(0);
  const focusScoreRef = useRef(100);
  const runningRef = useRef(false);

  useEffect(() => { focusScoreRef.current = focusScore; }, [focusScore]);
  useEffect(() => { runningRef.current = running; }, [running]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showWarning = useCallback((msg) => {
    setWarning(msg);
    clearTimeout(warningTimer.current);
    warningTimer.current = window.setTimeout(() => setWarning(''), 6000);
  }, []);

  const penaliseScore = useCallback(
    (amount, reason) => {
      setFocusScore((prev) => {
        const next = Math.max(0, prev - amount);
        focusScoreRef.current = next;
        return next;
      });
      showWarning(reason);
    },
    [showWarning],
  );

  // ── Notification permission ───────────────────────────────────────────────
  useEffect(() => { requestNotificationPermission(); }, []);

  // ── AI: study plan ────────────────────────────────────────────────────────
  const generateStudyPlan = useCallback(async (topic, durationMin) => {
    if (!topic.trim()) return;
    setStudyPlanLoading(true);
    setStudyPlanError('');
    setStudyPlan('');
    try {
      const prompt = `You are an expert study coach. Create a focused study plan for the following session.

Study Topic: ${topic}
Session Duration: ${durationMin} minutes

Provide a structured study plan with:
1. **Learning Objectives** – 2-3 clear goals for this session
2. **Step-by-Step Roadmap** – Break the ${durationMin} minutes into timed segments
3. **Key Concepts to Cover** – Bullet list of the most important points
4. **Practice Task** – One hands-on exercise to do during the session

Keep it concise, actionable, and motivating. Format with clear headings and bullets.`;

      // const res = await aiAPI.bot([{ role: 'user', content: prompt }]);
      const res = await aiAPI.focusCoach(prompt);
      const body = res?.data;
      // const text =
      //   body?.message || body?.reply || body?.response ||
      //   body?.content || body?.text ||
      //   (typeof body === 'string' ? body : '');
      const text = res?.data?.content || '';
      setStudyPlan(text || 'Study plan generated. Good luck!');
    } catch {
      setStudyPlanError('Could not generate study plan. Please try again.');
    } finally {
      setStudyPlanLoading(false);
    }
  }, []);

  // ── AI: session review ────────────────────────────────────────────────────
  const generateSessionReview = useCallback(async (topic, durationMin, score) => {
    setSessionReviewLoading(true);
    setSessionReviewError('');
    setSessionReview('');
    try {
      const prompt = `You are an expert study coach. The student just completed a ${durationMin}-minute focus session on "${topic || 'General Study'}" with a focus score of ${score}/100.

Generate a helpful session review with:
1. **Session Summary** – 2-3 sentence recap of what was likely covered
2. **5 Revision Questions** – Questions to test understanding of the topic
3. **Next Topic Recommendation** – What to study next and why

Keep it encouraging, specific, and actionable. Format with clear headings and numbered lists.`;

      // const res = await aiAPI.bot([{ role: 'user', content: prompt }]);
      // const body = res?.data;
      // const text =
      //   body?.message || body?.reply || body?.response ||
      //   body?.content || body?.text ||
      //   (typeof body === 'string' ? body : '');

      const res = await aiAPI.focusCoach(prompt);
      const text = res?.data?.content || '';
      setSessionReview(text || 'Great session! Review your notes and rest well.');
    } catch {
      setSessionReviewError('Could not generate session review. Please try again.');
    } finally {
      setSessionReviewLoading(false);
    }
  }, []);

  // ── Timer tick ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running || secondsLeft <= 0) return undefined;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, secondsLeft]);

  // ── Session complete ──────────────────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false);
      runningRef.current = false;

      const entry = {
        id: Date.now(),
        topic: goal || 'General Study',
        duration: minutes,
        score: focusScoreRef.current,
        date: new Date().toLocaleDateString(),
      };
      const updated = [entry, ...loadHistory()];
      saveHistory(updated);
      setHistory(updated);

      sendNotification(
        '🎯 Session Complete!',
        `You finished a ${minutes}-minute session on "${entry.topic}" with a focus score of ${entry.score}.`,
      );
      generateSessionReview(goal, minutes, focusScoreRef.current);
      // Reset quote test so next session shows the check-in again
      setQuoteTestState('idle');
    }
  }, [secondsLeft, running, goal, minutes, generateSessionReview]);

  // ── Focus-loss detection (penalty only) ──────────────────────────────────
  useEffect(() => {
    if (!running) return undefined;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && runningRef.current) {
        penaliseScore(10, '⚠️ Tab switched — focus score reduced by 10.');
      }
    };
    const handleWindowBlur = () => {
      if (runningRef.current) {
        penaliseScore(10, '⚠️ Window lost focus — focus score reduced by 10.');
      }
    };
    const handleMouseMove = () => {
      if (!runningRef.current) return;
      const now = Date.now();
      if (now - lastMouseMove.current < 500) {
        mouseMoveStreak.current += 1;
      } else {
        mouseMoveStreak.current = 0;
      }
      lastMouseMove.current = now;
      if (mouseMoveStreak.current >= 12) {
        penaliseScore(5, '⚠️ Excessive mouse activity — focus score reduced by 5.');
        mouseMoveStreak.current = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [running, penaliseScore]);

  // ── Start flow ────────────────────────────────────────────────────────────
  // Step 1: clicking "Start Focus" triggers the quote test
  const handleStartClick = () => {
    setQuoteTestState('testing');
    // Reset any leftover review/plan from previous session
    setSessionReview('');
    setSessionReviewError('');
  };

  // Step 2: user completes quote test → actually start the session
  const handleQuoteTestDone = (bonus) => {
    const startingScore = Math.min(100, 100 + bonus);
    setFocusScore(startingScore);
    focusScoreRef.current = startingScore;
    setSecondsLeft(minutes * 60);
    setRunning(true);
    runningRef.current = true;
    setWarning('');
    setQuoteTestState('done');
    generateStudyPlan(goal, minutes);
  };

  // Restart mid-session: go back to quote test
  const handleRestart = () => {
    setRunning(false);
    runningRef.current = false;
    setQuoteTestState('testing');
    setStudyPlan('');
    setStudyPlanError('');
    setSessionReview('');
    setSessionReviewError('');
  };

  const pause = () => {
    setRunning(false);
    runningRef.current = false;
  };

  // ── Derived display ───────────────────────────────────────────────────────
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const progress = 1 - secondsLeft / (minutes * 60);
  const circumference = 2 * Math.PI * 54;

  const scoreColor =
    focusScore >= 80 ? 'text-emerald-400' :
      focusScore >= 50 ? 'text-amber-400' : 'text-red-400';

  const scoreBg =
    focusScore >= 80 ? 'bg-emerald-500/20 border-emerald-500/40' :
      focusScore >= 50 ? 'bg-amber-500/20 border-amber-500/40' :
        'bg-red-500/20 border-red-500/40';

  return (
    <FeaturePageShell
      title="Focus Assistance"
      subtitle="AI-powered Pomodoro sessions with personalised study plans."
      icon={FaBullseye}
    >
      <div className="max-w-2xl mx-auto space-y-6 pb-10">

        {/* ── Goal Input ─────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            📚 What are you studying today?
          </label>
          <input
            type="text"
            value={goal}
            disabled={running || quoteTestState === 'testing'}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Integration by Parts, React Hooks, World War II…"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition"
          />
        </div>

        {/* ── Quote Resonance Test (shown when user clicks Start) ─────────── */}
        {quoteTestState === 'testing' && (
          <QuoteResonanceTest
            quote={quote}
            onDone={handleQuoteTestDone}
          />
        )}

        {/* ── AI Study Plan ───────────────────────────────────────────────── */}
        {(studyPlanLoading || studyPlan || studyPlanError) && (
          <AICard
            title="AI Study Plan"
            emoji="🧠"
            content={studyPlan}
            loading={studyPlanLoading}
            error={studyPlanError}
            accent="violet"
          />
        )}

        {/* ── Timer Card ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 text-center space-y-6">

          {/* Circular progress + time */}
          <div className="flex justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke={running ? '#8b5cf6' : '#475569'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-mono font-bold text-white tabular-nums">
                  {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Focus Score */}
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${scoreBg} ${scoreColor}`}
          >
            <span>🎯 Focus Score:</span>
            <span>{focusScore} / 100</span>
          </div>

          {/* Duration Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[15, 25, 45].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => { setMinutes(n); setSecondsLeft(n * 60); setRunning(false); }}
                disabled={running || quoteTestState === 'testing'}
                className={`px-3 py-1.5 rounded-xl text-xs border transition disabled:opacity-50 ${minutes === n
                  ? 'border-violet-500 bg-violet-500/20 text-violet-200'
                  : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
              >
                {n} min
              </button>
            ))}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-1.5">
              <span className="text-xs text-slate-400">Custom:</span>
              <input
                type="number"
                min="1"
                max="120"
                value={minutes}
                disabled={running || quoteTestState === 'testing'}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(120, Number(e.target.value) || 1));
                  setMinutes(v);
                  setSecondsLeft(v * 60);
                }}
                className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right text-xs text-white focus:outline-none"
              />
              <span className="text-xs text-slate-400">min</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {/* Only show Start when idle (not testing, not running) */}
            {!running && quoteTestState !== 'testing' && (
              <button
                type="button"
                onClick={handleStartClick}
                className="btn-primary"
              >
                ▶ Start Focus
              </button>
            )}
            {running && (
              <>
                <button type="button" onClick={handleRestart} className="btn-primary">
                  ↺ Restart
                </button>
                <button type="button" onClick={pause} className="btn-ghost">
                  ⏸ Pause
                </button>
              </>
            )}
            {/* Paused mid-session (quoteTestState = 'done', not running) */}
            {!running && quoteTestState === 'done' && (
              <>
                <button
                  type="button"
                  onClick={() => setRunning(true)}
                  className="btn-primary"
                >
                  ▶ Resume
                </button>
                <button type="button" onClick={handleRestart} className="btn-ghost">
                  ↺ Restart
                </button>
              </>
            )}
          </div>

          {/* Active session notice */}
          {running && (
            <p className="text-xs text-amber-300/80">
              ⏱ Session active — tab switches and window blur will reduce your focus score.
            </p>
          )}

          {/* Warning */}
          {warning && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {warning}
            </div>
          )}
        </div>

        {/* ── AI Session Review ───────────────────────────────────────────── */}
        {(sessionReviewLoading || sessionReview || sessionReviewError) && (
          <AICard
            title="AI Session Review"
            emoji="📝"
            content={sessionReview}
            loading={sessionReviewLoading}
            error={sessionReviewError}
            accent="emerald"
          />
        )}

        {/* ── Session History ─────────────────────────────────────────────── */}
        {history.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">📅 Session History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((entry) => {
                const sc = entry.score ?? 100;
                const dot = sc >= 80 ? 'bg-emerald-400' : sc >= 50 ? 'bg-amber-400' : 'bg-red-400';
                const label = sc >= 80 ? 'text-emerald-400' : sc >= 50 ? 'text-amber-400' : 'text-red-400';
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
                      <div>
                        <p className="text-white font-medium truncate max-w-[180px]">
                          {entry.topic}
                        </p>
                        <p className="text-xs text-slate-500">{entry.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-slate-400 text-xs">{entry.duration} min</p>
                      <p className={`text-xs font-semibold ${label}`}>Score: {sc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => { saveHistory([]); setHistory([]); }}
              className="text-xs text-slate-500 hover:text-red-400 transition"
            >
              Clear history
            </button>
          </div>
        )}

      </div>
    </FeaturePageShell>
  );
}














// import { useState, useEffect, useRef } from 'react';
// import toast from 'react-hot-toast';
// import { FaBullseye } from 'react-icons/fa';
// import FeaturePageShell from '../../components/features/FeaturePageShell';

// export default function FocusAssistance() {
//   const [minutes, setMinutes] = useState(25);
//   const [secondsLeft, setSecondsLeft] = useState(25 * 60);
//   const [running, setRunning] = useState(false);
//   const [warning, setWarning] = useState('');
//   const warningTimer = useRef(null);
//   const lastMouseMove = useRef(0);
//   const mouseMoveStreak = useRef(0);
//   const lastHiddenAt = useRef(0);
//   const tabSwitchCount = useRef(0);

//   const showWarning = (message) => {
//     setWarning(message);
//     clearTimeout(warningTimer.current);
//     warningTimer.current = window.setTimeout(() => setWarning(''), 5000);
//   };

//   const stopFocusMode = (message) => {
//     setRunning(false);
//     setWarning(message);
//     clearTimeout(warningTimer.current);
//     warningTimer.current = window.setTimeout(() => setWarning(''), 5000);
//   };

//   useEffect(() => {
//     if (!running || secondsLeft <= 0) return undefined;

//     const handleBeforeUnload = (event) => {
//       stopFocusMode('Focus mode stopped because you attempted to close or reload the window.');
//       event.preventDefault();
//       event.returnValue = '';
//       return '';
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden') {
//         stopFocusMode('Focus mode stopped because you switched tabs.');
//       }
//     };

//     const handleWindowBlur = () => {
//       if (running) {
//         stopFocusMode('Focus mode stopped because you switched away from the window.');
//       }
//     };

//     const handleMouseMove = () => {
//       if (!running) return;
//       const now = Date.now();
//       if (now - lastMouseMove.current < 500) {
//         mouseMoveStreak.current += 1;
//       } else {
//         mouseMoveStreak.current = 0;
//       }
//       lastMouseMove.current = now;

//       if (mouseMoveStreak.current >= 12) {
//         showWarning('Too much mouse activity detected during focus mode. Keep your movements calm.');
//         mouseMoveStreak.current = 0;
//       }
//     };

//     const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       clearInterval(t);
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('mousemove', handleMouseMove);
//       clearTimeout(warningTimer.current);
//     };
//   }, [running, secondsLeft]);

//   useEffect(() => {
//     if (secondsLeft === 0) setRunning(false);
//   }, [secondsLeft]);

//   const start = () => {
//     setSecondsLeft(minutes * 60);
//     setRunning(true);
//   };

//   const m = Math.floor(secondsLeft / 60);
//   const s = secondsLeft % 60;

//   return (
//     <FeaturePageShell
//       title="Focus Assistance"
//       subtitle="Pomodoro-style timer to stay on track while studying."
//       icon={FaBullseye}
//     >
//       <div className="text-center py-8">
//         <p className="text-6xl font-mono font-bold text-white tabular-nums">
//           {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
//         </p>
//         <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
//           {[25, 45, 15].map((n) => (
//             <button
//               key={n}
//               type="button"
//               onClick={() => { setMinutes(n); setSecondsLeft(n * 60); setRunning(false); }}
//               disabled={running}
//               className={`px-4 py-2 rounded-xl text-sm border transition disabled:opacity-50 ${
//                 minutes === n ? 'border-violet-500 bg-violet-500/20 text-violet-200' : 'border-slate-600 text-slate-400'
//               }`}
//             >
//               {n} min
//             </button>
//           ))}
//           <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2">
//             <span className="text-sm text-slate-400">Custom:</span>
//             <input
//               type="number"
//               min="1"
//               max="120"
//               value={minutes}
//               disabled={running}
//               onChange={(event) => {
//                 const value = Math.max(1, Math.min(120, Number(event.target.value) || 1));
//                 setMinutes(value);
//                 setSecondsLeft(value * 60);
//               }}
//               className="w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-right text-white focus:outline-none"
//             />
//             <span className="text-sm text-slate-400">min</span>
//           </div>
//         </div>
//         <div className="flex justify-center gap-3 mt-6">
//           <button type="button" onClick={start} className="btn-primary">
//             {running ? 'Restart' : 'Start focus'}
//           </button>
//           <button
//             type="button"
//             onClick={() => setRunning(false)}
//             className="btn-ghost"
//           >
//             Pause
//           </button>
//         </div>
//         {running && (
//           <p className="mt-4 text-sm text-amber-300">
//             Focus mode is active. Do not close the browser or switch tabs until the timer finishes.
//           </p>
//         )}
//         {warning && (
//           <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
//             {warning}
//           </div>
//         )}
//       </div>
//     </FeaturePageShell>
//   );
// }


// import { useState, useEffect, useRef, useCallback } from 'react';
// import { FaBullseye } from 'react-icons/fa';
// import FeaturePageShell from '../../components/features/FeaturePageShell';
// import { aiAPI } from '../../services/api';

// // ─── Constants ────────────────────────────────────────────────────────────────
// const QUOTES = [
//   'The secret of getting ahead is getting started. — Mark Twain',
//   'Focus is the art of knowing what to ignore. — Anonymous',
//   "It's not that I'm so smart, it's just that I stay with problems longer. — Einstein'",
//   'Deep work is the superpower of the 21st century. — Cal Newport',
//   "You don't rise to the level of your goals. You fall to the level of your systems. — James Clear",
//   'Concentrate all your thoughts upon the work in hand. — Nikola Tesla',
// ];

// const STORAGE_KEY = 'gyaanmate_focus_history';

// function loadHistory() {
//   try {
//     return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//   } catch {
//     return [];
//   }
// }

// function saveHistory(history) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
//   } catch {
//     // storage full – silently skip
//   }
// }

// function requestNotificationPermission() {
//   if ('Notification' in window && Notification.permission === 'default') {
//     Notification.requestPermission();
//   }
// }

// function sendNotification(title, body) {
//   if ('Notification' in window && Notification.permission === 'granted') {
//     new Notification(title, { body, icon: '/favicon.ico' });
//   }
// }

// // ─── Markdown-lite renderer (bold + bullets) ──────────────────────────────────
// function AIContent({ text }) {
//   if (!text) return null;
//   const lines = text.split('\n');
//   return (
//     <div className="space-y-1 text-sm leading-relaxed text-slate-300">
//       {lines.map((line, i) => {
//         if (!line.trim()) return <div key={i} className="h-2" />;
//         // Heading lines starting with ** or ##
//         const headingMatch = line.match(/^#{1,3}\s+(.+)/) || line.match(/^\*\*(.+)\*\*$/);
//         if (headingMatch) {
//           return (
//             <p key={i} className="font-semibold text-violet-300 mt-3">
//               {headingMatch[1]}
//             </p>
//           );
//         }
//         // Bullet lines
//         if (/^[-*•]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())) {
//           const content = line.replace(/^[-*•\d.]\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
//           return (
//             <div key={i} className="flex gap-2 items-start">
//               <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400" />
//               <span>{content}</span>
//             </div>
//           );
//         }
//         // Normal line with inline bold
//         const parts = line.split(/\*\*(.+?)\*\*/g);
//         return (
//           <p key={i}>
//             {parts.map((part, j) =>
//               j % 2 === 1 ? (
//                 <strong key={j} className="text-white font-semibold">
//                   {part}
//                 </strong>
//               ) : (
//                 part
//               ),
//             )}
//           </p>
//         );
//       })}
//     </div>
//   );
// }

// // ─── AI Card component ────────────────────────────────────────────────────────
// function AICard({ title, emoji, content, loading, error, accent = 'violet' }) {
//   const colors = {
//     violet: {
//       border: 'border-violet-500/30',
//       bg: 'bg-violet-500/5',
//       header: 'text-violet-300',
//       badge: 'bg-violet-500/20 text-violet-300',
//     },
//     emerald: {
//       border: 'border-emerald-500/30',
//       bg: 'bg-emerald-500/5',
//       header: 'text-emerald-300',
//       badge: 'bg-emerald-500/20 text-emerald-300',
//     },
//   };
//   const c = colors[accent] || colors.violet;

//   return (
//     <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 text-left`}>
//       <div className="flex items-center gap-2 mb-3">
//         <span className="text-lg">{emoji}</span>
//         <h3 className={`font-semibold text-base ${c.header}`}>{title}</h3>
//         {loading && (
//           <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${c.badge} animate-pulse`}>
//             Generating…
//           </span>
//         )}
//       </div>
//       {loading && (
//         <div className="space-y-2">
//           {[80, 60, 72, 55].map((w, i) => (
//             <div
//               key={i}
//               className="h-3 rounded-full bg-slate-700 animate-pulse"
//               style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
//             />
//           ))}
//         </div>
//       )}
//       {error && !loading && (
//         <p className="text-sm text-red-400">{error}</p>
//       )}
//       {!loading && !error && content && <AIContent text={content} />}
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function FocusAssistance() {
//   // Timer state
//   const [minutes, setMinutes] = useState(25);
//   const [secondsLeft, setSecondsLeft] = useState(25 * 60);
//   const [running, setRunning] = useState(false);

//   // Goal & score
//   const [goal, setGoal] = useState('');
//   const [focusScore, setFocusScore] = useState(100);

//   // Warning / info messages
//   const [warning, setWarning] = useState('');
//   const warningTimer = useRef(null);

//   // AI states
//   const [studyPlan, setStudyPlan] = useState('');
//   const [studyPlanLoading, setStudyPlanLoading] = useState(false);
//   const [studyPlanError, setStudyPlanError] = useState('');

//   const [sessionReview, setSessionReview] = useState('');
//   const [sessionReviewLoading, setSessionReviewLoading] = useState(false);
//   const [sessionReviewError, setSessionReviewError] = useState('');

//   // Session history
//   const [history, setHistory] = useState(loadHistory);

//   // Quote
//   const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

//   // Refs for focus-score penalties
//   const mouseMoveStreak = useRef(0);
//   const lastMouseMove = useRef(0);
//   const focusScoreRef = useRef(100); // keep ref in sync for closures
//   const runningRef = useRef(false);

//   // Keep refs in sync
//   useEffect(() => {
//     focusScoreRef.current = focusScore;
//   }, [focusScore]);
//   useEffect(() => {
//     runningRef.current = running;
//   }, [running]);

//   // ── Helpers ──────────────────────────────────────────────────────────────────
//   const showWarning = useCallback((msg) => {
//     setWarning(msg);
//     clearTimeout(warningTimer.current);
//     warningTimer.current = window.setTimeout(() => setWarning(''), 6000);
//   }, []);

//   const penaliseScore = useCallback(
//     (amount, reason) => {
//       setFocusScore((prev) => {
//         const next = Math.max(0, prev - amount);
//         focusScoreRef.current = next;
//         return next;
//       });
//       showWarning(reason);
//     },
//     [showWarning],
//   );

//   // ── Request notification permission on mount ──────────────────────────────
//   useEffect(() => {
//     requestNotificationPermission();
//   }, []);

//   // ── AI: generate study plan ───────────────────────────────────────────────
//   const generateStudyPlan = useCallback(
//     async (topic, durationMin) => {
//       if (!topic.trim()) return;
//       setStudyPlanLoading(true);
//       setStudyPlanError('');
//       setStudyPlan('');
//       try {
//         const prompt = `You are an expert study coach. Create a focused study plan for the following session.

// Study Topic: ${topic}
// Session Duration: ${durationMin} minutes

// Provide a structured study plan with:
// 1. **Learning Objectives** – 2-3 clear goals for this session
// 2. **Step-by-Step Roadmap** – Break the ${durationMin} minutes into timed segments
// 3. **Key Concepts to Cover** – Bullet list of the most important points
// 4. **Practice Task** – One hands-on exercise to do during the session

// Keep it concise, actionable, and motivating. Format with clear headings and bullets.`;

//         const res = await aiAPI.bot([{ role: 'user', content: prompt }]);
//         // axios response: res.data is the parsed response body
//         const body = res?.data;
//         const text =
//           body?.message ||
//           body?.reply ||
//           body?.response ||
//           body?.content ||
//           body?.text ||
//           (typeof body === 'string' ? body : '');
//         setStudyPlan(text || 'Study plan generated. Good luck!');
//       } catch (err) {
//         setStudyPlanError('Could not generate study plan. Please try again.');
//       } finally {
//         setStudyPlanLoading(false);
//       }
//     },
//     [],
//   );

//   // ── AI: generate session review ───────────────────────────────────────────
//   const generateSessionReview = useCallback(
//     async (topic, durationMin, score) => {
//       setSessionReviewLoading(true);
//       setSessionReviewError('');
//       setSessionReview('');
//       try {
//         const prompt = `You are an expert study coach. The student just completed a ${durationMin}-minute focus session on "${topic || 'General Study'}" with a focus score of ${score}/100.

// Generate a helpful session review with:
// 1. **Session Summary** – 2-3 sentence recap of what was likely covered
// 2. **5 Revision Questions** – Questions to test understanding of the topic
// 3. **Next Topic Recommendation** – What to study next and why

// Keep it encouraging, specific, and actionable. Format with clear headings and numbered lists.`;

//         const res = await aiAPI.bot([{ role: 'user', content: prompt }]);
//         // axios response: res.data is the parsed response body
//         const body = res?.data;
//         const text =
//           body?.message ||
//           body?.reply ||
//           body?.response ||
//           body?.content ||
//           body?.text ||
//           (typeof body === 'string' ? body : '');
//         setSessionReview(text || 'Great session! Review your notes and rest well.');
//       } catch (err) {
//         setSessionReviewError('Could not generate session review. Please try again.');
//       } finally {
//         setSessionReviewLoading(false);
//       }
//     },
//     [],
//   );

//   // ── Timer tick ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!running || secondsLeft <= 0) return undefined;
//     const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
//     return () => clearInterval(t);
//   }, [running, secondsLeft]);

//   // ── Session complete ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (secondsLeft === 0 && running) {
//       setRunning(false);
//       runningRef.current = false;

//       const entry = {
//         id: Date.now(),
//         topic: goal || 'General Study',
//         duration: minutes,
//         score: focusScoreRef.current,
//         date: new Date().toLocaleDateString(),
//       };
//       const updated = [entry, ...loadHistory()];
//       saveHistory(updated);
//       setHistory(updated);

//       sendNotification(
//         '🎯 Session Complete!',
//         `You finished a ${minutes}-minute session on "${entry.topic}" with a focus score of ${entry.score}.`,
//       );

//       generateSessionReview(goal, minutes, focusScoreRef.current);
//     }
//   }, [secondsLeft, running, goal, minutes, generateSessionReview]);

//   // ── Focus-loss detection (penalty only, no stop) ──────────────────────────
//   useEffect(() => {
//     if (!running) return undefined;

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden' && runningRef.current) {
//         penaliseScore(10, '⚠️ Tab switched — focus score reduced by 10.');
//       }
//     };

//     const handleWindowBlur = () => {
//       if (runningRef.current) {
//         penaliseScore(10, '⚠️ Window lost focus — focus score reduced by 10.');
//       }
//     };

//     const handleMouseMove = () => {
//       if (!runningRef.current) return;
//       const now = Date.now();
//       if (now - lastMouseMove.current < 500) {
//         mouseMoveStreak.current += 1;
//       } else {
//         mouseMoveStreak.current = 0;
//       }
//       lastMouseMove.current = now;

//       if (mouseMoveStreak.current >= 12) {
//         penaliseScore(5, '⚠️ Excessive mouse activity — focus score reduced by 5.');
//         mouseMoveStreak.current = 0;
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, [running, penaliseScore]);

//   // ── Start / restart ───────────────────────────────────────────────────────
//   const start = () => {
//     setSecondsLeft(minutes * 60);
//     setRunning(true);
//     setFocusScore(100);
//     focusScoreRef.current = 100;
//     setWarning('');
//     setSessionReview('');
//     setSessionReviewError('');
//     generateStudyPlan(goal, minutes);
//   };

//   const pause = () => {
//     setRunning(false);
//     runningRef.current = false;
//   };

//   // ── Derived display values ────────────────────────────────────────────────
//   const m = Math.floor(secondsLeft / 60);
//   const s = secondsLeft % 60;
//   const progress = 1 - secondsLeft / (minutes * 60);
//   const circumference = 2 * Math.PI * 54;

//   const scoreColor =
//     focusScore >= 80
//       ? 'text-emerald-400'
//       : focusScore >= 50
//       ? 'text-amber-400'
//       : 'text-red-400';

//   const scoreBg =
//     focusScore >= 80
//       ? 'bg-emerald-500/20 border-emerald-500/40'
//       : focusScore >= 50
//       ? 'bg-amber-500/20 border-amber-500/40'
//       : 'bg-red-500/20 border-red-500/40';

//   return (
//     <FeaturePageShell
//       title="Focus Assistance"
//       subtitle="AI-powered Pomodoro sessions with personalised study plans."
//       icon={FaBullseye}
//     >
//       <div className="max-w-2xl mx-auto space-y-6 pb-10">

//         {/* ── Motivational Quote ───────────────────────────────────────────── */}
//         <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-5 py-4 text-center">
//           <p className="text-sm text-slate-400 italic">"{quote}"</p>
//         </div>

//         {/* ── Goal Input ───────────────────────────────────────────────────── */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-slate-300">
//             📚 What are you studying today?
//           </label>
//           <input
//             type="text"
//             value={goal}
//             disabled={running}
//             onChange={(e) => setGoal(e.target.value)}
//             placeholder="e.g. Integration by Parts, React Hooks, World War II…"
//             className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition"
//           />
//         </div>

//         {/* ── AI Study Plan ────────────────────────────────────────────────── */}
//         {(studyPlanLoading || studyPlan || studyPlanError) && (
//           <AICard
//             title="AI Study Plan"
//             emoji="🧠"
//             content={studyPlan}
//             loading={studyPlanLoading}
//             error={studyPlanError}
//             accent="violet"
//           />
//         )}

//         {/* ── Timer Card ───────────────────────────────────────────────────── */}
//         <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 text-center space-y-6">

//           {/* Circular progress + time */}
//           <div className="flex justify-center">
//             <div className="relative w-36 h-36">
//               <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
//                 <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
//                 <circle
//                   cx="60" cy="60" r="54"
//                   fill="none"
//                   stroke={running ? '#8b5cf6' : '#475569'}
//                   strokeWidth="8"
//                   strokeLinecap="round"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={circumference * (1 - progress)}
//                   className="transition-all duration-1000"
//                 />
//               </svg>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-3xl font-mono font-bold text-white tabular-nums">
//                   {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Focus Score */}
//           <div
//             className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${scoreBg} ${scoreColor}`}
//           >
//             <span>🎯 Focus Score:</span>
//             <span>{focusScore} / 100</span>
//           </div>

//           {/* Duration Presets */}
//           <div className="flex flex-wrap items-center justify-center gap-2">
//             {[15, 25, 45].map((n) => (
//               <button
//                 key={n}
//                 type="button"
//                 onClick={() => { setMinutes(n); setSecondsLeft(n * 60); setRunning(false); }}
//                 disabled={running}
//                 className={`px-3 py-1.5 rounded-xl text-xs border transition disabled:opacity-50 ${
//                   minutes === n
//                     ? 'border-violet-500 bg-violet-500/20 text-violet-200'
//                     : 'border-slate-600 text-slate-400 hover:border-slate-500'
//                 }`}
//               >
//                 {n} min
//               </button>
//             ))}
//             <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-1.5">
//               <span className="text-xs text-slate-400">Custom:</span>
//               <input
//                 type="number"
//                 min="1"
//                 max="120"
//                 value={minutes}
//                 disabled={running}
//                 onChange={(e) => {
//                   const v = Math.max(1, Math.min(120, Number(e.target.value) || 1));
//                   setMinutes(v);
//                   setSecondsLeft(v * 60);
//                 }}
//                 className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right text-xs text-white focus:outline-none"
//               />
//               <span className="text-xs text-slate-400">min</span>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="flex justify-center gap-3">
//             <button
//               type="button"
//               onClick={start}
//               disabled={studyPlanLoading}
//               className="btn-primary disabled:opacity-50"
//             >
//               {running ? '↺ Restart' : '▶ Start Focus'}
//             </button>
//             {running && (
//               <button type="button" onClick={pause} className="btn-ghost">
//                 ⏸ Pause
//               </button>
//             )}
//           </div>

//           {/* Active session notice */}
//           {running && (
//             <p className="text-xs text-amber-300/80">
//               ⏱ Session active — tab switches and window blur will reduce your focus score.
//             </p>
//           )}

//           {/* Warning */}
//           {warning && (
//             <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
//               {warning}
//             </div>
//           )}
//         </div>

//         {/* ── AI Session Review ────────────────────────────────────────────── */}
//         {(sessionReviewLoading || sessionReview || sessionReviewError) && (
//           <AICard
//             title="AI Session Review"
//             emoji="📝"
//             content={sessionReview}
//             loading={sessionReviewLoading}
//             error={sessionReviewError}
//             accent="emerald"
//           />
//         )}

//         {/* ── Session History ──────────────────────────────────────────────── */}
//         {history.length > 0 && (
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold text-slate-300">📅 Session History</h3>
//             <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
//               {history.map((entry) => {
//                 const sc = entry.score ?? 100;
//                 const dot =
//                   sc >= 80 ? 'bg-emerald-400' : sc >= 50 ? 'bg-amber-400' : 'bg-red-400';
//                 const label =
//                   sc >= 80 ? 'text-emerald-400' : sc >= 50 ? 'text-amber-400' : 'text-red-400';
//                 return (
//                   <div
//                     key={entry.id}
//                     className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3 text-sm"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
//                       <div>
//                         <p className="text-white font-medium truncate max-w-[180px]">
//                           {entry.topic}
//                         </p>
//                         <p className="text-xs text-slate-500">{entry.date}</p>
//                       </div>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="text-slate-400 text-xs">{entry.duration} min</p>
//                       <p className={`text-xs font-semibold ${label}`}>
//                         Score: {sc}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             <button
//               type="button"
//               onClick={() => { saveHistory([]); setHistory([]); }}
//               className="text-xs text-slate-500 hover:text-red-400 transition"
//             >
//               Clear history
//             </button>
//           </div>
//         )}
//       </div>
//     </FeaturePageShell>
//   );
// }


