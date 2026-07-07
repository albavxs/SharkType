export interface AuthProfile {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  provider: string | null
  emailVerified: boolean
  isSuperUser: boolean
  localImportedAt: string | null
  onboardingCompleted: boolean
  introTourVersionSeen: number | null
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  totalXP: number
  bestWPM: number
  /** Media WPM das ultimas 20 sessoes (0 se view leaderboard_with_score ausente) */
  avgWPM: number
  currentStreak: number
  totalSessions: number
  rankedSessions: number
  /** Level calculado a partir de totalXP */
  level: number
  /** Score ranked acumulado */
  score: number
}

export type ProgressSource = 'guest' | 'supabase'

export type EmailVerificationState = 'idle' | 'submitting' | 'success' | 'error'

export interface AuthActionResult {
  error: string | null
}

export interface SignUpActionResult extends AuthActionResult {
  needsVerification: boolean
}
