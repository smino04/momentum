import { useMemo } from 'react'
import Countdown from '../components/Countdown'
import HabitList from '../components/HabitList'
import MomentumCard from '../components/MomentumCard'
import RecoveryCard from '../components/RecoveryCard'
import { todayKey, formatMonthDay, leaveDDay, addDays } from '../utils/date'
import { calcMomentum, todayCompletionRate } from '../utils/momentum'

export default function Home({ data, update }) {
  const today = todayKey()
  const dday = leaveDDay(data.leaveDate, today)

  const log = data.dailyLogs[today] || {}
  const recoveryLog = log.__recovery || {}

  const momentum = useMemo(() => calcMomentum(data.dailyLogs, data.habits, today), [data.dailyLogs, data.habits])
  const momentumPrev = useMemo(
    () => calcMomentum(data.dailyLogs, data.habits, addDays(today, -30)),
    [data.dailyLogs, data.habits]
  )
  const delta = momentum - momentumPrev

  const completion = todayCompletionRate(data.dailyLogs, data.habits, today)
  const showRecovery = completion <= 0.4

  function toggleHabit(habitId) {
    update((prev) => {
      const dayLog = { ...(prev.dailyLogs[today] || {}) }
      dayLog[habitId] = !dayLog[habitId]
      return { ...prev, dailyLogs: { ...prev.dailyLogs, [today]: dayLog } }
    })
  }

  function toggleRecovery(itemId) {
    update((prev) => {
      const dayLog = { ...(prev.dailyLogs[today] || {}) }
      const rec = { ...(dayLog.__recovery || {}) }
      rec[itemId] = !rec[itemId]
      dayLog.__recovery = rec
      return { ...prev, dailyLogs: { ...prev.dailyLogs, [today]: dayLog } }
    })
  }

  if (dday?.isToday) {
    return <LeaveDayView data={data} today={today} />
  }

  return (
    <div className="px-6 pb-28 pt-8">
      <Countdown leaveDate={data.leaveDate} dday={dday} />

      <div className="mt-10">
        <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
          ☀️ 오늘 · {formatMonthDay(today)}
        </p>
        <HabitList habits={data.habits} log={log} onToggle={toggleHabit} />
      </div>

      {showRecovery && <RecoveryCard recoveryLog={recoveryLog} onToggle={toggleRecovery} />}

      <div className="mt-8">
        <MomentumCard momentum={momentum} delta={delta} />
      </div>
    </div>
  )
}

function LeaveDayView({ data, today }) {
  const momentumNow = calcMomentum(data.dailyLogs, data.habits, today)
  const momentum30ago = calcMomentum(data.dailyLogs, data.habits, addDays(today, -30))

  const sortedWeights = [...data.weightLogs].sort((a, b) => a.date.localeCompare(b.date))
  const recentWeights = sortedWeights.filter((w) => w.date >= addDays(today, -30))
  const weightStart = recentWeights[0]?.weight
  const weightEnd = recentWeights[recentWeights.length - 1]?.weight

  const firstPhoto = [...data.photos].sort((a, b) => a.date.localeCompare(b.date))[0]
  const lastPhoto = [...data.photos].sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 pb-24 text-center">
      <p className="text-xs font-medium tracking-widest text-accent">🎉 휴가일</p>
      <p className="mt-2 text-4xl font-bold" style={{ color: 'var(--text)' }}>
        오늘입니다.
      </p>

      <div className="mt-10 rounded-[20px] p-6 text-left" style={{ background: 'var(--surface)' }}>
        <p className="text-xs tracking-widest" style={{ color: 'var(--text-3)' }}>
          지난 30일
        </p>
        <p className="mt-3 text-lg" style={{ color: 'var(--text)' }}>
          모멘텀 {momentum30ago} → <span className="font-bold text-accent">{momentumNow}</span>
        </p>
        {typeof weightStart === 'number' && typeof weightEnd === 'number' && (
          <p className="mt-2 text-lg" style={{ color: 'var(--text)' }}>
            체중 {weightStart}kg → <span className="font-bold text-accent">{weightEnd}kg</span>
          </p>
        )}
      </div>

      {firstPhoto && lastPhoto && firstPhoto.id !== lastPhoto.id && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="text-center">
            <img src={firstPhoto.dataUrl} className="h-40 w-32 rounded-2xl object-cover" />
            <p className="mt-1 text-[11px]" style={{ color: 'var(--text-3)' }}>
              이전
            </p>
          </div>
          <div className="text-center">
            <img src={lastPhoto.dataUrl} className="h-40 w-32 rounded-2xl object-cover" />
            <p className="mt-1 text-[11px]" style={{ color: 'var(--text-3)' }}>
              현재
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
