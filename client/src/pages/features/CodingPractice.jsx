import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { codingPracticeAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import {
  Award,
  CheckCircle2,
  Circle,
  Code2,
  Filter,
  Loader2,
  Play,
  Save,
  Search,
  Sparkles,
  Target,
  Zap,
} from '../../lib/icons';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const DEFAULT_RESULT = { status: 'Idle', passed: 0, total: 0, runtimeMs: 0, details: [] };

function normalizeValue(value, options = {}) {
  if (Array.isArray(value)) {
    const normalized = value.map((item) => normalizeValue(item, options));
    if (options.unorderedGroups && normalized.every(Array.isArray)) {
      return normalized.map((group) => [...group].sort()).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }
    if (options.unordered) return [...normalized].sort();
    return normalized;
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: normalizeValue(value[key], options) }), {});
  }
  return value;
}

function valuesEqual(actual, expected, options) {
  return JSON.stringify(normalizeValue(actual, options)) === JSON.stringify(normalizeValue(expected, options));
}

function formatValue(value) {
  return typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
}

function runCodeInWorker({ code, functionName, tests, publicOnly }) {
  const workerSource = `
    const normalizeValue = ${normalizeValue.toString()};
    const valuesEqual = ${valuesEqual.toString()};
    self.onmessage = (event) => {
      const started = performance.now();
      const { code, functionName, tests, publicOnly } = event.data;
      const selectedTests = publicOnly ? tests.filter((test) => test.public) : tests;
      const results = [];
      try {
        const candidate = new Function(code + "\\n; return typeof " + functionName + " === 'function' ? " + functionName + " : null;")();
        if (!candidate) throw new Error('Expected a function named ' + functionName);
        for (const test of selectedTests) {
          const caseStarted = performance.now();
          try {
            const actual = candidate(...test.args);
            const passed = valuesEqual(actual, test.expected, test);
            results.push({
              public: test.public,
              passed,
              input: test.args,
              expected: test.expected,
              actual,
              runtimeMs: Math.round(performance.now() - caseStarted),
            });
          } catch (error) {
            results.push({
              public: test.public,
              passed: false,
              input: test.args,
              expected: test.expected,
              error: error.message || 'Runtime error',
              runtimeMs: Math.round(performance.now() - caseStarted),
            });
          }
        }
        self.postMessage({ ok: true, runtimeMs: Math.round(performance.now() - started), results });
      } catch (error) {
        self.postMessage({ ok: false, runtimeMs: Math.round(performance.now() - started), error: error.message || 'Runtime error', results });
      }
    };
  `;

  return new Promise((resolve) => {
    const blob = new Blob([workerSource], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve({ ok: false, timeout: true, runtimeMs: 2000, error: 'Execution timed out after 2 seconds', results: [] });
    }, 2000);

    worker.onmessage = (event) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (event) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, runtimeMs: 0, error: event.message || 'Runtime error', results: [] });
    };
    worker.postMessage({ code, functionName, tests, publicOnly });
  });
}

