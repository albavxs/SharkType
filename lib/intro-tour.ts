export const INTRO_TOUR_VERSION = 1
export const KEYBOARD_GUIDE_VERSION = 2
export const PENDING_INTRO_TOUR_VERSION_KEY = 'sharktype-pending-intro-tour-version'

export function shouldShowIntroTour(versionSeen: number | null | undefined): boolean {
  return (versionSeen ?? 0) < INTRO_TOUR_VERSION
}

export function shouldShowKeyboardGuide(versionSeen: number | null | undefined): boolean {
  const seen = versionSeen ?? 0
  return seen >= INTRO_TOUR_VERSION && seen < KEYBOARD_GUIDE_VERSION
}

export function getPendingIntroTourVersion(): number {
  if (typeof window === 'undefined') return 0

  try {
    const value = Number(window.localStorage.getItem(PENDING_INTRO_TOUR_VERSION_KEY) ?? '0')
    return Number.isFinite(value) ? Math.max(0, value) : 0
  } catch {
    return 0
  }
}

export function setPendingIntroTourVersion(versionSeen: number) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(PENDING_INTRO_TOUR_VERSION_KEY, String(Math.max(0, versionSeen)))
  } catch {
    // ignore storage failures
  }
}

export function clearPendingIntroTourVersion() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(PENDING_INTRO_TOUR_VERSION_KEY)
  } catch {
    // ignore storage failures
  }
}
