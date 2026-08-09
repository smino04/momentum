import { todayKey } from './date'

export function getNextOuting(outings, today = todayKey()) {
  const upcoming = outings.filter((o) => o.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  return upcoming[0] ?? null
}

export function sortOutingsAsc(outings) {
  return [...outings].sort((a, b) => a.date.localeCompare(b.date))
}
