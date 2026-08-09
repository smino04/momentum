import { useEffect, useMemo, useRef, useState } from 'react'
import Countdown from '../components/Countdown'
import HabitList from '../components/HabitList'
import MomentumCard from '../components/MomentumCard'
import RecoveryCard from '../components/RecoveryCard'
import StreakBadge from '../components/StreakBadge'
import CelebrationModal from '../components/CelebrationModal'
import HabitDetailModal from '../components/HabitDetailModal'
import PageHeader from '../components/PageHeader'
import { todayKey, formatMonthDay, addDays } from '../utils/date'
import { calcMomentum, todayCompletionRate, calculateCurrentStreak } from '../utils/momentum'
import { getNextOuting, outingDday } from '../utils/outings'
import { STREAK_MILESTONE_MESSAGES } from '../utils/constants'

export default function Home({ data, update, onRefresh }) {
  const today = todayKey()
  const nextOuting = useMemo(() => getNextOuting(data.outings, today), [data.outings, today])
  const dday = outingDday(nextOuting, today)

  const log = data.dailyLogs[today] || {}
  const recoveryLog = log.__recovery || {}

  const momentum = useMemo(() => calcMomentum(data.dailyLogs, data.habits, today), [data.dailyLogs, data.habits])
  const momentumPrev = useMemo(
    () => calcMomentum(data.dailyLogs, data.habits, addDays(today, -30)),
    [data.dailyLogs, data.habits]
  )
  const delta = momentum - momentumPrev

  const { streak, todayDone } = useMemo(
    () => calculateCurrentStreak(data.dailyLogs, data.habits, today),
    [data.dailyLogs, data.habits]
  )

  const completion = todayCompletionRate(data.dailyLogs, data.habits, today)
  const showRecovery = completion <= 0.4

  const [celebration, setCelebration] = useState({ open: false })
  const [detailHabitId, setDetailHabitId] = useState(null)
  const detailHabit = data.habits.find((h) => h.id === detailHabitId) || null
  const prevTodayDoneRef = useRef(todayDone)
  const lossCheckedRef = useRef(false)

  useEffect(() => {
    if (lossCheckedRef.current) return
    lossCheckedRef.current = true
    const confirmedStreak = todayDone ? streak - 1 : streak
    if (data.lastSeenStreak > 0 && confirmedStreak === 0) {
      setCelebration({ open: true, kind: 'loss' })
      update((prev) => ({ ...prev, lastSeenStreak: 0 }))
    } else if (data.lastSeenStreak !== confirmedStreak) {
      update((prev) => ({ ...prev, lastSeenStreak: confirmedStreak }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!prevTodayDoneRef.current && todayDone) {
      setCelebration({ open: true, kind: 'complete', streak, milestoneMessage: STREAK_MILESTONE_MESSAGES[streak] })
      update((prev) => ({ ...prev, lastSeenStreak: streak }))
    }
    prevTodayDoneRef.current = todayDone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDone])

  function toggleHabit(habitId) {
    update((prev) => {
      const dayLog = { ...(prev.dailyLogs[today] || {}) }
      dayLog[habitId] = !dayLog[habitId]
      return { ...prev, dailyLogs: { ...prev.dailyLogs, [today]: dayLog } }
    })
  }

  function saveHabitEdit(fields) {
    update((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === detailHabitId ? { ...h, ...fields } : h)),
    }))
  }

  function deleteHabitFromDetail() {
    update((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === detailHabitId ? { ...h, active: false } : h)),
    }))
    setDetailHabitId(null)
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
    return <LeaveDayView data={data} today={today} outingType={nextOuting?.type ?? '휴가'} />
  }

  return (
    <div className="page-shell">
      <PageHeader title="홈" onClick={onRefresh} />

      <div className="mt-6">
        <Countdown date={nextOuting?.startDate} dday={dday} label={nextOuting?.type ?? '휴가'} />
      </div>

      <div className="mt-6">
        <StreakBadge streak={streak} todayDone={todayDone} />
      </div>

      <div className="mt-8">
        <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
          ☀️ 오늘 · {formatMonthDay(today)}
        </p>
        <HabitList
          habits={data.habits}
          log={log}
          onToggle={toggleHabit}
          dailyLogs={data.dailyLogs}
          today={today}
          onOpenDetail={(habit) => setDetailHabitId(habit.id)}
        />
      </div>

      {showRecovery && <RecoveryCard recoveryLog={recoveryLog} onToggle={toggleRecovery} />}

      <div className="mt-8">
        <MomentumCard momentum={momentum} delta={delta} />
      </div>

      <CelebrationModal
        open={celebration.open}
        onClose={() => setCelebration({ open: false })}
        kind={celebration.kind}
        streak={celebration.streak}
        milestoneMessage={celebration.milestoneMessage}
      />

      {detailHabit && (
        <HabitDetailModal
          habit={detailHabit}
          dailyLogs={data.dailyLogs}
          onClose={() => setDetailHabitId(null)}
          onSave={saveHabitEdit}
          onDelete={deleteHabitFromDetail}
        />
      )}
    </div>
  )
}

function LeaveDayView({ data, today, outingType }) {
  const momentumNow = calcMomentum(data.dailyLogs, data.habits, today)
  const momentum30ago = calcMomentum(data.dailyLogs, data.habits, addDays(today, -30))

  const sortedWeights = [...data.weightLogs].sort((a, b) => a.date.localeCompare(b.date))
  const recentWeights = sortedWeights.filter((w) => w.date >= addDays(today, -30))
  const weightStart = recentWeights[0]?.weight
  const weightEnd = recentWeights[recentWeights.length - 1]?.weight

  const firstPhoto = [...data.photos].sort((a, b) => a.date.localeCompare(b.date))[0]
  const lastPhoto = [...data.photos].sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <div
      className="app-shell flex flex-col justify-center px-6 pb-24 text-center"
      style={{ paddingTop: 'max(2rem, calc(env(safe-area-inset-top) + 0.75rem))' }}
    >
      <p className="text-xs font-medium tracking-widest text-accent">🎉 {outingType}일</p>
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
