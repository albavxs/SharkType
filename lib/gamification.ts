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
  accuracy: number
  errors: number
  duration: number
  difficulty?: Difficulty
  xpEarned: number
  rankedEligible?: boolean
  rankedPoints?: number
}

export interface UserProgress {
  version: 1
  totalXP: number
  level: number
  streak: {
    current: number
    lastPracticeDate: string
  }
  rankedScore: number
  rankedSessions: number
  languages: Record<string, LanguageProgress>
  history: SessionRecord[]
  completedTrackIds?: string[]
}

export const STORAGE_KEY = 'syntaxlang-progress'
export const MAX_HISTORY = 1000 // Aumentado significativamente

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
    streak: { current: 0, lastPracticeDate: '' },
    rankedScore: 0,
    rankedSessions: 0,
    languages: {},
    history: [],
    completedTrackIds: [],
  }
}

function normalizeProgress(progress?: Partial<UserProgress> | null): UserProgress {
  if (!progress) return createDefaultProgress()

  return {
    version: 1,
    totalXP: progress.totalXP ?? 0,
    level: progress.level ?? 1,
    streak: {
      current: progress.streak?.current ?? 0,
      lastPracticeDate: progress.streak?.lastPracticeDate ?? '',
    },
    rankedScore: progress.rankedScore ?? 0,
    rankedSessions: progress.rankedSessions ?? 0,
    languages: progress.languages ?? {},
    history: Array.isArray(progress.history) ? progress.history.slice(0, MAX_HISTORY) : [],
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

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function updateStreak(streak: UserProgress['streak']): UserProgress['streak'] {
  const today = todayISO()
  if (streak.lastPracticeDate === today) {
    return streak // already counted today
  }
  if (streak.lastPracticeDate === yesterdayISO()) {
    return { current: streak.current + 1, lastPracticeDate: today }
  }
  return { current: 1, lastPracticeDate: today }
}

export interface SessionInput {
  languageId: string
  snippetId: string
  wpm: number
  accuracy: number
  errors: number
  duration: number
  difficulty: Difficulty
  lenient?: boolean
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
  const rankedEligible = isRankedEligibleLanguage(input.languageId) && !input.lenient
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

  // Update streak
  const oldStreakValue = progress.streak.current
  progress.streak = updateStreak(progress.streak)
  const streakIncremented = progress.streak.current > oldStreakValue
  const streakEventKey = streakIncremented ? `streak:${progress.streak.lastPracticeDate}` : null

  // Add history
  progress.history.unshift({
    date: todayISO(),
    languageId: input.languageId,
    snippetId: input.snippetId,
    wpm: input.wpm,
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
      streakEventKey,
      rankedPointsEarned,
      rankedEligible,
      rankedScore: progress.rankedScore,
      rankedTier: getRankFromScore(progress.rankedScore, progress.rankedSessions),
      streakIncremented,
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

export function calculateXpEarned(input: SessionInput): number {
  const baseXP = 10
  const wpmBonus = Math.floor(input.wpm / 10)
  const accBonus = input.accuracy >= 95 ? 10 : input.accuracy >= 85 ? 5 : 0
  const diffMult = input.difficulty === 'hard' ? 2 : input.difficulty === 'medium' ? 1.5 : 1
  return Math.floor((baseXP + wpmBonus + accBonus) * diffMult)
}

export function calculateRankedPoints(input: Pick<SessionInput, 'languageId' | 'wpm' | 'accuracy' | 'errors' | 'difficulty'>): number {
  if (!isRankedEligibleLanguage(input.languageId)) return 0

  const accuracyBonus = Math.max(0, Math.floor((input.accuracy - 85) / 2))
  const difficultyBonus = input.difficulty === 'hard' ? 28 : input.difficulty === 'medium' ? 12 : 0
  const errorPenaltyMultiplier = input.difficulty === 'hard' ? 4 : input.difficulty === 'medium' ? 2 : 1

  return Math.max(0, Math.round(input.wpm + accuracyBonus + difficultyBonus - (input.errors * errorPenaltyMultiplier)))
}

export function computeRankedAggregate(history: SessionRecord[]): {
  rankedScore: number
  rankedSessions: number
} {
  return history.reduce(
    (acc, session) => {
      const rankedEligible = session.rankedEligible ?? isRankedEligibleLanguage(session.languageId)
      const rankedPoints = session.rankedPoints ?? calculateRankedPoints({
        languageId: session.languageId,
        wpm: session.wpm,
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
