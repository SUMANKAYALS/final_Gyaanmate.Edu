import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/** Only guests (not signed in) may access — e.g. AI Note Converter trial. */
export default function GuestOnlyRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hasSession = !!(token || localStorage.getItem('learnhub_token') || user);

  if (hasSession) {
    return <Navigate to="/notes" replace />;
  }

  return children;
}
