import { useState } from 'react'
import { Trash2, Moon, Sun, Plus, X, ChevronUp, ChevronDown, Pencil, ChevronRight, ChevronLeft, User, Palette, ListChecks, Database } from 'lucide-react'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { APP_NAME, APP_TAGLINE, HABIT_EMOJI_CHOICES, CUSTOM_HABIT_GROUP } from '../utils/constants'
import { todayKey, formatShortDate } from '../utils/date'
import { getNextOuting } from '../utils/outings'
import { useBackClose } from '../utils/useBackClose'
import { showToast } from '../utils/toast'

export default function Settings({ data, update, onReset, onNavigate, onRefresh }) {
  const [view, setView] = useState('root')
  useBackClose(view !== 'root', () => setView('root'))
  const isLight = data.theme === 'light'
  const nextOuting = getNextOuting(data.outings, todayKey())

  const activeHabits = data.habits
    .filter((h) => h.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  if (view === 'theme') {
    return (
      <div key="theme" className="page-shell page-transition">
        <SubHeader title="화면 모드" onBack={() => setView('root')} />
        <ThemeView data={data} update={update} isLight={isLight} />
      </div>
    )
  }

  if (view === 'profile') {
    return (
      <div key="profile" className="page-shell page-transition">
        <SubHeader title="프로필" onBack={() => setView('root')} />
        <ProfileView data={data} update={update} />
      </div>
    )
  }

  if (view === 'habits') {
    return (
      <div key="habits" className="page-shell page-transition">
        <SubHeader title="관리 항목" onBack={() => setView('root')} />
        <HabitsView data={data} update={update} activeHabits={activeHabits} />
      </div>
    )
  }

  if (view === 'data') {
    return (
      <div key="data" className="page-shell page-transition">
        <SubHeader title="데이터" onBack={() => setView('root')} />
        <DataView onReset={onReset} />
      </div>
    )
  }

  return (
    <div key="root" className="page-shell page-transition">
      <PageHeader title="설정" onClick={onRefresh} />
      <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
        {APP_NAME}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-3)' }}>
        {APP_TAGLINE}
      </p>

      <div className="mt-8 flex flex-col gap-2">
        <MenuRow
          icon={Palette}
          label="화면 모드"
          desc={isLight ? '라이트 모드' : '다크 모드'}
          onClick={() => setView('theme')}
        />
        <MenuRow
          icon={User}
          label="프로필"
          desc={data.profile.name || '이름 미설정'}
          onClick={() => setView('profile')}
        />
        <MenuRow
          icon={Sun}
          label="휴가·외출·외박"
          desc={nextOuting ? `다음 ${nextOuting.type} · ${formatShortDate(nextOuting.startDate)}` : '등록된 일정 없음'}
          onClick={() => onNavigate?.('calendar')}
        />
        <MenuRow
          icon={ListChecks}
          label="관리 항목"
          desc={`${activeHabits.length}개`}
          onClick={() => setView('habits')}
        />
        <MenuRow icon={Database} label="데이터" desc="백업 · 초기화" onClick={() => setView('data')} />
      </div>
    </div>
  )
}

function SubHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onBack}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full active:opacity-60"
        style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
      >
        <ChevronLeft size={18} />
      </button>
      <h1 className="text-[26px] font-extrabold" style={{ color: 'var(--text)' }}>
        {title}
      </h1>
    </div>
  )
}

function MenuRow({ icon: Icon, label, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[15px] font-medium" style={{ color: 'var(--text)' }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>
          {desc}
        </p>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-4)' }} />
    </button>
  )
}

