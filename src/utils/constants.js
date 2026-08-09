export const APP_NAME = '말출'
export const APP_TAGLINE = '다음 휴가까지, 더 나은 나.'

export const DEFAULT_HABITS = [
  { id: 'skin', label: '피부관리', emoji: '🧴', group: '피부', order: 0, frequency: 'daily' },
  { id: 'workout', label: '운동', emoji: '🏋️', group: '신체', order: 1, frequency: 'daily' },
  { id: 'cardio', label: '유산소', emoji: '🏃', group: '신체', order: 2, frequency: 'everyOther' },
  { id: 'diet', label: '식단', emoji: '🥗', group: '신체', order: 3, frequency: 'daily' },
  { id: 'no_snack', label: '군것질 X', emoji: '🚫', group: '신체', order: 4, frequency: 'daily' },
  { id: 'sleep', label: '수면', emoji: '😴', group: '라이프스타일', order: 5, frequency: 'daily' },
  { id: 'posture', label: '자세', emoji: '🧍', group: '라이프스타일', order: 6, frequency: 'daily' },
  { id: 'grooming', label: '그루밍', emoji: '✂️', group: '그루밍', order: 7, frequency: 'everyOther' },
]

export const HABIT_FREQUENCIES = [
  { id: 'daily', label: '매일' },
  { id: 'everyOther', label: '격일' },
]

export const RECOVERY_ITEMS = [
  { id: 'wash', label: '세안', emoji: '💧' },
  { id: 'water', label: '물 마시기', emoji: '🥤' },
  { id: 'walk', label: '10분 걷기', emoji: '🌤️' },
]

export const ACCENT = '#FF7A45'

export const HABIT_EMOJI_CHOICES = [
  '🧴', '🏋️', '🏃', '🥗', '🚫', '😴', '🧍', '✂️', '💧', '📚', '🧘', '☀️', '🪥', '💊', '⭐',
]

export const CUSTOM_HABIT_GROUP = '기타'

export const OUTING_TYPES = [
  { id: '휴가', label: '휴가', emoji: '🏖️' },
  { id: '외출', label: '외출', emoji: '🚶' },
  { id: '외박', label: '외박', emoji: '🌙' },
]

export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 100]

export const CONDITION_FIELDS = [
  { id: 'skin', label: '피부 컨디션', emoji: '🧴', relatedGroup: '피부' },
  { id: 'body', label: '몸 상태', emoji: '💪', relatedGroup: '신체' },
]

export const CONDITION_SCALE = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
]

export const STREAK_MILESTONE_MESSAGES = {
  3: '3일을 만들었습니다.',
  7: '일주일을 만들었습니다.',
  14: '2주를 버텼습니다.',
  21: '3주째, 이제 습관입니다.',
  30: '30일 동안 자신을 관리했습니다.',
  50: '50일, 꾸준함이 무기입니다.',
  100: '100일. 완전히 달라졌습니다.',
}
