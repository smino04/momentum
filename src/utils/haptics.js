function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern)
  } catch {
    // iOS Safari has no Vibration API — ignore
  }
}

export function hapticTap() {
  vibrate(8)
}

export function hapticSuccess() {
  vibrate([12, 40, 16])
}

export function hapticMilestone() {
  vibrate([16, 30, 16, 30, 24])
}

const TAP_SELECTOR = 'button, [role="button"], input[type="checkbox"], .tap-haptic'

export function installGlobalHaptics() {
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse') return
      const target = e.target.closest?.(TAP_SELECTOR)
      if (target) hapticTap()
    },
    { passive: true },
  )
}
