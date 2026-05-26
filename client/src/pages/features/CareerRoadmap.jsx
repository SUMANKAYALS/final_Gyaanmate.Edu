import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';

const ROADMAPS = [
  { title: 'Full-Stack Developer', steps: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases'] },
  { title: 'Data Scientist', steps: ['Python', 'Statistics', 'Pandas', 'ML Basics', 'Deep Learning'] },
  { title: 'Cloud Engineer', steps: ['Linux', 'Networking', 'AWS/Azure', 'Docker', 'Kubernetes'] },
];

export default function CareerRoadmap() {
  return (
    <FeaturePageShell
      title="Career Roadmap"
      subtitle="Structured learning paths to reach your career goals."
      icon={FaGraduationCap}
    >
      <div className="space-y-4">
        {ROADMAPS.map((r) => (
          <div key={r.title} className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/30">
            <h3 className="font-semibold text-white mb-3">{r.title}</h3>
            <ol className="flex flex-wrap gap-2">
              {r.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <Link to="/browse" className="btn-primary inline-flex mt-6">
        Find courses for your path
      </Link>
    </FeaturePageShell>
  );
}
