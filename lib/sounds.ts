export type SoundProfile = 'off' | 'click' | 'pop' | 'typewriter' | 'nk-cream' | 'beep' | 'mechanical' | 'bubble' | 'hitmarker'

export const soundProfiles: { key: SoundProfile; label: string }[] = [
  { key: 'off', label: 'Desligado' },
  { key: 'click', label: 'Click' },
  { key: 'pop', label: 'Pop' },
  { key: 'typewriter', label: 'Typewriter' },
  { key: 'nk-cream', label: 'NK Cream' },
  { key: 'beep', label: 'Beep' },
  { key: 'mechanical', label: 'Mechanical' },
  { key: 'bubble', label: 'Bubble' },
  { key: 'hitmarker', label: 'Hitmarker' },
]

// Per-event storage keys
const KEYS = {
  key: 'sharktype-sound-key',
  space: 'sharktype-sound-space',
  error: 'sharktype-sound-error',
  complete: 'sharktype-sound-complete',
} as const

export type SoundEvent = keyof typeof KEYS

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

function playNoise(duration: number, vol: number = 0.02) {
  const ctx = getCtx()
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * vol
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  gain.gain.value = 1
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start()
}

// ── Sound definitions per profile ─────────────────────────────────────────

type SoundFn = () => void
type ProfileSounds = { key: SoundFn; space: SoundFn; error: SoundFn; complete: SoundFn }

const profiles: Record<Exclude<SoundProfile, 'off'>, ProfileSounds> = {
  click: {
    key: () => playTone(800, 0.04, 'sine', 0.03),
    space: () => playTone(600, 0.05, 'sine', 0.025),
    error: () => playTone(200, 0.08, 'square', 0.04),
    complete: () => { playTone(523, 0.1, 'sine', 0.05); setTimeout(() => playTone(659, 0.1, 'sine', 0.05), 100); setTimeout(() => playTone(784, 0.15, 'sine', 0.05), 200) },
  },
  pop: {
    key: () => playTone(1200, 0.03, 'sine', 0.04),
    space: () => playTone(900, 0.04, 'sine', 0.035),
    error: () => playTone(150, 0.1, 'sawtooth', 0.03),
    complete: () => { playTone(600, 0.12, 'sine', 0.06); setTimeout(() => playTone(900, 0.15, 'sine', 0.06), 120) },
  },
  typewriter: {
    key: () => playTone(400 + Math.random() * 200, 0.025, 'square', 0.02),
    space: () => { playTone(300, 0.04, 'square', 0.02); playNoise(0.03, 0.015) },
    error: () => playTone(120, 0.12, 'sawtooth', 0.04),
    complete: () => playTone(700, 0.2, 'triangle', 0.06),
  },
  'nk-cream': {
    key: () => { playTone(600 + Math.random() * 100, 0.02, 'triangle', 0.03); playTone(2000, 0.01, 'sine', 0.01) },
    space: () => { playTone(400, 0.035, 'triangle', 0.025); playTone(1500, 0.015, 'sine', 0.008) },
    error: () => playTone(180, 0.08, 'square', 0.03),
    complete: () => { playTone(523, 0.1, 'triangle', 0.05); setTimeout(() => playTone(784, 0.15, 'triangle', 0.05), 150) },
  },
  beep: {
    key: () => playTone(1000, 0.02, 'square', 0.015),
    space: () => playTone(800, 0.03, 'square', 0.012),
    error: () => { playTone(300, 0.06, 'square', 0.03); playTone(250, 0.06, 'square', 0.03) },
    complete: () => { playTone(880, 0.08, 'square', 0.04); setTimeout(() => playTone(1100, 0.08, 'square', 0.04), 80); setTimeout(() => playTone(1320, 0.12, 'square', 0.04), 160) },
  },
  mechanical: {
    key: () => { playNoise(0.02, 0.04); playTone(500 + Math.random() * 300, 0.015, 'square', 0.015) },
    space: () => { playNoise(0.04, 0.05); playTone(350, 0.03, 'square', 0.02) },
    error: () => { playNoise(0.06, 0.03); playTone(150, 0.1, 'sawtooth', 0.035) },
    complete: () => { playNoise(0.03, 0.03); playTone(660, 0.1, 'triangle', 0.05); setTimeout(() => playTone(880, 0.15, 'triangle', 0.05), 120) },
  },
  bubble: {
    key: () => { const f = 1400 + Math.random() * 400; playTone(f, 0.06, 'sine', 0.025) },
    space: () => playTone(1000, 0.08, 'sine', 0.03),
    error: () => { playTone(300, 0.05, 'sine', 0.03); playTone(250, 0.05, 'sine', 0.03) },
    complete: () => { playTone(800, 0.1, 'sine', 0.05); setTimeout(() => playTone(1000, 0.1, 'sine', 0.05), 100); setTimeout(() => playTone(1200, 0.15, 'sine', 0.05), 200) },
  },
  hitmarker: {
    key: () => { playNoise(0.015, 0.06); playTone(3000, 0.01, 'square', 0.02) },
    space: () => { playNoise(0.025, 0.05); playTone(2500, 0.015, 'square', 0.015) },
    error: () => { playNoise(0.04, 0.04); playTone(200, 0.06, 'square', 0.04) },
    complete: () => { playNoise(0.02, 0.05); playTone(1500, 0.05, 'square', 0.03); setTimeout(() => { playNoise(0.02, 0.05); playTone(2000, 0.08, 'square', 0.03) }, 100) },
  },
}

// ── Preferences ───────────────────────────────────────────────────────────

const DEFAULTS: Record<SoundEvent, SoundProfile> = {
  key: 'pop',
  space: 'pop',
  error: 'hitmarker',
  complete: 'off',
}

export function getSoundPref(event: SoundEvent): SoundProfile {
  if (typeof window === 'undefined') return DEFAULTS[event]
  return (localStorage.getItem(KEYS[event]) as SoundProfile) || DEFAULTS[event]
}

export function setSoundPref(event: SoundEvent, profile: SoundProfile) {
  localStorage.setItem(KEYS[event], profile)
}

// Legacy: get/set all events at once
export function getAllSoundPrefs(): Record<SoundEvent, SoundProfile> {
  return { key: getSoundPref('key'), space: getSoundPref('space'), error: getSoundPref('error'), complete: getSoundPref('complete') }
}

export function setAllSoundPrefs(profile: SoundProfile) {
  for (const event of Object.keys(KEYS) as SoundEvent[]) {
    setSoundPref(event, profile)
  }
}

// ── Play functions ────────────────────────────────────────────────────────

function play(event: SoundEvent) {
  const pref = getSoundPref(event)
  if (pref === 'off') return
  profiles[pref][event]()
}

export function playKey() { play('key') }
export function playSpace() { play('space') }
export function playError() { play('error') }
export function playComplete() { play('complete') }

export function previewSound(event: SoundEvent, profile: SoundProfile) {
  if (profile === 'off') return
  profiles[profile][event]()
}

// Migrate old single-key storage
if (typeof window !== 'undefined') {
  const old = localStorage.getItem('gorillatype-sound') as SoundProfile | null
  if (old && old !== 'off') {
    if (!localStorage.getItem(KEYS.key)) {
      setAllSoundPrefs(old)
      localStorage.removeItem('gorillatype-sound')
    }
  }
}
