import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { aiAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Star,
  Target,
  Users,
} from '../../lib/icons';
import { getMediaUrl } from '../../utils/media';

const DEFAULT_FORM = {
  goal: 'Become a full-stack web developer',
  interests: 'React, JavaScript, backend, projects',
  level: 'Beginner',
  category: '',
  budget: '',
};

const CATEGORIES = [
  '',
  'Programming',
  'Web Development',
  'AI & Machine Learning',
  'Cyber Security',
  'Data Science',
  'Business & Finance',
  'Graphic Design',
  'Competitive Exams',
];

const LEVELS = ['', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

function currency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function RecommendationCourse({ course, isDark }) {
  return (
    <article className={`overflow-hidden rounded-xl border shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
        <Link to={`/course/${course._id}`} className="relative block min-h-48 overflow-hidden bg-slate-200 md:min-h-full">
          <img src={getMediaUrl(course.image)} alt={course.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
            #{course.rank} match
          </span>
        </Link>

        <div className="flex min-w-0 flex-col p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                {course.category}
              </p>
              <Link to={`/course/${course._id}`} className={`mt-1 block text-lg font-bold leading-snug hover:text-violet-500 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {course.title}
              </Link>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {course.instructorName || course.instructor?.name || 'Instructor'} · {course.level}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{currency(course.price)}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{course.recommendationScore}% fit score</p>
            </div>
          </div>

          <p className={`mt-3 line-clamp-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {course.description}
          </p>

          <div className={`mt-4 grid gap-2 rounded-lg p-3 ${isDark ? 'bg-slate-950/60' : 'bg-slate-50'}`}>
            {(course.recommendationReasons || []).map((reason) => (
              <div key={reason} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                {reason}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className={`inline-flex items-center gap-1 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
              <Star size={14} className="fill-current" /> {Number(course.rating || 0).toFixed(1)}
            </span>
            <span className={`inline-flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Users size={14} /> {(course.students || 0).toLocaleString()} learners
            </span>
            {(course.matchedKeywords || []).slice(0, 4).map((keyword) => (
              <span key={keyword} className={`rounded-full px-2 py-1 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AIRecommendations() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
    isDark
      ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-violet-500'
      : 'border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-violet-500'
  }`;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.goal.trim() && !form.interests.trim()) {
      toast.error('Enter a learning goal or interests');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        interests: form.interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const { data } = await aiAPI.recommendations(payload);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to generate recommendations');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${isDark ? 'border-violet-500/30 bg-violet-500/15 text-violet-300' : 'border-violet-200 bg-violet-50 text-violet-700'}`}>
            <Brain size={16} />
            AI Recommendation System
          </div>
          <h1 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Personalized course and study material recommendations
          </h1>
          <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Tell GyaanMate your goal, level, interests, and budget. The system ranks real courses and supporting materials from your platform data.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={submit} className={`rounded-xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="mb-5 flex items-center gap-2">
            <Target size={18} className="text-violet-500" />
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Learner Profile</h2>
          </div>

          <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Learning goal</label>
          <textarea
            value={form.goal}
            onChange={(event) => update('goal', event.target.value)}
            rows={4}
            className={inputClass}
            placeholder="Example: become a data analyst, prepare for interviews..."
          />

          <label className={`mb-2 mt-4 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Interests or skills</label>
          <input
            value={form.interests}
            onChange={(event) => update('interests', event.target.value)}
            className={inputClass}
            placeholder="React, Python, SQL, UI design..."
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Level</label>
              <select value={form.level} onChange={(event) => update('level', event.target.value)} className={inputClass}>
                {LEVELS.map((level) => <option key={level} value={level}>{level || 'Any level'}</option>)}
              </select>
            </div>
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Budget</label>
              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={(event) => update('budget', event.target.value)}
                className={inputClass}
                placeholder="Any"
              />
            </div>
          </div>

          <label className={`mb-2 mt-4 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Preferred category</label>
          <select value={form.category} onChange={(event) => update('category', event.target.value)} className={inputClass}>
            {CATEGORIES.map((category) => <option key={category} value={category}>{category || 'Auto-detect category'}</option>)}
          </select>

          <button type="submit" disabled={loading} className="btn-primary mt-5 w-full disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Ranking courses...' : 'Generate Recommendations'}
          </button>
        </form>

        <main className="space-y-5">
          {!result && (
            <div className={`flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center ${isDark ? 'border-slate-700 bg-slate-900/50 text-slate-400' : 'border-slate-300 bg-white text-slate-500'}`}>
              <Sparkles size={42} className="mb-4 text-violet-500" />
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Ready to recommend</p>
              <p className="mt-2 max-w-md text-sm">Your results will include ranked courses, match reasons, related study materials, and next steps.</p>
            </div>
          )}

          {result && (
            <>
              <section className={`rounded-xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>Recommendation summary</p>
                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{result.message}</p>
                  </div>
                  <div className={`rounded-lg px-3 py-2 text-xs ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {result.provider}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(result.intent?.keywords || []).map((keyword) => (
                    <span key={keyword} className={`rounded-full px-3 py-1 text-xs ${isDark ? 'bg-violet-500/15 text-violet-200' : 'bg-violet-50 text-violet-700'}`}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                {(result.recommendations || []).map((course) => (
                  <RecommendationCourse key={course._id} course={course} isDark={isDark} />
                ))}
              </section>

              <div className="grid gap-5 xl:grid-cols-2">
                <section className={`rounded-xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                  <div className="mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-sky-500" />
                    <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Study Materials</h2>
                  </div>
                  {(result.studyMaterials || []).length ? (
                    <div className="space-y-3">
                      {result.studyMaterials.map((material) => (
                        <a
                          key={material._id}
                          href={material.file?.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`block rounded-lg border p-3 transition ${isDark ? 'border-slate-700 hover:border-sky-500/50' : 'border-slate-200 hover:border-sky-300'}`}
                        >
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-950'}`}>{material.title}</p>
                          <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{material.reason}</p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No matching study materials found yet.</p>
                  )}
                </section>

                <section className={`rounded-xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                  <div className="mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-500" />
                    <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>Next Steps</h2>
                  </div>
                  <div className="space-y-3">
                    {(result.nextSteps || []).map((step) => (
                      <div key={step} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <ArrowRight size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        {step}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </motion.div>
  );
}
