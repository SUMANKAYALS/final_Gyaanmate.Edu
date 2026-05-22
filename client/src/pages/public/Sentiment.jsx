import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from '../../lib/icons';
import { aiAPI } from '../../services/api';

const LABEL_COLORS = {
  positive: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200',
  negative: 'bg-rose-500/15 border-rose-500/30 text-rose-200',
  neutral: 'bg-slate-500/15 border-slate-500/30 text-slate-200',
};

export default function Sentiment() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter text to analyze.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await aiAPI.sentiment(trimmed);
      setResult(data);
    } catch (err) {
      setError('Sentiment analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-200 text-xs uppercase tracking-[0.2em]">
              <Sparkles size={16} /> Sentiment AI
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Analyze tone and emotion instantly</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">
              Paste any text and LearnHub will classify its sentiment, show positive and negative words, and surface a confidence score.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Why use sentiment analysis?</p>
            <p className="mt-2">Understand student feedback, course reviews, or support messages with real AI-powered tone detection.</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Enter text to detect sentiment..."
            className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 p-5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">
              Enter course feedback, reviews, chat messages, or any student note.
            </div>
            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze sentiment'
              )}
            </button>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          {result && (
            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Sentiment result</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{result.label}</h2>
                  <p className="text-xs text-slate-500 mt-1">Analyzed with {result.provider === 'huggingface' ? 'Hugging Face' : 'local fallback'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <StatCard label="Score" value={result.score} />
                  <StatCard label="Comparative" value={result.comparative.toFixed(3)} />
                  <div className={`rounded-3xl border px-4 py-3 ${LABEL_COLORS[result.label]}`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tone</p>
                    <p className="mt-2 text-lg font-semibold capitalize">{result.label}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <WordList title="Positive" words={result.positive} accent="emerald" />
                <WordList title="Negative" words={result.negative} accent="rose" />
              </div>

              <div className="rounded-3xl border border-slate-700/50 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400 mb-3">Detailed word analysis</p>
                <pre className="whitespace-pre-wrap break-words text-sm text-slate-300">{JSON.stringify({ tokens: result.tokens, words: result.words }, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function WordList({ title, words, accent }) {
  return (
    <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400 mb-3">{title}</p>
      {words?.length ? (
        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
            <span key={word} className={`rounded-full px-3 py-1 text-xs font-medium text-${accent}-200 bg-${accent}-500/10 border border-${accent}-500/20`}> 
              {word}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">None detected</p>
      )}
    </div>
  );
}
