import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
const MAX_TEXT_FILE_SIZE = 1024 * 1024;
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const TEXT_FILE_TYPES = [
  'text/',
  'application/json',
  'application/javascript',
  'application/xml',
  'application/csv',
];
const IMAGE_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  const [micOn, setMicOn] = useState(false);
  const [dictationSupported, setDictationSupported] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [readingAttachment, setReadingAttachment] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setDictationSupported(Boolean(SpeechRecognition));

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

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
    const typedContent = (text || input).trim();
    const attachmentText = attachment
      ? [
        `Attached image: ${attachment.name} (${Math.ceil(attachment.size / 1024)} KB).`,
        attachment.extractedText
          ? `Text found in the image:\n${attachment.extractedText}`
          : 'No readable text was extracted from the image. Respond using the message context and file name only.',
      ].join('\n\n')
      : '';
    const content = [typedContent, attachmentText].filter(Boolean).join('\n\n').trim();
    if (!content || loading || readingAttachment) return;

    stopDictation();
    const userMsg = {
      role: 'user',
      content,
      attachment: attachment
        ? {
          type: 'image',
          name: attachment.name,
          previewUrl: attachment.previewUrl,
        }
        : undefined,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setAttachment(null);
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
    stopDictation();
    setMessages([WELCOME]);
    setActiveSessionId(null);
    setInput('');
    setAttachment(null);
  };

  const stopDictation = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setMicOn(false);
  };

  const toggleDictation = () => {
    if (micOn) {
      stopDictation();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDictationSupported(false);
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    let committedTranscript = input.trim();

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          committedTranscript = `${committedTranscript} ${transcript.trim()}`.trim();
        } else {
          interimTranscript += transcript;
        }
      }

      setInput(`${committedTranscript} ${interimTranscript}`.trim());
    };

    recognition.onerror = (event) => {
      recognitionRef.current = null;
      setMicOn(false);
      toast.error(event.error === 'not-allowed' ? 'Microphone permission was not granted' : 'Speech recognition stopped');
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setMicOn(false);
      inputRef.current?.focus();
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setMicOn(true);
    } catch {
      recognitionRef.current = null;
      setMicOn(false);
      toast.error('Could not start microphone input');
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const isImage = IMAGE_FILE_TYPES.includes(file.type);

    if (isImage) {
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        toast.error('Image must be 5MB or smaller');
        inputRef.current?.focus();
        return;
      }

      setReadingAttachment(true);
      try {
        const previewUrl = await readFileAsDataUrl(file);
        setAttachment({
          type: 'image',
          name: file.name,
          size: file.size,
          previewUrl,
          extractedText: '',
        });

        const formData = new FormData();
        formData.append('file', file);
        const { data } = await aiAPI.extractText(formData);
        setAttachment((current) => (
          current?.previewUrl === previewUrl
            ? { ...current, extractedText: data.text || '' }
            : current
        ));
        toast.success(data.text ? 'Image attached and text extracted' : 'Image attached');
      } catch {
        toast.error('Image attached, but no readable text was found');
      } finally {
        setReadingAttachment(false);
        inputRef.current?.focus();
      }
      return;
    }

    const canReadAsText =
      TEXT_FILE_TYPES.some((type) => file.type.startsWith(type)) ||
      /\.(txt|md|csv|json|js|jsx|ts|tsx|html|css|xml|log)$/i.test(file.name);

    if (!canReadAsText) {
      setInput((current) => {
        const prefix = current.trim() ? `${current.trim()}\n\n` : '';
        return `${prefix}I uploaded a file named "${file.name}" (${Math.ceil(file.size / 1024)} KB). Please tell me what text or details you need from it.`;
      });
      toast.error('Only text-based files can be read directly in chat');
      inputRef.current?.focus();
      return;
    }

    if (file.size > MAX_TEXT_FILE_SIZE) {
      toast.error('Text file must be 1MB or smaller');
      inputRef.current?.focus();
      return;
    }

    try {
      const text = await file.text();
      setInput((current) => {
        const prefix = current.trim() ? `${current.trim()}\n\n` : '';
        return `${prefix}Attached file: ${file.name}\n\n${text.slice(0, 6000)}`;
      });
      toast.success('File text added to your message');
      inputRef.current?.focus();
    } catch {
      toast.error('Could not read this file');
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const loadChat = (session) => {
    setMessages(session.messages?.length ? session.messages : [WELCOME]);
    setActiveSessionId(session.id);
  };

  const onDragStart = (e, isFab = false) => {
    // e.preventDefault();
    
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
            className="fixed z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl ai-glow flex items-center justify-center border border-violet-400/40 touch-none select-none cursor-pointer"
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
            className={`gyaan-chat-panel ${panelSize} flex flex-col rounded-2xl border border-violet-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden ${minimized ? '!h-auto max-h-16' : ''}`}
          >
            <div
              className="gyaan-chat-header flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-gradient-to-r from-violet-900/50 to-slate-900/80 cursor-grab active:cursor-grabbing touch-none select-none"
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
                <button type="button" onClick={newChat} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer" title="New chat">
                  <Plus size={16} />
                </button>
                <button type="button" onClick={() => setMinimized(!minimized)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
                  <Minimize2 size={16} />
                </button>
                <button type="button" onClick={() => setMaximized(!maximized)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hidden sm:block cursor-pointer">
                  <Maximize2 size={16} />
                </button>
                <button type="button" onClick={closeChat} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {!minimized && (
              <div className="flex flex-1 min-h-0">
                {showHistory && (
                  <aside className="gyaan-chat-sidebar hidden sm:flex flex-col w-52 border-r border-slate-700/50 bg-slate-950/60 shrink-0">
                    <button
                      type="button"
                      onClick={newChat}
                      className="gyaan-chat-new-session m-3 py-2 rounded-xl border border-violet-500/40 text-violet-300 text-sm font-medium hover:bg-violet-500/10 transition cursor-pointer"
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
                          className={`gyaan-chat-recent-item w-full text-left px-3 py-2 rounded-lg text-xs truncate transition cursor-pointer ${activeSessionId === s.id ? 'gyaan-chat-recent-item-active bg-violet-600/25 text-violet-200' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </aside>
                )}

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="gyaan-chat-body flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        variants={chatBubble}
                        initial="initial"
                        animate="animate"
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                              ? 'gyaan-chat-user-bubble bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-md'
                              : 'gyaan-chat-ai-bubble bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-bl-md'
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.attachment?.type === 'image' && (
                            <img
                              src={msg.attachment.previewUrl}
                              alt={msg.attachment.name}
                              className="mt-3 max-h-44 rounded-xl border border-white/20 object-contain"
                            />
                          )}
                          {msg.courses?.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.courses.slice(0, 3).map((c) => (
                                <button
                                  key={c._id}
                                  type="button"
                                  onClick={() => { navigate(`/course/${c._id}`); closeChat(); }}
                                  className="flex gap-2 w-full text-left p-2 rounded-lg bg-slate-900/70 hover:bg-violet-500/15 border border-slate-700/50 transition cursor-pointer"
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

                  <div className="gyaan-chat-input-wrap p-3 border-t border-slate-700/60 bg-slate-900/80">
                    <div className="flex flex-wrap gap-1.5 mb-2 max-h-14 overflow-y-auto">
                      {QUICK_PROMPTS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => sendMessage(p)}
                          disabled={loading}
                          className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-violet-500/20 hover:text-violet-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <form
                      onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                      className="flex gap-2 items-end"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp,.txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.html,.css,.xml,.log,text/*,application/json,application/xml,application/csv"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        onClick={handleAttachClick}
                        disabled={loading}
                        className="p-2.5 text-slate-500 hover:text-violet-400 transition shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        title="Attach image or text file"
                      >
                        <Paperclip size={18} />
                      </button>
                      {attachment && (
                        <div className="flex max-w-[10rem] items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-2 py-1.5 text-xs text-slate-300">
                          <img src={attachment.previewUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
                          <span className="min-w-0 flex-1 truncate">
                            {readingAttachment ? 'Reading...' : attachment.name}
                          </span>
                          <button type="button" onClick={removeAttachment} className="text-slate-500 hover:text-white" title="Remove image">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-600/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={toggleDictation}
                        disabled={!dictationSupported || loading}
                        className={`p-2.5 transition shrink-0 hidden sm:block cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${micOn ? 'text-emerald-400' : 'text-slate-500 hover:text-violet-400'
                          }`}
                        title={micOn ? 'Stop voice input' : 'Speak your message'}
                      >
                        <Mic size={18} />
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading || readingAttachment || (!input.trim() && !attachment)}
                        whileTap={{ scale: 0.92 }}
                        className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
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
