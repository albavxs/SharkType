import { getRankFromScore, type RankState } from './ranks'
import { Difficulty } from './types'

export interface LanguageProgress {
  completedSnippetIds: string[]
  bestWPM: number
  bestAccuracy: number
  totalSessions: number
}

export interface SessionRecord {
  date: string
  languageId: string
  snippetId: string
  wpm: number
  rawWpm?: number
  accuracy: number
  errors: number
  duration: number
  difficulty?: Difficulty
  xpEarned: number
  rankedEligible?: boolean
  rankedPoints?: number
}

export interface StreakState {
  current: number
  lastPracticeDate: string
  lastActivityAt: string
  lastStreakAt: string
}

export interface StreakNotification {
  current: number
  eventKey: string
}

export interface UserProgress {
  version: 1
  totalXP: number
  level: number
  streak: StreakState
  rankedScore: number
  rankedSessions: number
  languages: Record<string, LanguageProgress>
  history: SessionRecord[]
  completedTrackIds?: string[]
}

export const STORAGE_KEY = 'syntaxlang-progress'
export const MAX_HISTORY = 1000 // Aumentado significativamente
const DAY_IN_MS = 24 * 60 * 60 * 1000
const EXPIRY_WINDOW_MS = 48 * 60 * 60 * 1000

// Level thresholds: floor(25 * n^1.6)
export function getThresholdForLevel(n: number): number {
  return Math.floor(25 * Math.pow(n, 1.6))
}

const LEVEL_THRESHOLDS: number[] = Array.from({ length: 101 }, (_, n) =>
  getThresholdForLevel(n)
)

export function createDefaultProgress(): UserProgress {
  return {
    version: 1,
    totalXP: 0,
    level: 1,
    streak: createDefaultStreak(),
    rankedScore: 0,
    rankedSessions: 0,
    languages: {},
    history: [],
    completedTrackIds: [],
  }
}

export function createDefaultStreak(): StreakState {
  return {
    current: 0,
    lastPracticeDate: '',
    lastActivityAt: '',
    lastStreakAt: '',
  }
}

function isValidTimestamp(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value))
}

function parseTimestamp(value: string | undefined): number | null {
  return isValidTimestamp(value) ? Date.parse(value) : null
}

function getIsoDate(value: string): string {
  return value.slice(0, 10)
}

function buildSyntheticLegacyTimestamp(date: string): string {
  return date ? `${date}T12:00:00.000Z` : ''
}

function migrateLegacyStreak(streak?: Partial<StreakState> | null): StreakState {
  const legacyCurrent = Math.max(0, streak?.current ?? 0)
  const migratedCurrent = Math.max(0, legacyCurrent - 1)
  const lastPracticeDate = streak?.lastPracticeDate ?? ''
  const syntheticActivityAt = buildSyntheticLegacyTimestamp(lastPracticeDate)

  return {
    current: migratedCurrent,
    lastPracticeDate,
    lastActivityAt: syntheticActivityAt,
    // Legacy snapshots do not contain enough precision to auto-award a new streak.
    lastStreakAt: syntheticActivityAt,
  }
}

export function normalizeStreak(streak?: Partial<StreakState> | null): StreakState {
  if (!streak) return createDefaultStreak()

  if (!('lastActivityAt' in streak) && !('lastStreakAt' in streak)) {
    return migrateLegacyStreak(streak)
  }

  return {
    current: Math.max(0, streak.current ?? 0),
    lastPracticeDate: streak.lastPracticeDate ?? '',
    lastActivityAt: isValidTimestamp(streak.lastActivityAt) ? streak.lastActivityAt : '',
    lastStreakAt: isValidTimestamp(streak.lastStreakAt) ? streak.lastStreakAt : '',
  }
}

function normalizeProgress(progress?: Partial<UserProgress> | null): UserProgress {
  if (!progress) return createDefaultProgress()

  const history = Array.isArray(progress.history) ? progress.history.slice(0, MAX_HISTORY) : []

  return {
    version: 1,
    totalXP: progress.totalXP ?? 0,
    level: progress.level ?? 1,
    streak: normalizeStreak(progress.streak),
    rankedScore: progress.rankedScore ?? 0,
    rankedSessions: progress.rankedSessions ?? 0,
    languages: progress.languages ?? {},
    history,
    completedTrackIds: Array.isArray(progress.completedTrackIds) ? progress.completedTrackIds : [],
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultProgress()
    return normalizeProgress(JSON.parse(raw) as UserProgress)
  } catch {
    return createDefaultProgress()
  }
}

