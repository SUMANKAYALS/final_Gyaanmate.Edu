import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  X,
  Loader2,
  Sparkles,
  Minimize2,
  Maximize2,
  Plus,
  Paperclip,
  Mic,
  GripHorizontal,
} from '../../lib/icons';
import { aiAPI } from '../../services/api';
import { chatBubble } from '../../animations/motionVariants';
import { useChat } from '../../context/ChatContext';

const WELCOME = {
  role: 'assistant',
  content:
    "Hi! I'm GyaanMate AI — your learning assistant. Ask about study tips, career paths, how to get started, or anything about the platform. For finding courses, use AI Search in the sidebar.",
};

const QUICK_PROMPTS = [
  'How do I get started learning to code?',
  'What career paths use Python?',
  'Tips for staying motivated while studying',
  'Explain Newton\'s third law simply',
];

const STORAGE_KEY = 'gyaanmate-chat-sessions';

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 20)));
}

export default function ChatBot() {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, closeChat, consumePendingPrompt } = useChat();
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [sessions, setSessions] = useState(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    moved: false,
    isFab: false,
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  const [position, setPosition] = useState({ x: null, y: null });
  const [fabPos, setFabPos] = useState({ x: null, y: null });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen && !minimized) inputRef.current?.focus();
  }, [isOpen, minimized]);

  useEffect(() => {
    const prompt = consumePendingPrompt();
    if (prompt) {
      setIsOpen(true);
      setMinimized(false);
      setTimeout(() => sendMessage(prompt), 100);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const persistSession = useCallback((msgs, id) => {
    const title = msgs.find((m) => m.role === 'user')?.content?.slice(0, 40) || 'New chat';
    const sessionId = id || `chat-${Date.now()}`;
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      const next = [{ id: sessionId, title, messages: msgs, updatedAt: Date.now() }, ...filtered];
      saveSessions(next);
      return next;
    });
    setActiveSessionId(sessionId);
    return sessionId;
  }, []);

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
      const final = [
        ...nextMessages,
        { role: 'assistant', content: data.content, courses: data.courses },
      ];
      setMessages(final);
      persistSession(final, activeSessionId);
    } catch {
      const final = [
        ...nextMessages,
        {
          role: 'assistant',
          content: "Sorry, I couldn't connect right now. Make sure the server is running and try again.",
        },
      ];
      setMessages(final);
      persistSession(final, activeSessionId);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([WELCOME]);
    setActiveSessionId(null);
    setInput('');
  };

  const loadChat = (session) => {
    setMessages(session.messages?.length ? session.messages : [WELCOME]);
    setActiveSessionId(session.id);
  };

  const onDragStart = (e, isFab = false) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const el = isFab ? null : panelRef.current;
    const rect = isFab
      ? { left: window.innerWidth - 88, top: window.innerHeight - 88, width: 56, height: 56 }
      : el?.getBoundingClientRect() || { left: 0, top: 0 };
    const current = isFab ? fabPos : position;
    dragRef.current = {
      dragging: true,
      moved: false,
      isFab,
      startX: clientX,
      startY: clientY,
      posX: current.x ?? rect.left,
      posY: current.y ?? rect.top,
    };
  };

  const onDragEnd = () => {
    if (dragRef.current.isFab && dragRef.current.dragging && !dragRef.current.moved) {
      setIsOpen(true);
      setMinimized(false);
    }
    dragRef.current.dragging = false;
    dragRef.current.moved = false;
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 10) dragRef.current.moved = true;
      const nx = Math.max(8, Math.min(window.innerWidth - 64, dragRef.current.posX + dx));
      const ny = Math.max(8, Math.min(window.innerHeight - 64, dragRef.current.posY + dy));
      if (dragRef.current.isFab) setFabPos({ x: nx, y: ny });
      else setPosition({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, [setIsOpen]);

  const panelStyle = position.x != null
    ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
    : { right: 24, bottom: 24 };

  const fabStyle = fabPos.x != null
    ? { left: fabPos.x, top: fabPos.y, right: 'auto', bottom: 'auto' }
    : { right: 24, bottom: 24 };

  const panelSize = maximized
    ? 'fixed inset-4 z-50'
    : 'fixed z-50 w-[min(100vw-2rem,920px)] h-[min(90vh,640px)]';

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            style={fabStyle}
            className="fixed z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl ai-glow flex items-center justify-center border border-violet-400/40 touch-none select-none"
            aria-label="Open AI assistant — drag to move"
            onMouseDown={(e) => onDragStart(e, true)}
            onTouchStart={(e) => onDragStart(e, true)}
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={maximized ? {} : panelStyle}
            className={`${panelSize} flex flex-col rounded-2xl border border-violet-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden ${minimized ? '!h-auto max-h-16' : ''}`}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-gradient-to-r from-violet-900/50 to-slate-900/80 cursor-grab active:cursor-grabbing touch-none select-none"
              onMouseDown={(e) => !maximized && onDragStart(e)}
              onTouchStart={(e) => !maximized && onDragStart(e)}
            >
              <div className="flex items-center gap-2">
                <GripHorizontal size={16} className="text-slate-500 hidden sm:block" />
                <div className="p-1.5 rounded-lg bg-violet-500/20">
                  <Bot className="text-violet-400" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">GyaanMate AI</p>
                  <p className="text-[10px] text-slate-400">Learning assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={newChat} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="New chat">
                  <Plus size={16} />
                </button>
                <button type="button" onClick={() => setMinimized(!minimized)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <Minimize2 size={16} />
                </button>
                <button type="button" onClick={() => setMaximized(!maximized)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hidden sm:block">
                  <Maximize2 size={16} />
                </button>
                <button type="button" onClick={closeChat} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <X size={18} />
                </button>
              </div>
            </div>

            {!minimized && (
              <div className="flex flex-1 min-h-0">
                {showHistory && (
                  <aside className="hidden sm:flex flex-col w-52 border-r border-slate-700/50 bg-slate-950/60 shrink-0">
                    <button
                      type="button"
                      onClick={newChat}
                      className="m-3 py-2 rounded-xl border border-violet-500/40 text-violet-300 text-sm font-medium hover:bg-violet-500/10 transition"
                    >
                      + New Chat
                    </button>
                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                      <p className="px-2 text-[10px] uppercase text-slate-500 tracking-wider">Recent</p>
                      {sessions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => loadChat(s)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate transition ${
                            activeSessionId === s.id ? 'bg-violet-600/25 text-violet-200' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </aside>
                )}

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
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
                              ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-md'
                              : 'bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.courses?.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.courses.slice(0, 3).map((c) => (
                                <button
                                  key={c._id}
                                  type="button"
                                  onClick={() => { navigate(`/course/${c._id}`); closeChat(); }}
                                  className="flex gap-2 w-full text-left p-2 rounded-lg bg-slate-900/70 hover:bg-violet-500/15 border border-slate-700/50 transition"
                                >
                                  <img src={c.image} alt="" className="w-12 h-9 rounded object-cover shrink-0" />
                                  <p className="text-xs font-medium text-violet-300 line-clamp-2">{c.title}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-1.5 text-violet-300 text-sm px-1">
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <div className="p-3 border-t border-slate-700/60 bg-slate-900/80">
                    <div className="flex flex-wrap gap-1.5 mb-2 max-h-14 overflow-y-auto">
                      {QUICK_PROMPTS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => sendMessage(p)}
                          disabled={loading}
                          className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-violet-500/20 hover:text-violet-300 transition disabled:opacity-50"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <form
                      onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                      className="flex gap-2 items-end"
                    >
                      <button type="button" className="p-2.5 text-slate-500 hover:text-violet-400 transition shrink-0">
                        <Paperclip size={18} />
                      </button>
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-600/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                      />
                      <button type="button" className="p-2.5 text-slate-500 hover:text-violet-400 transition shrink-0 hidden sm:block">
                        <Mic size={18} />
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading || !input.trim()}
                        whileTap={{ scale: 0.92 }}
                        className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white disabled:opacity-40 shrink-0"
                      >
                        <Send size={18} />
                      </motion.button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
