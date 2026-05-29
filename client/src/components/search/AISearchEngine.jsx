import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Bot, X } from '../../lib/icons';
import { aiAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const AI_EXAMPLES = [
  'Show me React courses for beginners',
  'Best AI and machine learning courses',
  'I want to learn web development',
  'Cyber security courses',
  'Python for data science',
  'Business and finance courses',
];

export default function AISearchEngine({
  initialQuery = '',
  onQueryChange,
  compact = false,
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runSearch = useCallback(
    async (text) => {
      const q = text.trim();
      if (!q || loading) return;

      setActiveQuery(q);
      setQuery(q);
      onQueryChange?.(q);
      setLoading(true);
      setResult(null);

      try {
        const { data } = await aiAPI.search(q);
        setResult(data);
      } catch {
        setResult({
          message: 'AI search is temporarily unavailable. Check the server and GEMINI_API_KEY.',
          courses: [],
          relatedTopics: [],
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, onQueryChange]
  );

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.trim()) {
      runSearch(initialQuery);
    } else {
      setActiveQuery('');
      setResult(null);
    }
  }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (text) => {
    const q = (text || query).trim();
    if (!q) return;
    runSearch(q);
  };

  const clearSearch = () => {
    setQuery('');
    setActiveQuery('');
    setResult(null);
    setLoading(false);
    onQueryChange?.('');
  };

  const hasResults = !loading && result && activeQuery;
  const canClear = Boolean(query.trim() || activeQuery || result);

  return (
    <motion.div className={`ai-search-engine ${compact ? '' : 'w-full max-w-3xl mx-auto'} ${isLight ? 'light' : ''}`}>
      <motion.div
        layout
        className={`relative rounded-2xl border bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-900/80 transition-all duration-300 overflow-hidden ${
          compact ? 'border-indigo-500/30' : 'border-indigo-500/40 shadow-lg shadow-indigo-500/10'
        } ${hasResults || loading ? 'border-violet-500/50' : ''}`}
      >
        <div className="flex items-center gap-2 px-4 pt-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Sparkles className="text-indigo-400 shrink-0" size={compact ? 18 : 22} />
          </motion.div>
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/90">
            AI Course Search
          </span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Smart search
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex flex-col"
        >
          {/* Top: user input */}
          <div className="px-4 pt-2 pb-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={compact ? 2 : 3}
              placeholder='Describe what you want to learn — e.g. "beginner Python for data science"'
              className="w-full resize-none bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-sm md:text-base leading-relaxed"
              disabled={loading}
            />
          </div>

          {/* Middle: loading + results */}
          <AnimatePresence mode="wait">
            {loading && activeQuery && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mb-3 rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-5 flex flex-col items-center gap-2 text-slate-400"
              >
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <p className="text-sm">Analyzing intent and ranking courses...</p>
              </motion.div>
            )}

            {hasResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mb-3 rounded-xl border border-indigo-500/30 bg-slate-950/50 max-h-[min(50vh,380px)] overflow-y-auto"
              >
                <div className="p-3 space-y-3">
                  <AISearchIntentBadges intent={result.intent} />
                  <AISearchMessage message={result.message} provider={result.provider} compact />

                  {result.relatedTopics?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Related topics</p>
                      <motion.div className="flex flex-wrap gap-1.5">
                        {result.relatedTopics.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => submit(`courses about ${topic}`)}
                            className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-indigo-300 transition"
                          >
                            {topic}
                          </button>
                        ))}
                      </motion.div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-white mb-2">
                      {result.courses?.length
                        ? `${result.courses.length} course${result.courses.length === 1 ? '' : 's'} found`
                        : 'No courses found'}
                    </p>
                    {result.courses?.length > 0 ? (
                      <div className="space-y-2">
                        {result.courses.map((c) => (
                          <Link
                            key={c._id}
                            to={`/course/${c._id}`}
                            className="flex gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/40 transition group"
                          >
                            <img
                              src={c.image}
                              alt=""
                              className="w-16 h-11 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-indigo-200 line-clamp-2 group-hover:text-indigo-100">
                                {c.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {c.category}
                                {c.level ? ` · ${c.level}` : ''}
                                {c.rating ? ` · ★ ${c.rating}` : ''}
                              </p>
                              {c.price != null && (
                                <p className="text-xs text-emerald-400/90 mt-0.5">${c.price}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-3">
                        Try different words or{' '}
                        <Link to="/browse" className="text-indigo-400 hover:underline">
                          browse all courses
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom: Clear + Search */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-700/50">
            <p className="text-[10px] text-slate-500 hidden sm:block shrink-0">
              Results appear between your text and the buttons
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <motion.button
                type="button"
                onClick={clearSearch}
                disabled={!canClear || loading}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-600/80 bg-slate-800/60 text-slate-300 text-sm font-medium hover:border-slate-500 hover:text-white disabled:opacity-40 transition"
              >
                <X size={16} />
                Clear
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || !query.trim()}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium disabled:opacity-40 transition shadow-md shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Search
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      {!hasResults && !loading && (
        <div className={`flex flex-wrap gap-2 ${compact ? 'mt-3' : 'mt-4'}`}>
          {AI_EXAMPLES.map((example) => (
            <motion.button
              key={example}
              type="button"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setQuery(example);
                submit(example);
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-600/80 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/10 transition disabled:opacity-50"
            >
              {example}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function AISearchIntentBadges({ intent }) {
  if (!intent) return null;
  const items = [];
  if (intent.category) items.push({ label: 'Category', value: intent.category });
  if (intent.level) items.push({ label: 'Level', value: intent.level });
  if (intent.keywords?.length) {
    items.push({ label: 'Keywords', value: intent.keywords.slice(0, 4).join(', ') });
  }
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-200"
        >
          <span className="text-slate-500">{item.label}:</span>
          {item.value}
        </span>
      ))}
    </div>
  );
}

export function AISearchMessage({ message, provider, compact = false }) {
  return (
    <div
      className={`rounded-xl border border-indigo-500/20 bg-indigo-500/5 ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 shrink-0">
          <Bot className="text-indigo-400" size={compact ? 16 : 20} />
        </div>
        <div>
          <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
          {provider && (
            <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wide">
              Powered by {provider === 'gemini' ? 'Google Gemini' : 'Gyaanmate'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
