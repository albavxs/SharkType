import { getAllLanguageMetas } from '@/data/metadata'
import { MAX_HISTORY, createDefaultStreak, normalizeStreak, type SessionInput, type StreakState } from '@/lib/gamification'
import type { Difficulty } from '@/lib/types'

const VALID_LANGUAGE_IDS = new Set(getAllLanguageMetas().map((language) => language.id))
const VALID_DIFFICULTIES = new Set<Difficulty>(['easy', 'medium', 'hard'])
const MAX_SNIPPET_ID_LENGTH = 160
const MAX_TRACK_ID_LENGTH = 160
const MAX_COMPLETED_TRACK_IDS = 500

export interface ImportedSessionRecord {
  date: string
  languageId: string
  snippetId: string
  wpm: number
  rawWpm: number
  accuracy: number
  errors: number
  duration: number
  difficulty: Difficulty
}

export interface ImportedProgressSnapshot {
  history: ImportedSessionRecord[]
  completedTrackIds: string[]
  streak: StreakState
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeImportedDate(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  const isoDate = parsed.toISOString().slice(0, 10)
  if (isoDate < '2000-01-01') return null

  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  const maxDate = tomorrow.toISOString().slice(0, 10)
  if (isoDate > maxDate) return null

  return isoDate
}

function normalizeStringArray(
  value: unknown,
  maxItems: number,
  maxLength: number
): string[] {
  if (!Array.isArray(value)) return []

  const unique = new Set<string>()
  for (const item of value) {
    if (typeof item !== 'string') continue
    const normalized = item.trim()
    if (!normalized || normalized.length > maxLength) continue
    unique.add(normalized)
    if (unique.size >= maxItems) break
  }

  return Array.from(unique)
}

export function isSessionInput(value: unknown): value is SessionInput {
  if (!isRecord(value)) return false

  return (
    typeof value.languageId === 'string' &&
    typeof value.snippetId === 'string' &&
    typeof value.wpm === 'number' &&
    typeof value.rawWpm === 'number' &&
    typeof value.accuracy === 'number' &&
    typeof value.errors === 'number' &&
    typeof value.duration === 'number' &&
    typeof value.difficulty === 'string' &&
    (typeof value.rankedMode === 'undefined' || typeof value.rankedMode === 'boolean')
  )
}

export function isValidSessionInput(input: SessionInput): boolean {
  return (
    input.languageId.length > 0 &&
    input.snippetId.trim().length > 0 &&
    input.snippetId.length <= MAX_SNIPPET_ID_LENGTH &&
    input.wpm >= 0 && input.wpm <= 250 &&
    input.rawWpm >= 0 && input.rawWpm <= 300 &&
    input.accuracy >= 0 && input.accuracy <= 100 &&
    input.errors >= 0 && input.errors <= 10_000 &&
    input.duration >= 1 && input.duration <= 600 &&
    VALID_DIFFICULTIES.has(input.difficulty) &&
    VALID_LANGUAGE_IDS.has(input.languageId)
  )
}

export function sanitizeImportedSessionRecord(value: unknown): ImportedSessionRecord | null {
  if (!isRecord(value)) return null

  const difficulty = typeof value.difficulty === 'string' && VALID_DIFFICULTIES.has(value.difficulty as Difficulty)
    ? (value.difficulty as Difficulty)
    : 'easy'

  const rawWpm = typeof value.rawWpm === 'number' ? value.rawWpm : value.wpm
  const date = normalizeImportedDate(value.date)
  const candidate: SessionInput = {
    languageId: typeof value.languageId === 'string' ? value.languageId : '',
    snippetId: typeof value.snippetId === 'string' ? value.snippetId.trim() : '',
    wpm: typeof value.wpm === 'number' ? value.wpm : Number.NaN,
    rawWpm: typeof rawWpm === 'number' ? rawWpm : Number.NaN,
    accuracy: typeof value.accuracy === 'number' ? value.accuracy : Number.NaN,
    errors: typeof value.errors === 'number' ? value.errors : Number.NaN,
    duration: typeof value.duration === 'number' ? value.duration : Number.NaN,
    difficulty,
  }

  if (!date || !isValidSessionInput(candidate)) {
    return null
  }

  return {
    date,
    languageId: candidate.languageId,
    snippetId: candidate.snippetId,
    wpm: candidate.wpm,
    rawWpm: candidate.rawWpm,
    accuracy: candidate.accuracy,
    errors: candidate.errors,
    duration: candidate.duration,
    difficulty: candidate.difficulty,
  }
}

export function sanitizeImportedProgressSnapshot(progress: unknown): ImportedProgressSnapshot {
  const empty = createDefaultStreak()
  if (!isRecord(progress)) {
    return {
      history: [],
      completedTrackIds: [],
      streak: empty,
    }
  }

  const historyInput = Array.isArray(progress.history) ? progress.history : []
  const history: ImportedSessionRecord[] = []

  for (const item of historyInput) {
    const sanitized = sanitizeImportedSessionRecord(item)
    if (!sanitized) continue
    history.push(sanitized)
    if (history.length >= MAX_HISTORY) break
  }

  return {
    history,
    completedTrackIds: normalizeStringArray(progress.completedTrackIds, MAX_COMPLETED_TRACK_IDS, MAX_TRACK_ID_LENGTH),
    streak: normalizeStreak(isRecord(progress.streak) ? progress.streak : empty),
  }
}
