import { useState } from 'react'
import { APP_NAME } from '../utils/constants'
import { DEFAULT_HABITS } from '../utils/constants'
import { todayKey } from '../utils/date'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [leaveDate, setLeaveDate] = useState('')
  const [habits, setHabits] = useState(DEFAULT_HABITS.map((h) => ({ ...h })))
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [height, setHeight] = useState('')

  function toggleHabit(id) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)))
  }

  function finish() {
    onComplete({
      leaveDate,
      habits,
      profile: { name: '', height, weight, bodyFat },
      weightLogs: weight ? [{ date: todayKey(), weight: parseFloat(weight) }] : [],
    })
  }

  return (
    <div className="flex min-h-screen flex-col justify-between px-6 py-10">
      <div>
        <p className="text-xs font-medium tracking-widest text-white/30">{APP_NAME}</p>

        {step === 1 && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-2xl font-bold leading-snug text-white">다음 휴가는{'\n'}언제인가요?</h1>
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-lg text-white outline-none [color-scheme:dark]"
            />
          </div>
        )}

        {step === 2 && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-2xl font-bold leading-snug text-white">이번 휴가까지{'\n'}무엇을 관리할까요?</h1>
            <div className="mt-8 flex flex-col gap-2">
              {habits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                    h.enabled ? 'border-accent/40 bg-accent/10' : 'border-white/10 bg-white/[0.02]'
                  }`}
                >
                  <span className="text-[15px] text-white">{h.label}</span>
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
          </div>
        )}

        {step === 3 && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-2xl font-bold leading-snug text-white">현재 체중을{'\n'}알려주세요.</h1>
            <input
              type="number"
              inputMode="decimal"
              placeholder="예: 77.2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-lg text-white outline-none placeholder:text-white/25"
            />
            <p className="mt-6 mb-2 text-xs tracking-widest text-white/30">선택사항</p>
            <div className="flex gap-3">
              <input
                type="number"
                inputMode="decimal"
                placeholder="체지방률 %"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none placeholder:text-white/25"
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="키 cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none placeholder:text-white/25"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-16 animate-fade-in text-center">
            <p className="text-5xl">🌅</p>
            <p className="mt-4 text-3xl font-bold text-white">준비 완료.</p>
            <p className="mt-3 text-white/50">휴가까지 매일 쌓아보세요.</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-2xl border border-white/10 py-4 text-white/60"
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
