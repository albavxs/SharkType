import { Snippet } from './types'

/**
 * Calculates Words Per Minute (WPM) based on correct characters.
 * Standard industry formula: (correct characters / 5) / minutes.
 * 
 * @param correctChars - Number of correctly typed characters
 * @param elapsedMs - Elapsed time in milliseconds
 * @returns Calculated WPM
 */
export function calculateWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(correctChars / 5 / minutes)
}

/**
 * Calculates typing accuracy as a percentage.
 * 
 * @param correct - Number of correct characters
 * @param total - Total number of characters typed
 * @returns Accuracy percentage (0-100)
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

/**
 * Selects a random snippet from a pool, avoiding the current one if provided.
 * 
 * @param snippets - Array of available snippets
 * @param currentId - ID of the snippet currently being typed
 * @returns A randomly selected snippet
 */
export function getRandomSnippet(snippets: Snippet[], currentId?: string): Snippet {
  const pool = snippets.filter(s => s.id !== currentId)
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Formats time in seconds to MM:SS string.
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/**
 * Calculates raw WPM including errors.
 * 
 * @param totalChars - Total characters typed (including errors)
 * @param elapsedMs - Elapsed time in milliseconds
 * @returns Raw WPM
 */
export function calculateRawWPM(totalChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(totalChars / 5 / minutes)
}

/**
 * Calculates typing consistency based on WPM samples.
 * Uses standard deviation to determine how steady the typing speed is.
 * 
 * @param wpmSamples - Array of WPM samples taken during the session
 * @returns Consistency percentage (0-100)
 */
export function calculateConsistency(wpmSamples: number[]): number {
  if (wpmSamples.length < 2) return 100
  const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length
  if (mean === 0) return 100
  const variance = wpmSamples.reduce((sum, v) => sum + (v - mean) ** 2, 0) / wpmSamples.length
  const stddev = Math.sqrt(variance)
  return Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100)))
}

/**
 * Removes comments from code snippets to focus on typing logic.
 * Supports //, # and {# style comments.
 * 
 * @param code - The raw code snippet
 * @returns Cleaned code snippet
 */
export function stripCodeComments(code: string): string {
  return code
    .split('\n')
    .filter(line => {
      const t = line.trim()
      return !t.startsWith('//') && !t.startsWith('#') && !t.startsWith('{#')
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Generates a randomized sequence of snippets for challenge modes.
 * 
 * @param snippets - Pool of snippets to shuffle
 * @returns Shuffled array of snippets
 */
export function generateChallengeSequence(snippets: Snippet[]): Snippet[] {
  const shuffled = [...snippets]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
