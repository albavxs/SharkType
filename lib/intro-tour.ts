import { getStoredPendingVerificationEmail } from '@/lib/pending-verification'

export const INTRO_TOUR_VERSION = 1
export const KEYBOARD_GUIDE_VERSION = 2
export const PENDING_INTRO_TOUR_VERSION_KEY = 'sharktype-pending-intro-tour-version'

interface PendingIntroTourState {
  email: string
  versionSeen: number
}

function normalizeEmail(email: string | null | undefined): string {
  return email?.trim().toLowerCase() ?? ''
}

function readPendingIntroTourState(): PendingIntroTourState | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(PENDING_INTRO_TOUR_VERSION_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<PendingIntroTourState>
    const email = normalizeEmail(typeof parsed.email === 'string' ? parsed.email : null)
    const versionSeen = Number(parsed.versionSeen)

    if (!email || !Number.isFinite(versionSeen)) return null

    return {
      email,
      versionSeen: Math.max(0, versionSeen),
    }
  } catch {
    return null
  }
}

function migrateLegacyUnscopedVersion(email: string): number {
  if (typeof window === 'undefined') return 0

  try {
    const raw = window.localStorage.getItem(PENDING_INTRO_TOUR_VERSION_KEY)
    if (!raw) return 0

    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'number' || !Number.isFinite(parsed)) return 0

    const pendingEmail = getStoredPendingVerificationEmail()
    if (!pendingEmail || pendingEmail !== email) return 0

    const versionSeen = Math.max(0, parsed)
    const state: PendingIntroTourState = { email, versionSeen }
    window.localStorage.setItem(PENDING_INTRO_TOUR_VERSION_KEY, JSON.stringify(state))
    return versionSeen
  } catch {
    return 0
  }
}

export function shouldShowIntroTour(versionSeen: number | null | undefined): boolean {
  return (versionSeen ?? 0) < INTRO_TOUR_VERSION
}

export function shouldShowKeyboardGuide(versionSeen: number | null | undefined): boolean {
  const seen = versionSeen ?? 0
  return seen >= INTRO_TOUR_VERSION && seen < KEYBOARD_GUIDE_VERSION
}

export function getPendingIntroTourVersion(email?: string | null): number {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return 0

  const state = readPendingIntroTourState()
  if (state) {
    return state.email === normalizedEmail ? state.versionSeen : 0
  }

  return migrateLegacyUnscopedVersion(normalizedEmail)
}

export function setPendingIntroTourVersion(email: string, versionSeen: number) {
  if (typeof window === 'undefined') return

  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return

  try {
    const state: PendingIntroTourState = {
      email: normalizedEmail,
      versionSeen: Math.max(0, versionSeen),
    }
    window.localStorage.setItem(PENDING_INTRO_TOUR_VERSION_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

export function clearPendingIntroTourVersion(email?: string | null) {
  if (typeof window === 'undefined') return

  try {
    if (email) {
      const state = readPendingIntroTourState()
      if (state && state.email !== normalizeEmail(email)) return
    }

    window.localStorage.removeItem(PENDING_INTRO_TOUR_VERSION_KEY)
  } catch {
    // ignore storage failures
  }
}
