import { useEffect } from "react";
import axios from "axios";

export default function useActivityTracker() {
  useEffect(() => {
    const token = localStorage.getItem("learnhub_token");

    if (!token) return;

    const interval = setInterval(async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/streak/record-activity`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Activity tracking failed");
      }
    }, 300000); // every 5 minutes

    return () => clearInterval(interval);
  }, []);
}