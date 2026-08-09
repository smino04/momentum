import { lastNDays, addDays, daysBetween } from './date'

const MIN_100PCT_HABIT_COUNT = 2
const SUCCESS_RATIO = 0.8

function habitsActiveOn(habits, dayKey) {
  return habits.filter((h) => h.active !== false && (!h.createdAt || h.createdAt <= dayKey))
}

export function isDayComplete(dailyLogs, habits, dayKey) {
  const activeHabits = habitsActiveOn(habits, dayKey)
  if (activeHabits.length === 0) return false
  const log = dailyLogs[dayKey] || {}
  const completed = activeHabits.filter((h) => log[h.id]).length
  const requiredRatio = activeHabits.length <= MIN_100PCT_HABIT_COUNT ? 1 : SUCCESS_RATIO
  return completed / activeHabits.length >= requiredRatio
}

export function todayCompletionRate(dailyLogs, habits, dayKey) {
  const activeHabits = habitsActiveOn(habits, dayKey)
  if (activeHabits.length === 0) return 0
  const log = dailyLogs[dayKey] || {}
  const completed = activeHabits.filter((h) => log[h.id]).length
  return completed / activeHabits.length
}

export function calcMomentum(dailyLogs, habits, endKey) {
  const days = lastNDays(30, endKey)
  let possible = 0
  let completed = 0

  for (const day of days) {
    const activeHabits = habitsActiveOn(habits, day)
    const log = dailyLogs[day]
    for (const habit of activeHabits) {
      possible += 1
      if (log && log[habit.id]) completed += 1
    }
  }

  if (possible === 0) return 0
  return Math.round((completed / possible) * 100)
}

export function calculateCurrentStreak(dailyLogs, habits, todayKey) {
  const activeHabits = habitsActiveOn(habits, todayKey)
  if (activeHabits.length === 0) return { streak: 0, todayDone: false }

  const todayDone = isDayComplete(dailyLogs, habits, todayKey)
  let streak = 0
  let cursor = todayDone ? todayKey : addDays(todayKey, -1)

  while (isDayComplete(dailyLogs, habits, cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return { streak, todayDone }
}

function firstLogDate(dailyLogs) {
  const keys = Object.keys(dailyLogs).filter((k) => Object.values(dailyLogs[k] || {}).some(Boolean))
  if (keys.length === 0) return null
  return keys.sort()[0]
}

export function calculateBestStreak(dailyLogs, habits, todayKey) {
  const start = firstLogDate(dailyLogs)
  if (!start) return 0

  let best = 0
  let running = 0
  let cursor = start
  while (cursor <= todayKey) {
    if (isDayComplete(dailyLogs, habits, cursor)) {
      running += 1
      best = Math.max(best, running)
    } else {
      running = 0
    }
    cursor = addDays(cursor, 1)
  }
  return best
}

export function calcLifetimeCompletion(dailyLogs, habits, todayKey) {
  const start = firstLogDate(dailyLogs)
  if (!start) return { rate: 0, successDays: 0, totalDays: 0 }

  let successDays = 0
  const totalDays = daysBetween(start, todayKey) + 1
  let cursor = start
  while (cursor <= todayKey) {
    if (isDayComplete(dailyLogs, habits, cursor)) successDays += 1
    cursor = addDays(cursor, 1)
  }
  return { rate: totalDays === 0 ? 0 : Math.round((successDays / totalDays) * 100), successDays, totalDays }
}
