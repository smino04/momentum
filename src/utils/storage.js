import { DEFAULT_HABITS } from './constants'

const STORAGE_KEY = 'moment_app_data'

const DEFAULT_DATA = {
  onboarded: false,
  theme: 'dark',
  profile: { name: '', height: '', weight: '', bodyFat: '' },
  leaveDate: '',
  habits: DEFAULT_HABITS,
  dailyLogs: {},
  weightLogs: [],
  photos: [],
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_DATA)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(DEFAULT_DATA), ...parsed }
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