export function persistProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getLevel(xp: number): {
  level: number
  currentXP: number
  nextLevelXP: number
  percent: number
} {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }
  const currentThreshold = getThresholdForLevel(level - 1)
  const nextThreshold = getThresholdForLevel(level)
  const progress = xp - currentThreshold
  const needed = nextThreshold - currentThreshold
  return {
    level,
    currentXP: xp,
    nextLevelXP: nextThreshold,
    percent: needed > 0 ? Math.min(Math.round((progress / needed) * 100), 100) : 100,
  }
}

function getNowIso(): string {
  return new Date().toISOString()
}

function expireStreakIfNeeded(streakInput: StreakState, nowIso: string): StreakState {
  const streak = normalizeStreak(streakInput)
  const lastActivityMs = parseTimestamp(streak.lastActivityAt)
  const nowMs = parseTimestamp(nowIso)

  if (lastActivityMs === null || nowMs === null) return streak
  if (nowMs - lastActivityMs < EXPIRY_WINDOW_MS) return streak

  return {
    ...streak,
    current: 0,
    lastStreakAt: '',
  }
}

export function deriveStreakFromActivityTimestamps(timestamps: string[]): StreakState {
  const sorted = timestamps
    .map((timestamp) => ({ timestamp, ms: parseTimestamp(timestamp) }))
    .filter((entry): entry is { timestamp: string; ms: number } => entry.ms !== null)
    .sort((a, b) => a.ms - b.ms)

  if (sorted.length === 0) {
    return createDefaultStreak()
  }

  const chain: string[] = []

  for (const entry of sorted) {
    if (chain.length === 0) {
      chain.push(entry.timestamp)
      continue
    }

    const previousMs = parseTimestamp(chain[chain.length - 1])
    if (previousMs === null) {
      chain[chain.length - 1] = entry.timestamp
      continue
    }

    const delta = entry.ms - previousMs

    if (delta < DAY_IN_MS) {
      chain[chain.length - 1] = entry.timestamp
      continue
    }

    if (delta >= EXPIRY_WINDOW_MS) {
      chain.length = 0
      chain.push(entry.timestamp)
      continue
    }

    chain.push(entry.timestamp)
  }

  const lastActivityAt = chain[chain.length - 1] ?? ''
  const current = Math.max(0, chain.length - 1)

  return {
    current,
    lastPracticeDate: lastActivityAt ? getIsoDate(lastActivityAt) : '',
    lastActivityAt,
    lastStreakAt: current > 0 ? chain[chain.length - 2] ?? '' : '',
  }
}

export function reconcileStreakOnLogin(
  streakInput: StreakState,
  nowIso: string = getNowIso()
): { streak: StreakState; notification: StreakNotification | null } {
  const streak = expireStreakIfNeeded(streakInput, nowIso)
  const lastActivityMs = parseTimestamp(streak.lastActivityAt)
  const nowMs = parseTimestamp(nowIso)

  if (lastActivityMs === null || nowMs === null) {
    return { streak, notification: null }
  }

  const alreadyClaimedLatestActivity = streak.lastStreakAt === streak.lastActivityAt
  const elapsedSinceActivity = nowMs - lastActivityMs

  if (
    alreadyClaimedLatestActivity ||
    elapsedSinceActivity < DAY_IN_MS ||
    elapsedSinceActivity >= EXPIRY_WINDOW_MS
  ) {
    return { streak, notification: null }
  }

  const nextCurrent = streak.current + 1
  const nextStreak: StreakState = {
    ...streak,
    current: nextCurrent,
    lastStreakAt: streak.lastActivityAt,
  }

  return {
    streak: nextStreak,
    notification: {
      current: nextCurrent,
      eventKey: `streak:${streak.lastActivityAt}`,
    },
  }
}

export function applyPracticeActivity(
  streakInput: StreakState,
  activityAt: string = getNowIso()
): StreakState {
  const streak = expireStreakIfNeeded(streakInput, activityAt)

  return {
    ...streak,
    lastActivityAt: activityAt,
    lastPracticeDate: getIsoDate(activityAt),
  }
}

export interface SessionInput {
  languageId: string
  snippetId: string
  wpm: number
  rawWpm: number
  accuracy: number
  errors: number
  duration: number
  difficulty: Difficulty
  lenient?: boolean
  rankedMode?: boolean
}

export interface RankedPointBreakdown {
  rankedEligible: boolean
  total: number
  gateFailed: boolean
  base: number
  difficultyBonus: number
  speedBonus: number
  accuracyBonus: number
  controlPenalty: number
  errorPenalty: number
}

