import { useEffect, useState } from 'react';
import { Loader2 } from '../lib/icons';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function AuthInitializer({ children }) {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const stored = localStorage.getItem('learnhub_token');
      if (!stored) {
        if (!cancelled) setReady(true);
        return;
      }

      try {
        const { data } = await authAPI.me();
        if (!cancelled) updateUser(data.user);
      } catch {
        if (!cancelled) logout({ notify: false });
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, logout, updateUser]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return children;
}
