import { DEFAULT_HABITS } from './constants'
import { addDays } from './date'

const STORAGE_KEY = 'moment_app_data'

const DEFAULT_DATA = {
  onboarded: false,
  theme: 'dark',
  profile: { name: '', height: '', weight: '', bodyFat: '' },
  leaveDate: '',
  dischargeDate: '',
  outings: [],
  habits: DEFAULT_HABITS,
  dailyLogs: {},
  weightLogs: [],
  conditionLogs: [],
  photos: [],
  lastSeenStreak: 0,
}

function migrateOuting(o) {
  if (o.startDate && o.endDate) return o
  const startDate = o.startDate ?? o.date
  const endDate = o.endDate ?? (o.type === '외박' ? addDays(startDate, 1) : startDate)
  return { id: o.id, type: o.type, startDate, endDate }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_DATA)
    const parsed = JSON.parse(raw)
    const merged = { ...structuredClone(DEFAULT_DATA), ...parsed }

    if (merged.leaveDate && merged.outings.length === 0) {
      merged.outings = [{ id: 'legacy-leave', type: '휴가', startDate: merged.leaveDate, endDate: merged.leaveDate }]
    }

    merged.outings = merged.outings.map(migrateOuting)
    merged.habits = merged.habits.map((h) => (h.frequency ? h : { ...h, frequency: 'daily' }))

    return merged
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    // Storage quota exceeded (e.g. too many photos) - the in-memory state
    // still reflects the latest change, just don't crash trying to persist it.
    return false
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY)
}