export interface SessionOutput {
  xpEarned: number
  leveledUp: boolean
  newLevel: number
  levelPercent: number
  streak: number
  streakEventKey: string | null
  rankedPointsEarned: number
  rankedEligible: boolean
  rankedScore: number
  rankedTier: RankState
  /** Flag indicando se o streak foi incrementado nesta sessão (não apenas mantido) */
  streakIncremented: boolean
  /**
   * Achievements desbloqueados nesta sessao. Populado pelo backend em saveRemoteSession.
   * Guest mode: sempre vazio. Default: [].
   */
  newlyUnlocked?: Array<{
    id: string
    category: string
    threshold: number | null
    icon: string
    name: { pt: string; en: string }
    description: { pt: string; en: string }
  }>
}

export function applySessionToProgress(
  progressInput: UserProgress,
  input: SessionInput
): {
  progress: UserProgress
  output: SessionOutput
} {
  const progress = normalizeProgress(progressInput)
  const sessionAt = getNowIso()
  // First-time snippet bonus
  const langProgress = progress.languages[input.languageId] || {
    completedSnippetIds: [],
    bestWPM: 0,
    bestAccuracy: 0,
    totalSessions: 0,
  }
  const isFirstTime = !langProgress.completedSnippetIds.includes(input.snippetId)
  const firstTimeBonus = isFirstTime ? 5 : 0
  const xpEarned = calculateXpEarned(input) + firstTimeBonus
  const rankedEligible = isRankedSession(
    input.languageId,
    input.lenient ?? false,
    input.rankedMode ?? true
  )
  const rankedPointsEarned = rankedEligible ? calculateRankedPoints(input) : 0

  // Update language progress
  if (isFirstTime) {
    langProgress.completedSnippetIds.push(input.snippetId)
  }
  langProgress.bestWPM = Math.max(langProgress.bestWPM, input.wpm)
  langProgress.bestAccuracy = Math.max(langProgress.bestAccuracy, input.accuracy)
  langProgress.totalSessions++
  progress.languages[input.languageId] = langProgress

  // Update XP & level
  const oldLevel = getLevel(progress.totalXP).level
  progress.totalXP += xpEarned
  const newLevelInfo = getLevel(progress.totalXP)
  progress.level = newLevelInfo.level
  progress.rankedScore += rankedPointsEarned
  if (rankedEligible) {
    progress.rankedSessions += 1
  }

  progress.streak = applyPracticeActivity(progress.streak, sessionAt)

  // Add history
  progress.history.unshift({
    date: getIsoDate(sessionAt),
    languageId: input.languageId,
    snippetId: input.snippetId,
    wpm: input.wpm,
    rawWpm: input.rawWpm,
    accuracy: input.accuracy,
    errors: input.errors,
    duration: input.duration,
    difficulty: input.difficulty,
    xpEarned,
    rankedEligible,
    rankedPoints: rankedPointsEarned,
  })
  if (progress.history.length > MAX_HISTORY) {
    progress.history = progress.history.slice(0, MAX_HISTORY)
  }

  return {
    progress,
    output: {
      xpEarned,
      leveledUp: newLevelInfo.level > oldLevel,
      newLevel: newLevelInfo.level,
      levelPercent: newLevelInfo.percent,
      streak: progress.streak.current,
      streakEventKey: null,
      rankedPointsEarned,
      rankedEligible,
      rankedScore: progress.rankedScore,
      rankedTier: getRankFromScore(progress.rankedScore),
      streakIncremented: false,
    },
  }
}

export function saveSession(input: SessionInput): SessionOutput {
  const current = loadProgress()
  const { progress, output } = applySessionToProgress(current, input)
  persistProgress(progress)
  return output
}