function difficultyClass(difficulty, isDark) {
  const styles = {
    Easy: isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
    Medium: isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700',
    Hard: isDark ? 'bg-red-500/15 text-red-300' : 'bg-red-50 text-red-700',
  };
  return styles[difficulty] || (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600');
}

function StatTile({ icon: Icon, label, value, tone, isDark }) {
  return (
    <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
          <p className={`mt-1 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${tone}`}> <Icon size={20} /> </div>
      </div>
    </div>
  );
}

function ProblemList({ problems, activeSlug, onSelect, isDark }) {
  return (
    <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className={`grid grid-cols-[36px_minmax(0,1fr)_88px] gap-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-500'}`}>
        <span />
        <span>Problem</span>
        <span>Level</span>
      </div>
      <div className="max-h-[560px] overflow-y-auto">
        {problems.map((problem) => (
          <button
            key={problem.slug}
            type="button"
            onClick={() => onSelect(problem.slug)}
            className={`grid w-full grid-cols-[36px_minmax(0,1fr)_88px] items-center gap-3 border-b px-4 py-4 text-left transition last:border-b-0 ${
              activeSlug === problem.slug
                ? isDark ? 'border-slate-800 bg-violet-500/10' : 'border-slate-100 bg-violet-50'
                : isDark ? 'border-slate-800 hover:bg-slate-800/70' : 'border-slate-100 hover:bg-slate-50'
            }`}
          >
            {problem.solved ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <Circle size={18} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
            )}
            <span className="min-w-0">
              <span className={`block truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>{problem.title}</span>
              <span className={`mt-1 block truncate text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {problem.category} - {problem.estimatedMinutes} min - {problem.acceptance}% accepted
              </span>
            </span>
            <span className={`rounded-full px-2.5 py-1 text-center text-xs font-bold ${difficultyClass(problem.difficulty, isDark)}`}>
              {problem.difficulty}
            </span>
          </button>
        ))}
        {!problems.length && (
          <div className={`px-4 py-12 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            No problems match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemStatement({ problem, isDark }) {
  if (!problem) return null;
  return (
    <section className={`rounded-xl border p-5 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${difficultyClass(problem.difficulty, isDark)}`}>{problem.difficulty}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              {problem.category}
            </span>
          </div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{problem.title}</h2>
        </div>
        <div className={`rounded-lg px-3 py-2 text-xs ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
          {problem.totalTestCount} judge tests
        </div>
      </div>

      <p className={`text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{problem.prompt}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Input</p>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{problem.inputFormat}</p>
        </div>
        <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Output</p>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{problem.outputFormat}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Examples</h3>
        {problem.examples.map((example, index) => (
          <div key={`${example.input}-${index}`} className={`rounded-lg border p-3 text-sm ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}><span className="font-semibold">Input:</span> {example.input}</p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}><span className="font-semibold">Output:</span> {example.output}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Constraints</h3>
        <ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {problem.constraints.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
    </section>
  );
}

function ResultPanel({ result, isDark }) {
  const accepted = result.status === 'Accepted';
  const failed = result.status === 'Wrong Answer' || result.status === 'Runtime Error';
  return (
    <section className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Run result</p>
          <p className={`mt-1 text-xl font-bold ${accepted ? 'text-emerald-500' : failed ? 'text-red-500' : isDark ? 'text-white' : 'text-slate-950'}`}>
            {result.status}
          </p>
        </div>
        <div className={`rounded-lg px-3 py-2 text-sm ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
          {result.passed}/{result.total} tests - {result.runtimeMs}ms
        </div>
      </div>
      {result.error && <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{result.error}</p>}
      {result.details.length > 0 && (
        <div className="mt-4 grid gap-2">
          {result.details.map((item, index) => (
            <div key={`${index}-${item.passed}`} className={`rounded-lg border p-3 text-xs ${item.passed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className={item.passed ? 'font-semibold text-emerald-300' : 'font-semibold text-red-300'}>
                  {item.passed ? 'Passed' : 'Failed'} {item.public ? 'public' : 'hidden'} case {index + 1}
                </span>
                <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>{item.runtimeMs}ms</span>
              </div>
              {item.public ? (
                <>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Input: {formatValue(item.input)}</p>
                  {!item.passed && (
                    <>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Expected: {formatValue(item.expected)}</p>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Actual: {item.error || formatValue(item.actual)}</p>
                    </>
                  )}
                </>
              ) : (
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Hidden judge details are withheld. Re-check edge cases, constraints, and return shape.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function CodingPractice() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const user = useAuthStore((state) => state.user);
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ totalProblems: 0, solvedCount: 0, totalSubmissions: 0 });
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [code, setCode] = useState('');
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [problemLoading, setProblemLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(DEFAULT_RESULT);

  useEffect(() => {
    let active = true;
    async function loadProblems() {
      setLoading(true);
      try {
        const { data } = await codingPracticeAPI.getProblems();
        if (!active) return;
        setProblems(data.problems || []);
        setStats(data.stats || { totalProblems: 0, solvedCount: 0, totalSubmissions: 0 });
        setSelectedSlug((current) => current || data.problems?.[0]?.slug || '');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load coding practice');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProblems();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    codingPracticeAPI.mySubmissions()
      .then(({ data }) => {
        if (active) setSubmissions(data.submissions || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!selectedSlug) return undefined;
    let active = true;
    async function loadProblem() {
      setProblemLoading(true);
      setResult(DEFAULT_RESULT);
      try {
        const { data } = await codingPracticeAPI.getProblem(selectedSlug);
        if (!active) return;
        setSelectedProblem(data.problem);
        setCode(data.latestSubmission?.code || data.problem?.starterCode || '');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load problem');
      } finally {
        if (active) setProblemLoading(false);
      }
    }
    loadProblem();
    return () => {
      active = false;
    };
  }, [selectedSlug]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(problems.map((problem) => problem.category))).sort()], [problems]);
  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return problems.filter((problem) => {
      const matchesQuery = !normalizedQuery || [problem.title, problem.category, ...(problem.tags || [])].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const matchesCategory = category === 'All' || problem.category === category;
      return matchesQuery && matchesDifficulty && matchesCategory;
    });
  }, [category, difficulty, problems, query]);

  const completionRate = stats.totalProblems ? Math.round((stats.solvedCount / stats.totalProblems) * 100) : 0;

  const execute = async (publicOnly) => {
    if (!selectedProblem) return;
    setRunning(true);
    setResult({ ...DEFAULT_RESULT, status: publicOnly ? 'Running samples' : 'Submitting' });
    try {
      const { data } = await codingPracticeAPI.getProblemTests(selectedProblem.slug);
      const run = await runCodeInWorker({
        code,
        functionName: data.functionName,
        tests: data.tests,
        publicOnly,
      });
      const passed = run.results?.filter((item) => item.passed).length || 0;
      const total = publicOnly ? data.tests.filter((test) => test.public).length : data.tests.length;
      const status = run.ok && passed === total ? 'Accepted' : run.ok ? 'Wrong Answer' : 'Runtime Error';
      const nextResult = {
        status,
        passed,
        total,
        runtimeMs: run.runtimeMs || 0,
        error: run.error || '',
        details: run.results || [],
      };
      setResult(nextResult);

      if (!publicOnly) {
        if (!user) {
          toast.error('Sign in to save submissions and progress');
          return;
        }
        await codingPracticeAPI.submit(selectedProblem.slug, {
          code,
          language: 'javascript',
          status,
          passedTests: passed,
          totalTests: total,
          runtimeMs: nextResult.runtimeMs,
          error: nextResult.error,
        });
        toast.success(status === 'Accepted' ? 'Accepted. Progress saved.' : 'Submission saved for review.');
        const [problemRes, submissionsRes] = await Promise.all([
          codingPracticeAPI.getProblems(),
          codingPracticeAPI.mySubmissions(),
        ]);
        setProblems(problemRes.data.problems || []);
        setStats(problemRes.data.stats || stats);
        setSubmissions(submissionsRes.data.submissions || []);
      }
    } catch (error) {
      setResult({
        status: 'Runtime Error',
        passed: 0,
        total: 0,
        runtimeMs: 0,
        error: error.response?.data?.message || error.message || 'Unable to run code',
        details: [],
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${isDark ? 'border-sky-500/30 bg-sky-500/15 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
            <Code2 size={16} />
            Competitive Coding Practice
          </div>
          <h1 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Practice interview-grade coding problems
          </h1>
          <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Solve curated JavaScript problems with sample runs, hidden tests, saved submissions, and progress tracking.
          </p>
        </div>
        {!user && (
          <Link to="/login" className="rounded-xl border border-violet-500/40 px-4 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/10">
            Sign in to save progress
          </Link>
        )}
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatTile icon={Target} label="Solved" value={`${stats.solvedCount}/${stats.totalProblems}`} tone={isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'} isDark={isDark} />
        <StatTile icon={Award} label="Completion" value={`${completionRate}%`} tone={isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-sky-700'} isDark={isDark} />
        <StatTile icon={Zap} label="Submissions" value={stats.totalSubmissions} tone={isDark ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-50 text-violet-700'} isDark={isDark} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <div className="mb-3 flex items-center gap-2">
              <Filter size={16} className="text-violet-500" />
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Filters</p>
            </div>
            <div className="relative">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search arrays, stack, two sum..."
                className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-violet-500' : 'border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-violet-500'}`}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className={`rounded-xl border px-3 py-3 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950'}`}>
                {DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className={`rounded-xl border px-3 py-3 text-sm outline-none ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950'}`}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </section>

          {loading ? (
            <div className={`flex h-72 items-center justify-center rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
              <Loader2 className="mr-2 animate-spin" size={18} /> Loading problems
            </div>
          ) : (
            <ProblemList problems={filteredProblems} activeSlug={selectedSlug} onSelect={setSelectedSlug} isDark={isDark} />
          )}

          {user && submissions.length > 0 && (
            <section className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <p className={`mb-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Recent submissions</p>
              <div className="space-y-2">
                {submissions.slice(0, 5).map((submission) => (
                  <button key={submission._id} type="button" onClick={() => setSelectedSlug(submission.problemSlug)} className={`w-full rounded-lg border p-3 text-left text-xs ${isDark ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{submission.problemTitle}</span>
                      <span className={submission.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}>{submission.status}</span>
                    </div>
                    <p className={isDark ? 'mt-1 text-slate-500' : 'mt-1 text-slate-500'}>{submission.passedTests}/{submission.totalTests} tests - {submission.runtimeMs}ms</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>

        <main className="grid gap-6">
          {problemLoading || !selectedProblem ? (
            <div className={`flex h-96 items-center justify-center rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
              <Loader2 className="mr-2 animate-spin" size={18} /> Loading workspace
            </div>
          ) : (
            <>
              <ProblemStatement problem={selectedProblem} isDark={isDark} />

              <section className={`rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>JavaScript editor</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Implement `{selectedProblem.functionName}` exactly as named.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => execute(true)} disabled={running} className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 px-4 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-500/10 disabled:opacity-50">
                      {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      Run
                    </button>
                    <button type="button" onClick={() => execute(false)} disabled={running} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                      {running ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Submit
                    </button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  spellCheck="false"
                  className={`min-h-[360px] w-full resize-y rounded-b-xl border-0 p-4 font-mono text-sm leading-6 outline-none ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'}`}
                />
              </section>

              <ResultPanel result={result} isDark={isDark} />

              <section className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-500" />
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Professional practice note</p>
                    <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      This workspace runs JavaScript in your browser and stores only your submission summary and code. For production-grade multi-language judging, add an isolated execution service.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </motion.div>
  );
}
