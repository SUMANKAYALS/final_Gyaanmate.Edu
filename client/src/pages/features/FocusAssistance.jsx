import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaBullseye } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';

export default function FocusAssistance() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [warning, setWarning] = useState('');
  const warningTimer = useRef(null);
  const lastMouseMove = useRef(0);
  const mouseMoveStreak = useRef(0);
  const lastHiddenAt = useRef(0);
  const tabSwitchCount = useRef(0);

  const showWarning = (message) => {
    setWarning(message);
    clearTimeout(warningTimer.current);
    warningTimer.current = window.setTimeout(() => setWarning(''), 5000);
  };

  const stopFocusMode = (message) => {
    setRunning(false);
    setWarning(message);
    clearTimeout(warningTimer.current);
    warningTimer.current = window.setTimeout(() => setWarning(''), 5000);
  };

  useEffect(() => {
    if (!running || secondsLeft <= 0) return undefined;

    const handleBeforeUnload = (event) => {
      stopFocusMode('Focus mode stopped because you attempted to close or reload the window.');
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopFocusMode('Focus mode stopped because you switched tabs.');
      }
    };

    const handleWindowBlur = () => {
      if (running) {
        stopFocusMode('Focus mode stopped because you switched away from the window.');
      }
    };

    const handleMouseMove = () => {
      if (!running) return;
      const now = Date.now();
      if (now - lastMouseMove.current < 500) {
        mouseMoveStreak.current += 1;
      } else {
        mouseMoveStreak.current = 0;
      }
      lastMouseMove.current = now;

      if (mouseMoveStreak.current >= 12) {
        showWarning('Too much mouse activity detected during focus mode. Keep your movements calm.');
        mouseMoveStreak.current = 0;
      }
    };

    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(t);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(warningTimer.current);
    };
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
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {[25, 45, 15].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setMinutes(n); setSecondsLeft(n * 60); setRunning(false); }}
              disabled={running}
              className={`px-4 py-2 rounded-xl text-sm border transition disabled:opacity-50 ${
                minutes === n ? 'border-violet-500 bg-violet-500/20 text-violet-200' : 'border-slate-600 text-slate-400'
              }`}
            >
              {n} min
            </button>
          ))}
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2">
            <span className="text-sm text-slate-400">Custom:</span>
            <input
              type="number"
              min="1"
              max="120"
              value={minutes}
              disabled={running}
              onChange={(event) => {
                const value = Math.max(1, Math.min(120, Number(event.target.value) || 1));
                setMinutes(value);
                setSecondsLeft(value * 60);
              }}
              className="w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-right text-white focus:outline-none"
            />
            <span className="text-sm text-slate-400">min</span>
          </div>
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
        {running && (
          <p className="mt-4 text-sm text-amber-300">
            Focus mode is active. Do not close the browser or switch tabs until the timer finishes.
          </p>
        )}
        {warning && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {warning}
          </div>
        )}
      </div>
    </FeaturePageShell>
  );
}
