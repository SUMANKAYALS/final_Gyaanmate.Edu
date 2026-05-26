import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';

export default function GamifiedStreaks() {
  const streak = Number(localStorage.getItem('gyaanmate-streak') || 7);

  return (
    <FeaturePageShell
      title="Gamified Streaks"
      subtitle="Build daily learning habits and earn rewards."
      icon={FaFire}
    >
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-4xl mb-4">
          🔥
        </div>
        <p className="text-5xl font-bold text-white">{streak}</p>
        <p className="text-slate-400 mt-1">day streak</p>
        <p className="text-sm text-slate-500 mt-4 max-w-md mx-auto">
          Complete a lesson or study session each day to keep your streak alive.
        </p>
      </div>
      <Link to="/student/dashboard" className="btn-primary inline-flex mx-auto block w-fit">
        View full progress dashboard
      </Link>
    </FeaturePageShell>
  );
}
