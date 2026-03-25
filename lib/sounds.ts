export type SoundType = 'click' | 'pop' | 'typewriter' | 'nk-cream' | 'off'

const STORAGE_KEY = 'gorillatype-sound'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol: number = 0.05) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = vol
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

const sounds: Record<Exclude<SoundType, 'off'>, { key: () => void; error: () => void; complete: () => void }> = {
  click: {
    key: () => playTone(800, 0.04, 'sine', 0.03),
    error: () => playTone(200, 0.08, 'square', 0.04),
    complete: () => { playTone(523, 0.1, 'sine', 0.05); setTimeout(() => playTone(659, 0.1, 'sine', 0.05), 100); setTimeout(() => playTone(784, 0.15, 'sine', 0.05), 200) },
  },
  pop: {
    key: () => playTone(1200, 0.03, 'sine', 0.04),
    error: () => playTone(150, 0.1, 'sawtooth', 0.03),
    complete: () => { playTone(600, 0.12, 'sine', 0.06); setTimeout(() => playTone(900, 0.15, 'sine', 0.06), 120) },
  },
  typewriter: {
    key: () => playTone(400 + Math.random() * 200, 0.025, 'square', 0.02),
    error: () => playTone(120, 0.12, 'sawtooth', 0.04),
    complete: () => playTone(700, 0.2, 'triangle', 0.06),
  },
  'nk-cream': {
    key: () => { playTone(600 + Math.random() * 100, 0.02, 'triangle', 0.03); playTone(2000, 0.01, 'sine', 0.01) },
    error: () => playTone(180, 0.08, 'square', 0.03),
    complete: () => { playTone(523, 0.1, 'triangle', 0.05); setTimeout(() => playTone(784, 0.15, 'triangle', 0.05), 150) },
  },
}

export function getSoundPref(): SoundType {
  if (typeof window === 'undefined') return 'off'
  return (localStorage.getItem(STORAGE_KEY) as SoundType) || 'off'
}

export function setSoundPref(type: SoundType) {
  localStorage.setItem(STORAGE_KEY, type)
}

export function playKey() {
  const pref = getSoundPref()
  if (pref === 'off') return
  sounds[pref].key()
}

export function playError() {
  const pref = getSoundPref()
  if (pref === 'off') return
  sounds[pref].error()
}

export function playComplete() {
  const pref = getSoundPref()
  if (pref === 'off') return
  sounds[pref].complete()
}
