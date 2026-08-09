import { useState } from 'react'
import { Trash2, Moon, Sun, Plus, X } from 'lucide-react'
import Modal from '../components/Modal'
import { APP_NAME, APP_TAGLINE, HABIT_EMOJI_CHOICES, CUSTOM_HABIT_GROUP } from '../utils/constants'

export default function Settings({ data, update, onReset }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState(HABIT_EMOJI_CHOICES[0])
  const isLight = data.theme === 'light'

  function updateProfileField(field, value) {
    update((prev) => ({ ...prev, profile: { ...prev.profile, [field]: value } }))
  }

  function updateLeaveDate(value) {
    update((prev) => ({ ...prev, leaveDate: value }))
  }

  function toggleHabit(id) {
    update((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)),
    }))
  }

  function removeHabit(id) {
    update((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }))
  }

  function addHabit() {
    const label = newLabel.trim()
    if (!label) return
    const habit = {
      id: `custom-${Date.now()}`,
      label,
      emoji: newEmoji,
      group: CUSTOM_HABIT_GROUP,
      enabled: true,
    }
    update((prev) => ({ ...prev, habits: [...prev.habits, habit] }))
    setNewLabel('')
    setNewEmoji(HABIT_EMOJI_CHOICES[0])
    setShowAddForm(false)
  }

  function setTheme(theme) {
    update((prev) => ({ ...prev, theme }))
  }

  return (
    <div className="px-6 pb-28 pt-8">
      <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
        🙂 설정
      </p>
      <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text)' }}>
        {APP_NAME}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-3)' }}>
        {APP_TAGLINE}
      </p>

      <Section title="🌓 화면 모드">
        <div className="flex gap-2">
          <ThemeButton active={!isLight} onClick={() => setTheme('dark')} icon={Moon} label="다크 모드" />
          <ThemeButton active={isLight} onClick={() => setTheme('light')} icon={Sun} label="라이트 모드" />
        </div>
      </Section>

      <Section title="기본 정보">
        <Field label="이름">
          <input
            value={data.profile.name}
            onChange={(e) => updateProfileField('name', e.target.value)}
            placeholder="이름"
            className="input-field"
          />
        </Field>
        <Field label="키 (cm)">
          <input
            type="number"
            inputMode="decimal"
            value={data.profile.height}
            onChange={(e) => updateProfileField('height', e.target.value)}
            placeholder="예: 175"
            className="input-field"
          />
        </Field>
        <Field label="현재 체중 (kg)">
          <input
            type="number"
            inputMode="decimal"
            value={data.profile.weight}
            onChange={(e) => updateProfileField('weight', e.target.value)}
            placeholder="예: 77.2"
            className="input-field"
          />
        </Field>
        <Field label="체지방률 (%)">
          <input
            type="number"
            inputMode="decimal"
            value={data.profile.bodyFat}
            onChange={(e) => updateProfileField('bodyFat', e.target.value)}
            placeholder="예: 15"
            className="input-field"
          />
        </Field>
      </Section>

      <Section title="🌅 휴가">
        <Field label="다음 휴가 날짜">
          <input
            type="date"
            value={data.leaveDate}
            onChange={(e) => updateLeaveDate(e.target.value)}
            className="input-field"
            style={{ colorScheme: isLight ? 'light' : 'dark' }}
          />
        </Field>
      </Section>

      <Section title="✅ 관리 항목">
        <div className="flex flex-col gap-2">
          {data.habits.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-2xl border px-4 py-3.5"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
            >
              <span className="flex items-center gap-2 text-[15px]" style={{ color: 'var(--text)' }}>
                <span>{h.emoji}</span>
                {h.label}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleHabit(h.id)}
                  className="h-6 w-10 rounded-full p-0.5 transition-colors"
                  style={{ background: h.enabled ? 'var(--color-accent)' : 'var(--toggle-off)' }}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                      h.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button onClick={() => removeHabit(h.id)} style={{ color: 'var(--text-4)' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div
            className="mt-3 rounded-2xl border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
          >
            <input
              autoFocus
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="항목 이름 (예: 자기 전 독서)"
              className="input-field"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {HABIT_EMOJI_CHOICES.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewEmoji(emoji)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border text-lg"
                  style={{
                    borderColor: newEmoji === emoji ? 'var(--color-accent)' : 'var(--border)',
                    background:
                      newEmoji === emoji
                        ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)'
                        : 'transparent',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-2xl border py-3 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
              >
                취소
              </button>
              <button
                onClick={addHabit}
                disabled={!newLabel.trim()}
                className="flex-1 rounded-2xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-30"
              >
                추가
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-3.5 text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <Plus size={16} />
            항목 추가
          </button>
        )}
      </Section>

      <Section title="데이터">
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-4 text-red-400"
        >
          <Trash2 size={16} />
          모든 데이터 초기화
        </button>
      </Section>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="정말 초기화할까요?">
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          모든 기록, 체중, 사진, 설정이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setConfirmOpen(false)}
            className="flex-1 rounded-2xl border py-4"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            취소
          </button>
          <button
            onClick={() => {
              setConfirmOpen(false)
              onReset()
            }}
            className="flex-1 rounded-2xl bg-red-500 py-4 font-semibold text-white"
          >
            초기화
          </button>
        </div>
      </Modal>
    </div>
  )
}

function ThemeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-medium transition-colors"
      style={{
        borderColor: active ? 'var(--color-accent)' : 'var(--border)',
        background: active ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'var(--surface-soft)',
        color: active ? 'var(--color-accent)' : 'var(--text-2)',
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs" style={{ color: 'var(--text-4)' }}>
        {label}
      </p>
      {children}
    </div>
  )
}
