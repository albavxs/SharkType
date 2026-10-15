export const INTRO_TOUR_VERSION = 1
export const KEYBOARD_GUIDE_VERSION = 2

// Older builds kept the tour state of signed-out users here.
const LEGACY_PENDING_INTRO_TOUR_VERSION_KEY = 'sharktype-pending-intro-tour-version'

export function shouldShowIntroTour(versionSeen: number | null | undefined): boolean {
  return (versionSeen ?? 0) < INTRO_TOUR_VERSION
}

export function shouldShowKeyboardGuide(versionSeen: number | null | undefined): boolean {
  const seen = versionSeen ?? 0
  return seen >= INTRO_TOUR_VERSION && seen < KEYBOARD_GUIDE_VERSION
}

export function clearLegacyPendingIntroTourVersion() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(LEGACY_PENDING_INTRO_TOUR_VERSION_KEY)
  } catch {
    // ignore storage failures
  }
}
