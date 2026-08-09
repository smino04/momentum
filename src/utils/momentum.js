import { lastNDays, addDays } from './date'

export function calcMomentum(dailyLogs, habits, endKey) {
  const enabledHabits = habits.filter((h) => h.enabled)
  if (enabledHabits.length === 0) return 0

  const days = lastNDays(30, endKey)
  let possible = 0
  let completed = 0

  for (const day of days) {
    const log = dailyLogs[day]
    for (const habit of enabledHabits) {
      possible += 1
      if (log && log[habit.id]) completed += 1
    }
  }

  if (possible === 0) return 0
  return Math.round((completed / possible) * 100)
}

export function calcMomentumAt(dailyLogs, habits, endKey) {
  return calcMomentum(dailyLogs, habits, endKey)
}

export function todayCompletionRate(dailyLogs, habits, dayKey) {
  const enabledHabits = habits.filter((h) => h.enabled)
  if (enabledHabits.length === 0) return 0
  const log = dailyLogs[dayKey] || {}
  const completed = enabledHabits.filter((h) => log[h.id]).length
  return completed / enabledHabits.length
}

export function activeDaysCount(dailyLogs, habits, endKey) {
  const days = lastNDays(30, endKey)
  let count = 0
  for (const day of days) {
    const log = dailyLogs[day]
    if (log && Object.values(log).some(Boolean)) count += 1
  }
  return count
}

function dayHasAnyCheck(dailyLogs, habitIds, dayKey) {
  const log = dailyLogs[dayKey]
  if (!log) return false
  return habitIds.some((id) => log[id])
}

export function calcStreak(dailyLogs, habits, todayKey) {
  const habitIds = habits.filter((h) => h.enabled).map((h) => h.id)
  if (habitIds.length === 0) return { streak: 0, todayDone: false }

  const todayDone = dayHasAnyCheck(dailyLogs, habitIds, todayKey)
  let streak = 0
  let cursor = todayDone ? todayKey : addDays(todayKey, -1)

  while (dayHasAnyCheck(dailyLogs, habitIds, cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return { streak, todayDone }
}
