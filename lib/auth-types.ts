export interface AuthProfile {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  provider: string | null
  emailVerified: boolean
  localImportedAt: string | null
  onboardingCompleted: boolean
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  totalXP: number
  bestWPM: number
  currentStreak: number
  totalSessions: number
}

export type ProgressSource = 'guest' | 'supabase'

export type EmailVerificationState = 'idle' | 'submitting' | 'success' | 'error'

export interface AuthActionResult {
  error: string | null
}

export interface SignUpActionResult extends AuthActionResult {
  needsVerification: boolean
}
