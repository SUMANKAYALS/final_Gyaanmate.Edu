import User from '../models/User.js';
import { updateStreakFromActivity, getStreakCalendarData, hasValidActivityToday, REQUIRED_DAILY_MINUTES } from '../services/streakService.js';

/**
 * Update user streak from activity
 * Called periodically from frontend
 */
export const recordActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await updateStreakFromActivity(user);
    await user.save();

    res.json({
      streak: user.streak,
      message: 'Activity recorded',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording activity', error: error.message });
  }
};

/**
 * Get user's streak information with calendar
 */
export const getStreakData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const calendar = getStreakCalendarData(user);
    const isActiveToday = hasValidActivityToday(user);

    res.json({
      currentStreak: user.streak?.currentStreak || 0,
      longestStreak: user.streak?.longestStreak || 0,
      totalMinutesActive: user.streak?.totalMinutesActive || 0,
      lastActivityDate: user.streak?.lastActivityDate,
      isActiveToday,
      requiredDailyMinutes: REQUIRED_DAILY_MINUTES,
      calendar,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching streak data', error: error.message });
  }
};

/**
 * Get next milestone based on current streak
 */
export const getNextMilestone = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentStreak = user.streak?.currentStreak || 0;
    
    let nextMilestone = 7;
    if (currentStreak >= 7) nextMilestone = 30;
    if (currentStreak >= 30) nextMilestone = 100;
    if (currentStreak >= 100) nextMilestone = 365;

    res.json({
      currentStreak,
      nextMilestone,
      daysRemaining: nextMilestone - currentStreak,
      achievements: {
        sevenDay: currentStreak >= 7,
        thirtyDay: currentStreak >= 30,
        hundredDay: currentStreak >= 100,
        yearDay: currentStreak >= 365,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching milestone data', error: error.message });
  }
};

/**
 * Reset streak (admin only or for testing)
 */
export const resetStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.streak = {
      currentStreak: 0,
      longestStreak: user.streak?.longestStreak || 0,
      lastActivityDate: null,
      totalMinutesActive: 0,
      streakCalendar: [],
    };

    await user.save();
    res.json({ message: 'Streak reset successfully', streak: user.streak });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting streak', error: error.message });
  }
};

export default {
  recordActivity,
  getStreakData,
  getNextMilestone,
  resetStreak,
};
