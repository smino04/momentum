import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Splash from './components/Splash'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Progress from './pages/Progress'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import { useAppData } from './utils/useAppData'
import { CURRENT_TAB_KEY } from './utils/constants'

export default function App() {
  const { data, update, reset } = useAppData()
  const [tab] = useState(() => localStorage.getItem(CURRENT_TAB_KEY) || 'home')

  function navigate(tabId) {
    localStorage.setItem(CURRENT_TAB_KEY, tabId)
    window.location.reload()
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

  return (
    <>
      <Splash />
      <div className="mx-auto min-h-screen max-w-md">
        {tab === 'home' && <Home data={data} update={update} onRefresh={() => navigate('home')} />}
        {tab === 'progress' && <Progress data={data} update={update} onRefresh={() => navigate('progress')} />}
        {tab === 'calendar' && <Calendar data={data} update={update} onRefresh={() => navigate('calendar')} />}
        {tab === 'settings' && (
          <Settings data={data} update={update} onReset={reset} onNavigate={navigate} onRefresh={() => navigate('settings')} />
        )}
        <BottomNav active={tab} />
      </div>
    </>
  )
}
