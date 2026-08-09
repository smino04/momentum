import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import { APP_NAME, APP_TAGLINE } from '../utils/constants'

export default function Profile({ data, update, onReset }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

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

  return (
    <div className="px-6 pb-28 pt-8">
      <p className="text-xs font-medium tracking-widest text-white/40">🙂 PROFILE</p>
      <p className="mt-1 text-2xl font-bold text-white">{APP_NAME}</p>
      <p className="text-sm text-white/40">{APP_TAGLINE}</p>

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
            className="input-field [color-scheme:dark]"
          />
        </Field>
      </Section>

      <Section title="✅ 관리 항목">
        <div className="flex flex-col gap-2">
          {data.habits.map((h) => (
            <button
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5"
            >
              <span className="flex items-center gap-2 text-[15px] text-white">
                <span>{h.emoji}</span>
                {h.label}
              </span>
              <span
                className={`h-6 w-10 rounded-full p-0.5 transition-colors ${
                  h.enabled ? 'bg-accent' : 'bg-white/15'
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                    h.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
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
        <p className="text-sm text-white/50">
          모든 기록, 체중, 사진, 설정이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setConfirmOpen(false)}
            className="flex-1 rounded-2xl border border-white/10 py-4 text-white/60"
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

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-xs font-medium tracking-widest text-white/40">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs text-white/30">{label}</p>
      {children}
    </div>
  )
}
