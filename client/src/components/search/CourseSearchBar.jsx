import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X } from '../../lib/icons';
import { courseAPI } from '../../services/api';
import { getMediaUrl } from '../../utils/media';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, query }) {
  if (!query?.trim() || !text) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query.trim())})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={i} className="bg-indigo-500/35 text-indigo-100 rounded px-0.5 not-italic">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function CourseSearchBar({ className = '', placeholder = 'Search for courses...' }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchSuggestions = useCallback(async (q) => {
    const term = q.trim();
    if (!term) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await courseAPI.getAll({ search: term, limit: 8, sort: 'popular' });
      setCourses(data.courses || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setCourses([]);
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => fetchSuggestions(term), 280);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const goToCourse = (courseId) => {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    navigate(`/course/${courseId}`);
  };

  const goToSearchPage = () => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setQuery('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, courses.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && courses[activeIndex]) {
        goToCourse(courses[activeIndex]._id);
      } else {
        goToSearchPage();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && query.trim().length > 0;
  const hasResults = courses.length > 0;

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        className={`course-search-shell flex items-center gap-2 rounded-xl border bg-slate-900/80 transition-all duration-200 ${
          open ? 'border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10' : 'border-slate-600/80 hover:border-slate-500'
        }`}
      >
        <Search size={18} className="ml-3 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 pr-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          autoComplete="off"
          aria-label="Search courses"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
        {loading && <Loader2 size={18} className="mr-2 shrink-0 animate-spin text-indigo-400" />}
        {query && !loading && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCourses([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="mr-2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/80 transition"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="course-search-dropdown absolute left-0 right-0 top-[calc(100%+8px)] z-[60] overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40"
          >
            {loading && !hasResults ? (
              <motion.div className="px-4 py-8 text-center text-sm text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
                Searching courses...
              </motion.div>
            ) : hasResults ? (
              <ul className="max-h-[22rem] overflow-y-auto py-2" role="listbox">
                {courses.map((course, index) => (
                  <li key={course._id} role="option" aria-selected={index === activeIndex}>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.12)' }}
                      onClick={() => goToCourse(course._id)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        index === activeIndex ? 'bg-indigo-500/15' : ''
                      }`}
                    >
                      <img
                        src={getMediaUrl(course.image)}
                        alt=""
                        className="w-14 h-10 rounded-lg object-cover shrink-0 bg-slate-800 ring-1 ring-slate-700/50"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white line-clamp-1">
                          <Highlight text={course.title} query={query} />
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          <Highlight text={course.category} query={query} />
                          {course.level ? ` · ${course.level}` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-emerald-400 shrink-0">
                        ${course.price?.toFixed(0)}
                      </span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-10 text-center"
              >
                <p className="text-slate-300 font-medium">No courses found</p>
                <p className="text-sm text-slate-500 mt-1">Try different keywords like &quot;React&quot; or &quot;Python&quot;</p>
              </motion.div>
            )}

            {hasResults && (
              <motion.button
                type="button"
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                onClick={goToSearchPage}
                className="w-full border-t border-slate-700/80 px-4 py-2.5 text-sm text-indigo-300 hover:text-indigo-200 transition"
              >
                See all results for &quot;{query.trim()}&quot;
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
