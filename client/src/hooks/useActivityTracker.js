import { useEffect } from "react";
import api from "../services/api";

export default function useActivityTracker() {
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!localStorage.getItem("learnhub_token")) return;

      try {
        await api.post("/streak/record-activity");
      } catch (err) {
        console.error("Activity tracking failed");
      }
    }, 300000); // every 5 minutes

    return () => clearInterval(interval);
  }, []);
}
