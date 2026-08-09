import { useState } from 'react'
import { APP_NAME } from '../utils/constants'
import { DEFAULT_HABITS } from '../utils/constants'
import { todayKey } from '../utils/date'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [leaveDate, setLeaveDate] = useState('')
  const [habits, setHabits] = useState(DEFAULT_HABITS.map((h) => ({ ...h, active: true })))
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [height, setHeight] = useState('')

  function toggleHabit(id) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, active: !h.active } : h)))
  }

  function finish() {
    const createdAt = todayKey()
    onComplete({
      leaveDate,
      habits: habits.map((h) => ({ ...h, createdAt })),
      profile: { name: '', height, weight, bodyFat },
      weightLogs: weight ? [{ date: createdAt, weight: parseFloat(weight) }] : [],
    })
  }

  return (
    <div
      className="flex min-h-dvh flex-col justify-between px-6"
      style={{
        paddingTop: 'max(2.5rem, calc(env(safe-area-inset-top) + 1rem))',
        paddingBottom: 'max(2.5rem, calc(env(safe-area-inset-bottom) + 1rem))',
      }}
    >
      <div>
        <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
          {APP_NAME}
        </p>

        {step === 1 && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-2xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
              다음 휴가는{'\n'}언제인가요?
            </h1>
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="input-field mt-8 py-4 text-lg"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        )}

        {step === 2 && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-2xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
              이번 휴가까지{'\n'}무엇을 관리할까요?
            </h1>
            <div className="mt-8 flex flex-col gap-2">
              {habits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className="flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors"
                  style={{
                    borderColor: h.active ? 'var(--color-accent)' : 'var(--border)',
                    background: h.active
                      ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)'
                      : 'var(--surface-soft)',
                  }}
                >
                  <span className="text-[15px]" style={{ color: 'var(--text)' }}>
                    {h.label}
                  </span>
                  <span
                    className="h-6 w-10 rounded-full p-0.5 transition-colors"
                    style={{ background: h.active ? 'var(--color-accent)' : 'var(--toggle-off)' }}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                        h.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-2xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
              현재 체중을{'\n'}알려주세요.
            </h1>
            <input
              type="number"
              inputMode="decimal"
              placeholder="예: 77.2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-field mt-8 py-4 text-lg"
            />
            <p className="mt-6 mb-2 text-xs tracking-widest" style={{ color: 'var(--text-3)' }}>
              선택사항
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                inputMode="decimal"
                placeholder="체지방률 %"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="input-field py-4"
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="키 cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input-field py-4"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-16 animate-fade-in text-center">
            <p className="text-5xl">🌅</p>
            <p className="mt-4 text-3xl font-bold" style={{ color: 'var(--text)' }}>
              준비 완료.
            </p>
            <p className="mt-3" style={{ color: 'var(--text-2)' }}>
              휴가까지 매일 쌓아보세요.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-2xl border py-4"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            이전
          </button>
        )}
        {step < 4 && (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && !leaveDate}
            className="flex-[2] rounded-2xl bg-accent py-4 font-semibold text-white disabled:opacity-30"
          >
            다음
          </button>
        )}
        {step === 4 && (
          <button onClick={finish} className="flex-1 rounded-2xl bg-accent py-4 font-semibold text-white">
            시작하기
          </button>
        )}
      </div>
    </div>
  )
}
