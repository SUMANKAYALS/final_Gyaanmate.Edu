import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Bot, Send, X, Loader2, MessageCircle, Minimize2, Maximize2, Paperclip, Mic } from '../../lib/icons';
import { aiAPI } from '../../services/api';
import { chatBubble } from '../../animations/motionVariants';

const WELCOME = {
  role: 'assistant',
  content:
    "Hi! I'm GyaanMate AI — your learning assistant. Ask about study tips, career paths, how to get started, or anything about the platform. For finding courses, use the AI Course Search box on the home page.",
};

const QUICK_PROMPTS = [
  'How do I get started learning to code?',
  'What career paths use Python?',
  'Tips for staying motivated while studying',
  'Difference between web dev and mobile dev?',
];

export default function FloatingAIChat() {
  const navigate = useNavigate();
  const dragControls = useDragControls();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiAPI.bot(
        nextMessages.filter((m) => m.role === 'user' || m.role === 'assistant')
      );
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.content,
          courses: data.courses,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Sorry, I couldn't connect right now. Make sure the server is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setInput('');
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/40"
            aria-label="Open chat assistant"
            style={{
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            <MessageCircle size={22} />
            <span className="font-medium text-sm hidden sm:inline">AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatRef}
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[min(100vw-2rem,400px)] flex flex-col rounded-2xl border border-indigo-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
            style={{
              height: minimized ? 'auto' : 'min(85vh,560px)',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-gradient-to-r from-indigo-900/40 to-slate-900/80 cursor-move"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="flex items-center gap-2"
              >
                <motion.div className="p-1.5 rounded-lg bg-indigo-500/20">
                  <Bot className="text-indigo-400" size={20} />
                </motion.div>
                <div>
                  <p className="font-semibold text-white text-sm">GyaanMate AI</p>
                  <p className="text-[10px] text-slate-400">Conversation · not course search</p>
                </div>
              </motion.div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-xs px-2 py-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={toggleMinimize}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      variants={chatBubble}
                      initial="initial"
                      animate="animate"
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-bl-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.courses?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Mentioned courses</p>
                            {msg.courses.slice(0, 3).map((c) => (
                              <button
                                key={c._id}
                                type="button"
                                onClick={() => {
                                  navigate(`/course/${c._id}`);
                                  setOpen(false);
                                }}
                                className="flex gap-2 w-full text-left p-2 rounded-lg bg-slate-900/70 hover:bg-indigo-500/15 border border-slate-700/50 transition group"
                              >
                                <img
                                  src={c.image}
                                  alt=""
                                  className="w-12 h-9 rounded object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-indigo-300 line-clamp-1 group-hover:text-indigo-200">
                                    {c.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500">{c.category}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 text-indigo-300 text-sm px-1">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Typing...</span>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-slate-700/60 bg-slate-900/80">
                  <div className="flex flex-wrap gap-1.5 mb-2 max-h-16 overflow-y-auto">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => sendMessage(p)}
                        disabled={loading}
                        className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition disabled:opacity-50"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <button
                      type="button"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                      <Paperclip size={18} />
                    </button>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      disabled={loading}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                      <Mic size={18} />
                    </button>
                    <motion.button
                      type="submit"
                      disabled={loading || !input.trim()}
                      whileTap={{ scale: 0.92 }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-40 transition"
                    >
                      <Send size={18} />
                    </motion.button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse Glow Animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
          }
        }
      `}</style>
    </>
  );
}
