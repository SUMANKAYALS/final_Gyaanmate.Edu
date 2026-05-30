import { Link } from "react-router-dom";
import { FaFire, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import FeaturePageShell from "../../components/features/FeaturePageShell";
import { useEffect, useState } from "react";
import axios from "axios";


export default function GamifiedStreaks() {
  
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalMinutesActive: 0,
    isActiveToday: false,
    requiredDailyMinutes: 5,
    calendar: [],
  });
  const [milestone, setMilestone] = useState({
    nextMilestone: 7,
    daysRemaining: 7,
    achievements: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch streak data on mount
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("learnhub_token");
        if (!token) {
          setError("Please log in to view your streak");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/streak/data`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStreakData(response.data);

        // Fetch milestone data
        const milestoneResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/streak/milestone`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMilestone(milestoneResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching streak data:", err);
        setError(err.response?.data?.message || "Failed to load streak data");
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  // Group calendar data by week for LeetCode-style display
  const getCalendarGrid = () => {
    if (!streakData.calendar || streakData.calendar.length === 0) return [];

    const weeks = [];
    let currentWeek = [];

    // Calculate starting day (ensure we have a full calendar view)
    const totalDays = 365;
    const firstDayOfYear = new Date();
    firstDayOfYear.setDate(firstDayOfYear.getDate() - totalDays);

    // Find what day of week we start on
    const startingDayOfWeek = firstDayOfYear.getDay();

    // Add empty cells for days before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add all days
    streakData.calendar.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Fill remaining cells in the last week
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const getActivityColor = (level) => {
    switch (level) {
      case 0:
        return "bg-slate-700 hover:bg-slate-600";
      case 3:
        return "bg-green-700 hover:bg-green-600";
      case 2:
        return "bg-green-500 hover:bg-green-400";
      case 1:
        return "bg-green-300 hover:bg-green-200 text-gray-900";
      default:
        return "bg-slate-700 hover:bg-slate-600";
    }
  };


  const calendarWeeks = getCalendarGrid();

  if (loading) {
    return (
      <FeaturePageShell
        title="Gamified Streaks"
        subtitle="Build daily learning habits and stay consistent."
        icon={FaFire}
      >
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </FeaturePageShell>
    );
  }

  

  if (error) {
    return (
      <FeaturePageShell
        title="Gamified Streaks"
        subtitle="Build daily learning habits and stay consistent."
        icon={FaFire}
      >
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
          {error}
        </div>
      </FeaturePageShell>
    );
  }

  return (
    <FeaturePageShell
      title="Gamified Streaks"
      subtitle="Build daily learning habits and stay consistent."
      icon={FaFire}
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 text-5xl shadow-lg shadow-orange-500/30">
            🔥
          </div>

          <h2 className="text-6xl font-bold text-white mt-5">
            {streakData.currentStreak}
          </h2>

          <p className="text-slate-300 text-lg mt-2">
            Current Day Streak
            {streakData.isActiveToday && (
              <span className="ml-2 inline-block px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/50">
                Active Today ✓
              </span>
            )}
          </p>

          <p className="text-sm text-slate-500 mt-3 max-w-lg mx-auto">
            Spend at least {streakData.requiredDailyMinutes} active minutes learning every day to
            maintain your streak.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <FaFire />
              <span>Current Streak</span>
            </div>

            <p className="text-3xl font-bold text-white">
              {streakData.currentStreak} Days
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <FaTrophy />
              <span>Longest Streak</span>
            </div>

            <p className="text-3xl font-bold text-white">
              {streakData.longestStreak} Days
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <FaCalendarAlt />
              <span>Next Milestone</span>
            </div>

            <p className="text-3xl font-bold text-white">
              {milestone.nextMilestone}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {milestone.daysRemaining} days remaining
            </p>
          </div>
        </div>

        {/* LeetCode-style Contribution Calendar */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Learning Activity Calendar (Last 52 weeks)
          </h3>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-max">
              {/* Month labels */}
              <div className="flex gap-1 mb-4">
                {calendarWeeks.map((week, weekIdx) => {
                  const firstDayOfWeek = week.find((day) => day !== null);
                  const month = firstDayOfWeek
                    ? new Date(firstDayOfWeek.date).toLocaleDateString("en-US", {
                        month: "short",
                      })
                    : "";

                  return (
                    <div key={weekIdx} className="text-xs text-slate-400 w-6 text-center">
                      {month}
                    </div>
                  );
                })}
              </div>

              {/* Calendar grid */}
              <div className="flex gap-1">
                {calendarWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        title={
                          day
                            ? `${day.date}: ${day.minutesActive} minutes`
                            : "No data"
                        }
                        className={`h-6 w-6 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                          day
                            ? `${getActivityColor(day.level)}`
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 text-xs text-slate-400">
            <span>Activity Level:</span>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-slate-700" />
              <span>None</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-300" />
              
              <span>Low</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span>Medium</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-700" />
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">
            Achievement Badges
          </h3>

          <div className="grid md:grid-cols-4 gap-4">
            <div
              className={`${
                milestone.achievements.sevenDay
                  ? "bg-slate-800 border border-yellow-500/50"
                  : "bg-slate-900/50 opacity-50"
              } rounded-lg p-4 text-center transition-all`}
            >
              <div className="text-4xl">🥉</div>
              <p className={`mt-2 ${milestone.achievements.sevenDay ? "text-white" : "text-slate-400"}`}>
                7 Day Learner
              </p>
              {milestone.achievements.sevenDay && (
                <p className="text-xs text-yellow-400 mt-2">✓ Unlocked</p>
              )}
            </div>

            <div
              className={`${
                milestone.achievements.thirtyDay
                  ? "bg-slate-800 border border-gray-400/50"
                  : "bg-slate-900/50 opacity-50"
              } rounded-lg p-4 text-center transition-all`}
            >
              <div className="text-4xl">🥈</div>
              <p className={`mt-2 ${milestone.achievements.thirtyDay ? "text-white" : "text-slate-400"}`}>
                30 Day Master
              </p>
              {milestone.achievements.thirtyDay && (
                <p className="text-xs text-gray-400 mt-2">✓ Unlocked</p>
              )}
            </div>

            <div
              className={`${
                milestone.achievements.hundredDay
                  ? "bg-slate-800 border border-yellow-600/50"
                  : "bg-slate-900/50 opacity-50"
              } rounded-lg p-4 text-center transition-all`}
            >
              <div className="text-4xl">🥇</div>
              <p className={`mt-2 ${milestone.achievements.hundredDay ? "text-white" : "text-slate-400"}`}>
                100 Day Legend
              </p>
              {milestone.achievements.hundredDay && (
                <p className="text-xs text-yellow-600 mt-2">✓ Unlocked</p>
              )}
            </div>

            <div
              className={`${
                milestone.achievements.yearDay
                  ? "bg-slate-800 border border-purple-500/50"
                  : "bg-slate-900/50 opacity-50"
              } rounded-lg p-4 text-center transition-all`}
            >
              <div className="text-4xl">👑</div>
              <p className={`mt-2 ${milestone.achievements.yearDay ? "text-white" : "text-slate-400"}`}>
                365 Day Scholar
              </p>
              {milestone.achievements.yearDay && (
                <p className="text-xs text-purple-400 mt-2">✓ Unlocked</p>
              )}
            </div>
          </div>
        </div>

        {/* Streak Rules */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            How Streaks Work
          </h3>

          <div className="space-y-3 text-slate-300 text-sm">
            <div className="flex gap-3">
              <div className="text-green-400 font-bold flex-shrink-0">✅</div>
              <div>
                <p className="font-semibold text-white">Valid Streak Day</p>
                <p>Spend at least <strong>{streakData.requiredDailyMinutes} active minutes</strong> learning on GyaanMate to earn a streak for the day.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-green-400 font-bold flex-shrink-0">✅</div>
              <div>
                <p className="font-semibold text-white">What Counts as Activity</p>
                <p>Completing lessons, quizzes, notes, study sessions, watching videos, or participating in discussions all count toward your daily activity.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-orange-400 font-bold flex-shrink-0">🔥</div>
              <div>
                <p className="font-semibold text-white">Maintain Your Streak</p>
                <p>Complete at least {streakData.requiredDailyMinutes} minutes of activity every single day to keep your streak going. Missing even one day will break it.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-red-400 font-bold flex-shrink-0">❌</div>
              <div>
                <p className="font-semibold text-white">Streak Breaks</p>
                <p>If you miss a day and don't log at least {streakData.requiredDailyMinutes} minutes of activity, your current streak resets to 0. Your longest streak record is always preserved.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-yellow-400 font-bold flex-shrink-0">🏆</div>
              <div>
                <p className="font-semibold text-white">Milestones & Badges</p>
                <p>Reach 7 days (Learner), 30 days (Master), 100 days (Legend), or 365 days (Scholar) to unlock exclusive achievement badges.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-cyan-400 font-bold flex-shrink-0">📊</div>
              <div>
                <p className="font-semibold text-white">Activity Levels</p>
                <p>Light (1-4 min) → Medium (5-14 min) → High (15+ min). The calendar shows your daily activity intensity with different color shades.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <div>
            <p className="text-slate-400 text-sm">Total Minutes Active</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {streakData.totalMinutesActive}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {Math.floor(streakData.totalMinutesActive / 60)} hours and{" "}
              {streakData.totalMinutesActive % 60} minutes
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Consistency Score</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {streakData.longestStreak > 0 ? Math.round((streakData.currentStreak / streakData.longestStreak) * 100) : 0}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Current vs. Longest Streak
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/student/dashboard"
            className="btn-primary inline-flex mx-auto"
          >
            View Full Progress Dashboard
          </Link>
        </div>
      </div>
    </FeaturePageShell>
  );
}