export function getLanguageProgress(langId: string, progressInput?: UserProgress): LanguageProgress {
  const progress = progressInput ?? loadProgress()
  return progress.languages[langId] || {
    completedSnippetIds: [],
    bestWPM: 0,
    bestAccuracy: 0,
    totalSessions: 0,
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasMeaningfulProgress(progress: UserProgress): boolean {
  return progress.totalXP > 0 || progress.history.length > 0 || Object.keys(progress.languages).length > 0
}

export function isRankedEligibleLanguage(languageId: string): boolean {
  return !languageId.startsWith('text-')
}

export function isRankedSession(
  languageId: string,
  lenient: boolean = false,
  rankedMode: boolean = true
): boolean {
  return rankedMode && isRankedEligibleLanguage(languageId) && !lenient
}

export function calculateXpEarned(input: SessionInput): number {
  const baseXP = 10
  const wpmBonus = Math.floor(input.wpm / 10)
  const accBonus = input.accuracy >= 95 ? 10 : input.accuracy >= 85 ? 5 : 0
  const diffMult = input.difficulty === 'hard' ? 2 : input.difficulty === 'medium' ? 1.5 : 1
  return Math.floor((baseXP + wpmBonus + accBonus) * diffMult)
}

export function calculateRankedBreakdown(
  input: Pick<SessionInput, 'languageId' | 'wpm' | 'rawWpm' | 'accuracy' | 'errors' | 'difficulty'>
): RankedPointBreakdown {
  if (!isRankedEligibleLanguage(input.languageId)) {
    return {
      rankedEligible: false,
      total: 0,
      gateFailed: true,
      base: 0,
      difficultyBonus: 0,
      speedBonus: 0,
      accuracyBonus: 0,
      controlPenalty: 0,
      errorPenalty: 0,
    }
  }

  if (input.accuracy < 90) {
    return {
      rankedEligible: true,
      total: 0,
      gateFailed: true,
      base: Math.round(input.wpm),
      difficultyBonus: input.difficulty === 'hard' ? 28 : input.difficulty === 'medium' ? 12 : 0,
      speedBonus: Math.max(0, Math.floor((input.wpm - 70) / 5) * 4),
      accuracyBonus: 0,
      controlPenalty: Math.round(Math.max(0, input.rawWpm - input.wpm) * 10) / 10,
      errorPenalty: input.errors * (input.difficulty === 'hard' ? 5 : input.difficulty === 'medium' ? 3 : 2),
    }
  }

  const difficultyBonus = input.difficulty === 'hard' ? 28 : input.difficulty === 'medium' ? 12 : 0
  const speedBonus = Math.max(0, Math.floor((input.wpm - 70) / 5) * 4)
  const accuracyBonus = input.accuracy >= 98 ? 12 : input.accuracy >= 95 ? 6 : 0
  const controlPenalty = Math.round(Math.max(0, input.rawWpm - input.wpm) * 15) / 10
  const errorPenalty = input.errors * (input.difficulty === 'hard' ? 5 : input.difficulty === 'medium' ? 3 : 2)
  const total = Math.max(
    0,
    Math.round(input.wpm + difficultyBonus + speedBonus + accuracyBonus - controlPenalty - errorPenalty)
  )

  return {
    rankedEligible: true,
    total,
    gateFailed: false,
    base: Math.round(input.wpm),
    difficultyBonus,
    speedBonus,
    accuracyBonus,
    controlPenalty,
    errorPenalty,
  }
}

export function calculateRankedPoints(
  input: Pick<SessionInput, 'languageId' | 'wpm' | 'rawWpm' | 'accuracy' | 'errors' | 'difficulty'>
): number {
  return calculateRankedBreakdown(input).total
}

export function computeRankedAggregate(history: SessionRecord[]): {
  rankedScore: number
  rankedSessions: number
} {
  return history.reduce(
    (acc, session) => {
      const rankedEligible = session.rankedEligible ?? isRankedEligibleLanguage(session.languageId)
      const rankedPoints = calculateRankedPoints({
        languageId: session.languageId,
        wpm: session.wpm,
        rawWpm: session.rawWpm ?? session.wpm,
        accuracy: session.accuracy,
        errors: session.errors,
        difficulty: session.difficulty ?? 'easy',
      })

      if (!rankedEligible) return acc

      acc.rankedScore += rankedPoints
      acc.rankedSessions += 1
      return acc
    },
    { rankedScore: 0, rankedSessions: 0 }
  )
}

/**
 * Compat shim: score agora e score ranked acumulativo.
 * Preferir `computeRankedAggregate` ou `progress.rankedScore` em código novo.
 */
export function computeScore(rankedScore: number): number {
  return Math.round(rankedScore)
}

/**
 * Media de WPM das ultimas N sessoes. Default N=20 — equilibra usuario novo (poucas sessoes)
 * com usuario veterano (sem deixar sessoes antigas dominarem).
 */
export function computeAverageWPM(wpmValues: number[], window = 20): number {
  if (wpmValues.length === 0) return 0
  const recent = wpmValues.slice(0, window)
  const sum = recent.reduce((s, v) => s + v, 0)
  return Math.round(sum / recent.length)
}

export function deriveProgressSummary(progressInput: UserProgress): {
  bestWPM: number
  bestAccuracy: number
  totalSessions: number
} {
  const progress = normalizeProgress(progressInput)
  const languageEntries = Object.values(progress.languages)

  return {
    bestWPM: languageEntries.reduce((best, entry) => Math.max(best, entry.bestWPM), 0),
    bestAccuracy: languageEntries.reduce((best, entry) => Math.max(best, entry.bestAccuracy), 0),
    totalSessions: progress.history.length,
  }
}
