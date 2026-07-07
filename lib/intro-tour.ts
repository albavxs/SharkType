export const INTRO_TOUR_VERSION = 1

export function shouldShowIntroTour(versionSeen: number | null | undefined): boolean {
  return (versionSeen ?? 0) < INTRO_TOUR_VERSION
}
