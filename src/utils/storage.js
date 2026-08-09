import { DEFAULT_HABITS } from './constants'

const STORAGE_KEY = 'moment_app_data'

const DEFAULT_DATA = {
  onboarded: false,
  theme: 'dark',
  profile: { name: '', height: '', weight: '', bodyFat: '' },
  leaveDate: '',
  outings: [],
  habits: DEFAULT_HABITS,
  dailyLogs: {},
  weightLogs: [],
  conditionLogs: [],
  photos: [],
  lastSeenStreak: 0,
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_DATA)
    const parsed = JSON.parse(raw)
    const merged = { ...structuredClone(DEFAULT_DATA), ...parsed }

    if (merged.leaveDate && merged.outings.length === 0) {
      merged.outings = [{ id: 'legacy-leave', type: '휴가', date: merged.leaveDate }]
    }

    return merged
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY)
}
