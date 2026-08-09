const MIN_SAMPLES = 3

export function calcConditionInsight(dailyLogs, conditionLogs, habits, group, fieldId) {
  const groupHabits = habits.filter((h) => h.group === group && h.active !== false)
  if (groupHabits.length === 0) return null

  const good = []
  const bad = []

  for (const entry of conditionLogs) {
    const value = entry[fieldId]
    if (typeof value !== 'number') continue

    const activeOnDate = groupHabits.filter((h) => !h.createdAt || h.createdAt <= entry.date)
    if (activeOnDate.length === 0) continue

    const log = dailyLogs[entry.date] || {}
    const completed = activeOnDate.filter((h) => log[h.id]).length
    const ratio = completed / activeOnDate.length
    const threshold = activeOnDate.length <= 2 ? 1 : 0.8

    if (ratio >= threshold) good.push(value)
    else bad.push(value)
  }

  if (good.length < MIN_SAMPLES || bad.length < MIN_SAMPLES) {
    return { ready: false, groupHabits, goodCount: good.length, badCount: bad.length, needed: MIN_SAMPLES }
  }

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  const goodAvg = avg(good)
  const badAvg = avg(bad)
  const diffPct = badAvg === 0 ? 0 : Math.round(((goodAvg - badAvg) / badAvg) * 100)

  return { ready: true, groupHabits, goodAvg, badAvg, diffPct, goodCount: good.length, badCount: bad.length }
}
