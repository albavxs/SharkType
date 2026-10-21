import type { Locale } from './i18n'

export interface LanguageCompletion {
  completed: number
  total: number
  previous: number
  percent: number
}

// Old progress can contain snippet IDs removed or renamed in newer catalogs.
// Report those completions separately instead of drawing bars wider than 100%.
export function getLanguageCompletion(
  completedSnippetIds: readonly string[],
  availableSnippetIds: readonly string[],
): LanguageCompletion {
  const available = new Set(availableSnippetIds)
  const completed = new Set(completedSnippetIds)
  let current = 0

  for (const id of completed) {
    if (available.has(id)) current += 1
  }

  const total = available.size
  return {
    completed: current,
    total,
    previous: completed.size - current,
    percent: total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0,
  }
}

// Stored session dates are YYYY-MM-DD. Use UTC at midday so formatting never
// shifts a session into the previous day for users in western timezones.
export function formatSessionDate(value: string, locale: Locale): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value + 'T12:00:00.000Z')
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return value

  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'UTC',
  }).format(date)
}
