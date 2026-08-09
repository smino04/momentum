let ctx = null

function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playCelebrationSound() {
  try {
    const audioCtx = getCtx()
    if (!audioCtx) return
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = audioCtx.currentTime + i * 0.09
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.36)
    })
  } catch {
    // ignore — audio is a non-critical enhancement
  }
}
