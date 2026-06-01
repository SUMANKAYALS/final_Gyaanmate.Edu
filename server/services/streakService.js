export const REQUIRED_DAILY_MINUTES = 5; // 5 minutes required for valid streak

/**
 * Get today's date at midnight (start of day)
 */
const getTodayStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Get yesterday's date at midnight
 */
const getYesterdayStart = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Determine activity level based on minutes active
 * 0: none (0 minutes)
 * 1: light (1-4 minutes)
 * 2: medium (5-14 minutes)
 * 3: high (15+ minutes)
 */
const getActivityLevel = (minutes) => {
  if (minutes === 0) return 0;
  if (minutes < 5) return 1;
  if (minutes < 15) return 2;
  return 3;
};

/**
 * Update user streak based on activity
 * Returns updated streak information
 */
export const updateStreakFromActivity = async (user) => {
  if (!user.streak) {
    user.streak = {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      totalMinutesActive: 0,
      streakCalendar: [],
    };
  }

  const todayStart = getTodayStart();
  const yesterdayStart = getYesterdayStart();
  
  // Find today's activity record
  let todayRecord = user.streak.streakCalendar?.find((record) => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === todayStart.getTime();
  });

  const lastActivityDate = user.streak.lastActivityDate ? new Date(user.streak.lastActivityDate) : null;
  const lastActivityDateNormalized = lastActivityDate ? new Date(lastActivityDate.getTime()) : null;
  if (lastActivityDateNormalized) {
    lastActivityDateNormalized.setHours(0, 0, 0, 0);
  }

  // If today's record doesn't exist, initialize it
  if (!todayRecord) {
    todayRecord = {
      date: todayStart,
      minutesActive: 0,
      level: 0,
    };
    user.streak.streakCalendar = user.streak.streakCalendar || [];
    user.streak.streakCalendar.push(todayRecord);
  }

  // Increment today's activity
  todayRecord.minutesActive = (todayRecord.minutesActive || 0) + 5;
  todayRecord.level = getActivityLevel(todayRecord.minutesActive);

  // Update last activity date
  user.streak.lastActivityDate = new Date();

  // Check if we should update the streak
  const hasValidActivityToday = todayRecord.minutesActive >= REQUIRED_DAILY_MINUTES;

  // If no previous activity, start streak
  if (!lastActivityDateNormalized) {
    if (hasValidActivityToday) {
      user.streak.currentStreak = 1;
      user.streak.longestStreak = Math.max(1, user.streak.longestStreak);
    } else {
      user.streak.currentStreak = 0;
    }
  }
  // If last activity was today, streak continues if valid
  else if (lastActivityDateNormalized.getTime() === todayStart.getTime()) {
    if (!hasValidActivityToday) {
      user.streak.currentStreak = 0;
    }
  }
  // If last activity was yesterday
  else if (lastActivityDateNormalized.getTime() === yesterdayStart.getTime()) {
    if (hasValidActivityToday) {
      // Check if yesterday had valid activity
      const yesterdayRecord = user.streak.streakCalendar?.find((record) => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === yesterdayStart.getTime();
      });
      
      if (yesterdayRecord && yesterdayRecord.minutesActive >= REQUIRED_DAILY_MINUTES) {
        user.streak.currentStreak = (user.streak.currentStreak || 0) + 1;
        user.streak.longestStreak = Math.max(user.streak.currentStreak, user.streak.longestStreak);
      } else {
        user.streak.currentStreak = 1;
        if (user.streak.longestStreak === 0) {
          user.streak.longestStreak = 1;
        }
      }
    } else {
      // Break the streak
      user.streak.currentStreak = 0;
    }
  }
  // If more than a day has passed since last activity, streak is broken
  else {
    if (hasValidActivityToday) {
      user.streak.currentStreak = 1;
      user.streak.longestStreak = Math.max(1, user.streak.longestStreak);
    } else {
      user.streak.currentStreak = 0;
    }
  }

  // Update total minutes
  user.streak.totalMinutesActive = (user.streak.totalMinutesActive || 0) + 5;

  // Clean up old calendar entries (keep last 365 days)
  const thirteenMonthsAgo = new Date();
  thirteenMonthsAgo.setDate(thirteenMonthsAgo.getDate() - 365);
  user.streak.streakCalendar = user.streak.streakCalendar.filter(
    (record) => new Date(record.date) >= thirteenMonthsAgo
  );

  return user.streak;
};

/**
 * Get streak calendar data for display
 */
export const getStreakCalendarData = (user) => {
  const calendar = [];
  const todayStart = getTodayStart();
  
  // Generate last 365 days
  for (let i = 364; i >= 0; i--) {
    const date = new Date(todayStart);
    date.setDate(date.getDate() - i);
    
    const record = user.streak?.streakCalendar?.find((r) => {
      const rDate = new Date(r.date);
      rDate.setHours(0, 0, 0, 0);
      return rDate.getTime() === date.getTime();
    });

    calendar.push({
      date: date.toISOString().split('T')[0],
      minutesActive: record?.minutesActive || 0,
      level: record?.level || 0,
    });
  }

  return calendar;
};

/**
 * Check if user meets requirements for a valid streak
 */
export const hasValidActivityToday = (user) => {
  const todayStart = getTodayStart();
  const todayRecord = user.streak?.streakCalendar?.find((record) => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === todayStart.getTime();
  });

  return todayRecord && todayRecord.minutesActive >= REQUIRED_DAILY_MINUTES;
};

export default {
  updateStreakFromActivity,
  getStreakCalendarData,
  hasValidActivityToday,
  REQUIRED_DAILY_MINUTES,
};
