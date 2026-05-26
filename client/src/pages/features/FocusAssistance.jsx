import { useState, useEffect } from 'react';
import { FaBullseye } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';

export default function FocusAssistance() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return undefined;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) setRunning(false);
  }, [secondsLeft]);

  const start = () => {
    setSecondsLeft(minutes * 60);
    setRunning(true);
  };

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  return (
    <FeaturePageShell
      title="Focus Assistance"
      subtitle="Pomodoro-style timer to stay on track while studying."
      icon={FaBullseye}
    >
      <div className="text-center py-8">
        <p className="text-6xl font-mono font-bold text-white tabular-nums">
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </p>
        <div className="flex justify-center gap-3 mt-8">
          {[25, 45, 15].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setMinutes(n); setSecondsLeft(n * 60); setRunning(false); }}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                minutes === n ? 'border-violet-500 bg-violet-500/20 text-violet-200' : 'border-slate-600 text-slate-400'
              }`}
            >
              {n} min
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button type="button" onClick={start} className="btn-primary">
            {running ? 'Restart' : 'Start focus'}
          </button>
          <button
            type="button"
            onClick={() => setRunning(false)}
            className="btn-ghost"
          >
            Pause
          </button>
        </div>
      </div>
    </FeaturePageShell>
  );
}
