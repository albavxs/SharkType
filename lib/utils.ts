import { Snippet } from './types'

export function calculateWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(correctChars / 5 / minutes)
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

export function getRandomSnippet(snippets: Snippet[], currentId?: string): Snippet {
  const pool = snippets.filter(s => s.id !== currentId)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
