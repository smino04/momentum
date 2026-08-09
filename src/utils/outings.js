import { todayKey, addDays, daysBetween } from './date'

export function getNextOuting(outings, today = todayKey()) {
  const upcoming = outings.filter((o) => o.endDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate))
  return upcoming[0] ?? null
}

export function sortOutingsAsc(outings) {
  return [...outings].sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function findOutingForDate(outings, dateKey) {
  return outings.find((o) => dateKey >= o.startDate && dateKey <= o.endDate) ?? null
}

export function outingDday(outing, today = todayKey()) {
  if (!outing) return null
  if (today >= outing.startDate && today <= outing.endDate) {
    return { expired: false, diff: 0, isToday: true, ongoing: outing.startDate !== outing.endDate }
  }
  const diff = daysBetween(today, outing.startDate)
  if (diff < 0) return { expired: true, diff }
  return { expired: false, diff, isToday: false }
}

export function defaultEndDate(type, startDate) {
  if (type === '외박') return addDays(startDate, 1)
  return startDate
}
