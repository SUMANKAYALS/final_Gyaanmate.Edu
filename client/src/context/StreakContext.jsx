import { createContext, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const StreakContext = createContext();

export function StreakProvider({ children }) {
  const activityIntervalRef = useRef(null);
  const isUserActive = useRef(true);

  useEffect(() => {
    // Track user activity (mouse, keyboard, scroll)
    const handleActivity = () => {
      isUserActive.current = true;
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Record activity every minute
    activityIntervalRef.current = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token || !isUserActive.current) return;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/streak/record-activity`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Reset activity flag for next minute
        isUserActive.current = false;
      } catch (error) {
        console.error('Error recording activity:', error);
      }
    }, 60000); // Record every 60 seconds

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
    };
  }, []);

  return (
    <StreakContext.Provider value={{ isUserActive }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  return useContext(StreakContext);
}