function ThemeView({ data, update, isLight }) {
  function setTheme(theme) {
    update((prev) => ({ ...prev, theme }))
  }

  return (
    <div className="mt-8 flex gap-2">
      <ThemeButton active={!isLight} onClick={() => setTheme('dark')} icon={Moon} label="다크 모드" />
      <ThemeButton active={isLight} onClick={() => setTheme('light')} icon={Sun} label="라이트 모드" />
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

function ProfileView({ data, update }) {
  function updateProfileField(field, value) {
    update((prev) => ({ ...prev, profile: { ...prev.profile, [field]: value } }))
  }

  return (
    <div className="mt-8">
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
    </div>
  )
}

function HabitsView({ data, update, activeHabits }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formLabel, setFormLabel] = useState('')
  const [formEmoji, setFormEmoji] = useState(HABIT_EMOJI_CHOICES[0])

  function openAddForm() {
    setEditingId(null)
    setFormLabel('')
    setFormEmoji(HABIT_EMOJI_CHOICES[0])
    setFormOpen(true)
  }

  function openEditForm(habit) {
    setEditingId(habit.id)
    setFormLabel(habit.label)
    setFormEmoji(habit.emoji)
    setFormOpen(true)
  }

  function saveHabitForm() {
    const label = formLabel.trim()
    if (!label) return

    if (editingId) {
      update((prev) => ({
        ...prev,
        habits: prev.habits.map((h) => (h.id === editingId ? { ...h, label, emoji: formEmoji } : h)),
      }))
    } else {
      const maxOrder = activeHabits.reduce((max, h) => Math.max(max, h.order ?? 0), -1)
      const habit = {
        id: `custom-${Date.now()}`,
        label,
        emoji: formEmoji,
        group: CUSTOM_HABIT_GROUP,
        order: maxOrder + 1,
        active: true,
        createdAt: todayKey(),
      }
      update((prev) => ({ ...prev, habits: [...prev.habits, habit] }))
      showToast('관리항목을 추가했어요')
    }
    setFormOpen(false)
  }

  function confirmDeleteHabit() {
    update((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === deleteTarget ? { ...h, active: false } : h)),
    }))
    setDeleteTarget(null)
    showToast('관리항목을 삭제했어요')
  }

  function moveHabit(id, direction) {
    const idx = activeHabits.findIndex((h) => h.id === id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= activeHabits.length) return
    const a = activeHabits[idx]
    const b = activeHabits[swapIdx]
    const aOrder = a.order ?? idx
    const bOrder = b.order ?? swapIdx
    update((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === a.id) return { ...h, order: bOrder }
        if (h.id === b.id) return { ...h, order: aOrder }
        return h
      }),
    }))
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-2">
        {activeHabits.map((h, idx) => (
          <div
            key={h.id}
            className="flex items-center gap-1 rounded-2xl border px-2 py-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
          >
            <div className="flex flex-col">
              <button
                onClick={() => moveHabit(h.id, -1)}
                disabled={idx === 0}
                style={{ color: 'var(--text-4)' }}
                className="disabled:opacity-20"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => moveHabit(h.id, 1)}
                disabled={idx === activeHabits.length - 1}
                style={{ color: 'var(--text-4)' }}
                className="disabled:opacity-20"
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <button
              onClick={() => openEditForm(h)}
              className="flex flex-1 items-center gap-2 px-2 py-1.5 text-left text-[15px]"
              style={{ color: 'var(--text)' }}
            >
              <span>{h.emoji}</span>
              {h.label}
              <Pencil size={12} style={{ color: 'var(--text-4)' }} />
            </button>
            <button onClick={() => setDeleteTarget(h.id)} className="p-2" style={{ color: 'var(--text-4)' }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={openAddForm}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-3.5 text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
      >
        <Plus size={16} />
        관리항목 추가
      </button>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? '항목 수정' : '항목 추가'}>
        <input
          autoFocus
          value={formLabel}
          onChange={(e) => setFormLabel(e.target.value)}
          placeholder="항목 이름 (예: 자기 전 독서)"
          className="input-field"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {HABIT_EMOJI_CHOICES.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setFormEmoji(emoji)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border text-lg"
              style={{
                borderColor: formEmoji === emoji ? 'var(--color-accent)' : 'var(--border)',
                background:
                  formEmoji === emoji
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
            onClick={() => setFormOpen(false)}
            className="flex-1 rounded-2xl border py-3 text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            취소
          </button>
          <button
            onClick={saveHabitForm}
            disabled={!formLabel.trim()}
            className="flex-1 rounded-2xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-30"
          >
            {editingId ? '저장' : '추가'}
          </button>
        </div>
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="이 관리항목을 삭제할까요?">
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          기존 기록은 유지됩니다.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 rounded-2xl border py-4"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            취소
          </button>
          <button onClick={confirmDeleteHabit} className="flex-1 rounded-2xl bg-red-500 py-4 font-semibold text-white">
            삭제
          </button>
        </div>
      </Modal>
    </div>
  )
}

function DataView({ onReset }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="mt-8">
      <button
        onClick={() => setConfirmOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-4 text-red-400"
      >
        <Trash2 size={16} />
        모든 데이터 초기화
      </button>

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
              showToast('모든 데이터를 초기화했어요')
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
