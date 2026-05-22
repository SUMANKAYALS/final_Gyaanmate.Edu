import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Loader2 } from '../../lib/icons';
import { aiAPI } from '../../services/api';
import { chatBubble } from '../../animations/motionVariants';

const SUGGESTIONS = [
  'Show me React courses',
  'Best AI courses for beginners',
  'Cyber Security fundamentals',
  'Python for data science',
  'Web development full stack',
];

export default function AISearchBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI learning assistant. Ask me anything — e.g. \"Show me React courses\" or \"Best AI courses for beginners\".",
    },
  ]);
  const [lastResult, setLastResult] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSearch = async (text) => {
    const q = (text || query).trim();
    if (!q) return;

    setQuery('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setLoading(true);

    try {
      const { data } = await aiAPI.chat([...messages, { role: 'user', content: q }]);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.content,
          courses: data.courses,
          relatedTopics: data.relatedTopics,
        },
      ]);
      setLastResult(data);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Could not reach the server. Make sure the API is running and MongoDB is seeded.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl glass border border-indigo-500/30 text-slate-300 hover:border-indigo-400/60 transition cursor-pointer"
      >
        <Sparkles className="text-indigo-400 text-lg shrink-0" />
        <span className="text-left flex-1 text-slate-400">
          Ask AI: &quot;Show me React courses&quot; or &quot;Best AI for beginners&quot;...
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300">AI Search</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl glass border border-indigo-500/30 shadow-2xl overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-slate-900/50"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="flex items-center gap-2"
                >
                  <Bot className="text-indigo-400 text-xl" />
                  <span className="font-semibold gradient-text">Gyaanmate · Gemini</span>
                </motion.div>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X size={18} />
                </button>
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px] max-h-[50vh]"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    variants={chatBubble}
                    initial="initial"
                    animate="animate"
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.courses?.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.courses.slice(0, 5).map((c) => (
                            <motion.button
                              key={c._id}
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                navigate(`/course/${c._id}`);
                                setOpen(false);
                              }}
                              className="block w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-indigo-500/20 border border-slate-700/50 text-xs"
                            >
                              <span className="font-medium text-indigo-300">{c.title}</span>
                              <span className="text-slate-500 ml-2">· {c.category}</span>
                              <span className="text-emerald-400 ml-2">${c.price}</span>
                            </motion.button>
                          ))}
                          <button
                            onClick={() => {
                              navigate(`/search?q=${encodeURIComponent(messages[i - 1]?.content || '')}`);
                              setOpen(false);
                            }}
                            className="text-xs text-indigo-400 hover:underline"
                          >
                            View all results →
                          </button>
                        </div>
                      )}
                      {msg.relatedTopics?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {msg.relatedTopics.map((t) => (
                            <button
                              key={t}
                              onClick={() => handleSearch(`courses about ${t}`)}
                              className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="flex items-center gap-2 px-4 text-indigo-300 text-sm"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gemini is thinking...
                  </motion.div>
                )}
                <motion.div ref={bottomRef} />
              </motion.div>

              <div className="p-3 border-t border-slate-700/50 bg-slate-900/30">
                <div className="flex flex-wrap gap-2 mb-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about any course, skill, or category..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                  >
                    <Send size={18} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
