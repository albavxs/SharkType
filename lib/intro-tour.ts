export const INTRO_TOUR_VERSION = 1
export const KEYBOARD_GUIDE_VERSION = 2

export function shouldShowIntroTour(versionSeen: number | null | undefined): boolean {
  return (versionSeen ?? 0) < INTRO_TOUR_VERSION
}

export function shouldShowKeyboardGuide(versionSeen: number | null | undefined): boolean {
  const seen = versionSeen ?? 0
  return seen >= INTRO_TOUR_VERSION && seen < KEYBOARD_GUIDE_VERSION
}
