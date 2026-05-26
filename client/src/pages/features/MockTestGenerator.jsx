import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaClipboardList } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { aiAPI } from '../../services/api';

export default function MockTestGenerator() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    const t = topic.trim();
    if (!t) {
      toast.error('Enter a topic');
      return;
    }
    setLoading(true);
    try {
      const { data } = await aiAPI.bot([
        {
          role: 'user',
          content: `Generate 5 multiple-choice practice questions (with answers at the end) for the topic: ${t}. Format clearly.`,
        },
      ]);
      setQuestions(data.content || '');
    } catch {
      toast.error('Could not generate mock test. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeaturePageShell
      title="Mock Test Generator"
      subtitle="AI-generated practice questions for any subject."
      icon={FaClipboardList}
    >
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g. Data Structures, React Hooks, Organic Chemistry"
        className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:border-violet-500 focus:outline-none"
      />
      <button type="button" onClick={generate} disabled={loading} className="btn-primary mt-4 disabled:opacity-50">
        {loading ? 'Generating...' : 'Generate mock test'}
      </button>
      {questions && (
        <pre className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">
          {questions}
        </pre>
      )}
    </FeaturePageShell>
  );
}
