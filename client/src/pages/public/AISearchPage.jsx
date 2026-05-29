import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from '../../lib/icons';
import AISearchEngine from '../../components/search/AISearchEngine';
import { popularSearches } from '../../config/navigation';
import { useTheme } from '../../context/ThemeContext';

export default function AISearchPage() {
  const [params, setParams] = useSearchParams();
  const aiQuery = params.get('q') || '';
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleQueryChange = (q) => {
    setParams(q ? { q } : {}, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="ai-search-page max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4 ${isLight ? 'bg-blue-100 border border-blue-200 text-blue-700' : 'bg-violet-500/15 border border-violet-500/30 text-violet-300'}`}>
          <Sparkles size={16} /> Intelligent Search
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
          What do you want to <span className="gradient-text">learn today?</span>
        </h1>
        <p className={`max-w-lg mx-auto ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
          Search across courses, notes, videos, and more — powered by AI recommendations.
        </p>
      </div>

      <AISearchEngine initialQuery={aiQuery} onQueryChange={handleQueryChange} />

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Trending searches</p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleQueryChange(term)}
              className={`px-4 py-2 rounded-full text-sm transition ${isLight ? 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100' : 'glass border border-violet-500/20 text-slate-300 hover:border-violet-500/50 hover:text-violet-300'}`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['Courses', 'Notes', 'PDFs', 'Videos', 'Mock Tests'].map((cat) => (
          <div
            key={cat}
            className={`glass-card p-4 text-center text-sm font-medium border ${isLight ? 'text-gray-700 border-blue-100 bg-white' : 'text-slate-300 border-white/5'}`}
          >
            {cat}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
