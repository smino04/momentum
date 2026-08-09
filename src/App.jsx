import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Splash from './components/Splash'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Progress from './pages/Progress'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import { useAppData } from './utils/useAppData'

export default function App() {
  const { data, update, reset } = useAppData()
  const [tab, setTab] = useState('home')
  const [refreshTick, setRefreshTick] = useState(0)

  function navigate(tabId) {
    setTab(tabId)
    setRefreshTick((n) => n + 1)
  }

  function refresh() {
    setRefreshTick((n) => n + 1)
  }

  if (!data.onboarded) {
    return (
      <>
        <Splash />
        <Onboarding
          onComplete={({ leaveDate, habits, profile, weightLogs }) => {
            update((prev) => ({
              ...prev,
              onboarded: true,
              leaveDate,
              outings: leaveDate
                ? [{ id: `outing-${leaveDate}`, type: '휴가', startDate: leaveDate, endDate: leaveDate }]
                : [],
              habits,
              profile: { ...prev.profile, ...profile },
              weightLogs,
            }))
          }}
        />
      </>
    )
  }

  const pageKey = `${tab}-${refreshTick}`

  return (
    <>
      <Splash />
      <div className="mx-auto min-h-dvh max-w-md">
        <div key={pageKey} className="page-transition">
          {tab === 'home' && <Home data={data} update={update} onRefresh={refresh} />}
          {tab === 'progress' && <Progress data={data} update={update} onRefresh={refresh} />}
          {tab === 'calendar' && <Calendar data={data} update={update} onRefresh={refresh} />}
          {tab === 'settings' && (
            <Settings data={data} update={update} onReset={reset} onNavigate={navigate} onRefresh={refresh} />
          )}
        </div>
        <BottomNav active={tab} onChange={navigate} />
      </div>
    </>
  )
}
