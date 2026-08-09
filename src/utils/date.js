export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function daysBetween(fromKey, toKey) {
  const from = new Date(fromKey + 'T00:00:00')
  const to = new Date(toKey + 'T00:00:00')
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function formatShortDate(dateKey) {
  if (!dateKey) return ''
  const d = new Date(dateKey + 'T00:00:00')
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export function formatMonthDay(dateKey) {
  if (!dateKey) return ''
  const d = new Date(dateKey + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function addDays(dateKey, n) {
  const d = new Date(dateKey + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return todayKey(d)
}

export function lastNDays(n, endKey = todayKey()) {
  const keys = []
  for (let i = n - 1; i >= 0; i--) {
    keys.push(addDays(endKey, -i))
  }
  return keys
}

export function leaveDDay(leaveDate, today = todayKey()) {
  if (!leaveDate) return null
  const diff = daysBetween(today, leaveDate)
  if (diff < 0) return { expired: true, diff }
  if (diff === 0) return { expired: false, diff: 0, isToday: true }
  return { expired: false, diff, isToday: false }
}
