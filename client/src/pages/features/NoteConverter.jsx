import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaRobot } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { aiAPI } from '../../services/api';

export default function NoteConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    const text = input.trim();
    if (!text) {
      toast.error('Paste some notes first');
      return;
    }
    setLoading(true);
    setOutput('');
    try {
      const { data } = await aiAPI.bot([
        {
          role: 'user',
          content: `Convert and summarize these study notes into clear bullet points and key takeaways:\n\n${text}`,
        },
      ]);
      setOutput(data.content || 'No response.');
    } catch {
      toast.error('AI conversion unavailable. Sign up to save results, or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeaturePageShell
      title="AI Note Converter"
      subtitle="Guests can try converting notes once. Sign in to upload and save study materials."
      icon={FaRobot}
      badge="Guest access"
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your raw notes here..."
        rows={8}
        className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none resize-y"
      />
      <button
        type="button"
        onClick={handleConvert}
        disabled={loading}
        className="btn-primary mt-4 disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert with AI'}
      </button>
      {output && (
        <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-violet-500/20">
          <p className="text-xs font-semibold text-violet-400 mb-2 uppercase tracking-wider">Result</p>
          <p className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">{output}</p>
        </div>
      )}
      <p className="text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
        {' '}to upload notes and access the full library.
      </p>
    </FeaturePageShell>
  );
}
