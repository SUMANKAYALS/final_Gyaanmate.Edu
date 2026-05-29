import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen } from '../../lib/icons';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';

export default function HeroSection() {
  const { openChat } = useChat();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className={`relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 mb-10 ${isLight ? 'border border-blue-200/80' : 'border border-violet-500/20'}`}>
      <div className={`absolute inset-0 pointer-events-none ${isLight ? 'bg-gradient-to-br from-blue-100/70 via-white/60 to-indigo-100/60' : 'bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10'}`} />
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${isLight ? 'bg-blue-400/20' : 'bg-violet-600/20'}`} />
      <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl ${isLight ? 'bg-indigo-300/20' : 'bg-indigo-600/15'}`} />

      <div className="relative grid lg:grid-cols-2 gap-10 items-center lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${isLight ? 'bg-blue-100 border border-blue-200 text-blue-700' : 'bg-violet-500/15 border border-violet-500/30 text-violet-300'}`}>
            <Sparkles size={14} /> AI-Powered Learning
          </p>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${isLight ? 'text-gray-900' : 'text-white dark:text-white'}`}>
            Learn Smarter.
            <br />
            <span className="gradient-text">Achieve More.</span>
          </h1>
          <p className={`text-lg mt-4 max-w-lg leading-relaxed ${isLight ? 'text-gray-700' : 'text-slate-400'}`}>
            AI tools, top courses, study materials and more — everything you need to grow.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/browse" className="btn-primary">
              <BookOpen size={18} />
              Explore Courses
            </Link>
            <button type="button" onClick={() => openChat()} className="btn-ghost">
              <Sparkles size={18} />
              Ask AI Anything
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center lg:justify-end w-full min-w-0 h-full"
        >
          <HeroIllustration isLight={isLight} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroIllustration({ isLight }) {
  return (
    <motion.div
      className="relative w-full h-full min-h-[220px] sm:min-h-[280px] lg:min-h-0 max-w-xl sm:max-w-2xl lg:max-w-none lg:w-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className={`absolute -inset-6 rounded-[2rem] blur-3xl pointer-events-none ${isLight ? 'bg-blue-400/20' : 'bg-violet-600/25'}`}
        aria-hidden
      />
      <div
        className={`relative h-full min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] overflow-hidden rounded-3xl ${isLight ? 'border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-[0_18px_42px_rgba(37,99,235,0.18)]' : 'border border-violet-500/30 bg-gradient-to-br from-[#0B1020] to-[#1A103D] shadow-[0_0_60px_rgba(124,58,237,0.35)]'}`}
      >
        <img
          src={isLight ? '/images/hero-ai-assistant-light.png' : '/images/hero-ai-assistant.png'}
          alt="GyaanMate AI learning assistant with laptop and education icons"
          className="absolute inset-0 h-full w-full object-cover object-center scale-[1.03]"
          loading="eager"
          decoding="async"
        />
        <div className={`absolute inset-0 pointer-events-none z-10 ${isLight ? 'bg-gradient-to-t from-blue-100/45 via-transparent to-white/10' : 'bg-gradient-to-t from-[#0B1020]/50 via-transparent to-transparent'}`} />
      </div>
      <div
        className={`absolute -top-2 -right-2 w-3 h-3 rounded-full blur-[1px] animate-pulse ${isLight ? 'bg-blue-400/70' : 'bg-violet-400/80'}`}
        aria-hidden
      />
      <div
        className={`absolute bottom-8 -left-1 w-2 h-2 rounded-full blur-[1px] animate-pulse ${isLight ? 'bg-sky-400/70' : 'bg-indigo-400/70'}`}
        style={{ animationDelay: '1s' }}
        aria-hidden
      />
    </motion.div>
  );
}
