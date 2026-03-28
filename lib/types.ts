export type Theme = 'dark' | 'light'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Mode = 'timed_30' | 'timed_60' | 'snippet'

export type I18nString = { pt: string; en: string }

export interface Snippet {
  id: string
  code: string
  concept: I18nString
  difficulty: Difficulty
  prompt?: I18nString
  slot?: string
}

export interface Language {
  id: string
  label: string
  color: string
  snippets: Snippet[]
}

export interface TypingResult {
  wpm: number
  accuracy: number
  duration: number
  errors: number
  mode: Mode
  language: string
  snippet: Snippet
}

export type CharStatus = 'pending' | 'correct' | 'incorrect'

export interface TypingState {
  input: string
  charStatuses: CharStatus[]
  currentIndex: number
  errors: number
  status: 'idle' | 'running' | 'finished'
  startTime: number | null
}
