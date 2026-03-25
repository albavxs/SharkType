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

export function calculateRawWPM(totalChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(totalChars / 5 / minutes)
}

export function calculateConsistency(wpmSamples: number[]): number {
  if (wpmSamples.length < 2) return 100
  const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length
  if (mean === 0) return 100
  const variance = wpmSamples.reduce((sum, v) => sum + (v - mean) ** 2, 0) / wpmSamples.length
  const stddev = Math.sqrt(variance)
  return Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100)))
}

export function generateChallengeSequence(snippets: Snippet[]): Snippet[] {
  const shuffled = [...snippets]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
