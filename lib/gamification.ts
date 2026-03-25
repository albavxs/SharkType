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
  xpEarned: number
}

export interface UserProgress {
  version: 1
  totalXP: number
  level: number
  streak: {
    current: number
    lastPracticeDate: string
  }
  languages: Record<string, LanguageProgress>
  history: SessionRecord[]
}

const STORAGE_KEY = 'syntaxlang-progress'
const MAX_HISTORY = 50

// Level thresholds: floor(25 * n^1.6)
const LEVEL_THRESHOLDS: number[] = Array.from({ length: 21 }, (_, n) =>
  Math.floor(25 * Math.pow(n, 1.6))
)

function defaultProgress(): UserProgress {
  return {
    version: 1,
    totalXP: 0,
    level: 1,
    streak: { current: 0, lastPracticeDate: '' },
    languages: {},
    history: [],
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    return JSON.parse(raw) as UserProgress
  } catch {
    return defaultProgress()
  }
}

function persist(progress: UserProgress) {
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
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 100
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
}

export interface SessionOutput {
  xpEarned: number
  leveledUp: boolean
  newLevel: number
  levelPercent: number
  streak: number
}

export function saveSession(input: SessionInput): SessionOutput {
  const progress = loadProgress()

  // XP calculation
  const baseXP = 10
  const wpmBonus = Math.floor(input.wpm / 10)
  const accBonus = input.accuracy >= 95 ? 10 : input.accuracy >= 85 ? 5 : 0
  const diffMult = input.difficulty === 'hard' ? 2 : input.difficulty === 'medium' ? 1.5 : 1

  // First-time snippet bonus
  const langProgress = progress.languages[input.languageId] || {
    completedSnippetIds: [],
    bestWPM: 0,
    bestAccuracy: 0,
    totalSessions: 0,
  }
  const isFirstTime = !langProgress.completedSnippetIds.includes(input.snippetId)
  const firstTimeBonus = isFirstTime ? 5 : 0

  const xpEarned = Math.floor((baseXP + wpmBonus + accBonus) * diffMult + firstTimeBonus)

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

  // Update streak
  progress.streak = updateStreak(progress.streak)

  // Add history
  progress.history.unshift({
    date: todayISO(),
    languageId: input.languageId,
    snippetId: input.snippetId,
    wpm: input.wpm,
    accuracy: input.accuracy,
    errors: input.errors,
    duration: input.duration,
    xpEarned,
  })
  if (progress.history.length > MAX_HISTORY) {
    progress.history = progress.history.slice(0, MAX_HISTORY)
  }

  persist(progress)

  return {
    xpEarned,
    leveledUp: newLevelInfo.level > oldLevel,
    newLevel: newLevelInfo.level,
    levelPercent: newLevelInfo.percent,
    streak: progress.streak.current,
  }
}

export function getLanguageProgress(langId: string): LanguageProgress {
  const progress = loadProgress()
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
