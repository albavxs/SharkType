import { getTrackById, tracks, type Track } from '@/data/tracks'
import { languages, textLanguages } from '@/data'
import { PUBLIC_SNIPPET_LIMIT, getTotalSnippetCount } from '@/data/public-snippet-counts'
import { loadPremiumSnippets } from '@/lib/server/premium-content'
import type { Language, LanguageMeta, Snippet } from '@/lib/types'
import { getLanguageMetaById } from '@/data/metadata'
import type { UserAccess } from './access-control'

function toLanguageMeta(language: Language): LanguageMeta {
  return {
    id: language.id,
    label: language.label,
    color: language.color,
  }
}

function getTrackLanguageSource(track: Track): Language[] {
  return track.textLanguages ? textLanguages : languages
}

function snippetIdPrefix(id: string): string {
  return id.replace(/\d+$/, '')
}

function languageOwnsSnippetId(language: Language, snippetId: string): boolean {
  const prefixes = new Set(language.snippets.map((snippet) => snippetIdPrefix(snippet.id)))
  return Array.from(prefixes).some((prefix) => prefix.length > 0 && snippetId.startsWith(prefix))
}

export function getTrackLanguages(track: Track): LanguageMeta[] {
  const sourceLanguages = getTrackLanguageSource(track)

  if (track.textLanguages) {
    const source = track.snippetIds.length > 0
      ? sourceLanguages.filter((language) =>
          track.snippetIds.some((snippetId) => languageOwnsSnippetId(language, snippetId))
        )
      : sourceLanguages.filter((language) => language.id !== 'text-typing')

    return source.map(toLanguageMeta)
  }

  // Concept tracks are defined by semantic slots. Premium snippets may be
  // server-only, so the public six snippets are not a reliable capability
  // index. Keep languages navigable and let the server resolve the slot set.
  if (track.slots && track.slots.length > 0) {
    return sourceLanguages.map(toLanguageMeta)
  }

  return sourceLanguages
    .filter((language) =>
      track.snippetIds.some(
        (snippetId) =>
          language.snippets.some((snippet) => snippet.id === snippetId) ||
          languageOwnsSnippetId(language, snippetId)
      )
    )
    .map(toLanguageMeta)
}

function buildTrackSnippets(track: Track, snippets: Snippet[]): Snippet[] {
  if (track.slots && track.slots.length > 0) {
    return track.slots
      .map((slot) => snippets.find((snippet) => snippet.slot === slot))
      .filter((snippet): snippet is Snippet => Boolean(snippet))
  }

  if (track.textLanguages) {
    if (track.snippetIds.length > 0) {
      return track.snippetIds
        .map((snippetId) => snippets.find((entry) => entry.id === snippetId))
        .filter((snippet): snippet is Snippet => Boolean(snippet))
    }

    return track.difficultyFilter
      ? snippets.filter((snippet) => snippet.difficulty === track.difficultyFilter)
      : snippets
  }

  return track.snippetIds
    .map((snippetId) => snippets.find((snippet) => snippet.id === snippetId))
    .filter((snippet): snippet is Snippet => Boolean(snippet))
}

function mergeSnippets(publicSnippets: Snippet[], premiumSnippets: Snippet[]): Snippet[] {
  const seen = new Set<string>()
  const merged: Snippet[] = []

  for (const snippet of [...publicSnippets, ...premiumSnippets]) {
    if (seen.has(snippet.id)) continue
    seen.add(snippet.id)
    merged.push(snippet)
  }

  return merged
}

function getExpectedTrackCount(track: Track, language: Language, actualCount: number): number {
  if (track.slots && track.slots.length > 0) {
    return Math.max(actualCount, track.slots.length)
  }

  if (track.snippetIds.length > 0) {
    const matchingIds = track.snippetIds.filter((snippetId) => languageOwnsSnippetId(language, snippetId))
    return Math.max(actualCount, matchingIds.length)
  }

  return actualCount
}

export function listTrackLanguageBadges(): Record<string, LanguageMeta[]> {
  return Object.fromEntries(
    tracks.map((track) => [track.id, getTrackLanguages(track)])
  )
}

function applyAccessWall(snippets: Snippet[], access: UserAccess): Snippet[] {
  if (access.isPlus) return snippets
  return snippets.slice(0, PUBLIC_SNIPPET_LIMIT)
}

function getLockedCount(expectedTotal: number, access: UserAccess): number {
  if (access.isPlus) return 0
  return Math.max(0, expectedTotal - PUBLIC_SNIPPET_LIMIT)
}

export async function getTrackPracticePayload(
  trackId: string,
  requestedLanguageId: string | null | undefined,
  access: UserAccess
) {
  const track = getTrackById(trackId)
  if (!track) return null

  const sourceLanguages = getTrackLanguageSource(track)
  const availableLanguages = getTrackLanguages(track)
  const selectedLanguageMeta =
    (requestedLanguageId
      ? availableLanguages.find((language) => language.id === requestedLanguageId)
      : null) ?? availableLanguages[0] ?? null

  if (!selectedLanguageMeta) {
    return {
      availableLanguages,
      selectedLanguage: null,
      snippets: [] as Snippet[],
      access,
      wall: {
        isLocked: false,
        freeSnippetLimit: PUBLIC_SNIPPET_LIMIT,
        lockedCount: 0,
        requiredPlan: 'plus' as const,
      },
    }
  }

  const language = sourceLanguages.find((entry) => entry.id === selectedLanguageMeta.id)
  if (!language) {
    const fallbackMeta = getLanguageMetaById(selectedLanguageMeta.id) ?? selectedLanguageMeta
    return {
      availableLanguages,
      selectedLanguage: fallbackMeta,
      snippets: [] as Snippet[],
      access,
      wall: {
        isLocked: false,
        freeSnippetLimit: PUBLIC_SNIPPET_LIMIT,
        lockedCount: 0,
        requiredPlan: 'plus' as const,
      },
    }
  }

  // Build the track from the complete server-side language set first, then
  // apply the wall to that track. This prevents a global six-snippet language
  // slice from accidentally reducing other tracks to zero/one public item.
  const premiumSnippets = await loadPremiumSnippets(language.id)
  const allLanguageSnippets = mergeSnippets(language.snippets, premiumSnippets)
  const fullTrackSnippets = buildTrackSnippets(track, allLanguageSnippets)
  const expectedTotal = getExpectedTrackCount(track, language, fullTrackSnippets.length)
  const lockedCount = getLockedCount(expectedTotal, access)

  return {
    availableLanguages,
    selectedLanguage: toLanguageMeta(language),
    snippets: applyAccessWall(fullTrackSnippets, access),
    access,
    wall: {
      isLocked: lockedCount > 0,
      freeSnippetLimit: PUBLIC_SNIPPET_LIMIT,
      lockedCount,
      requiredPlan: 'plus' as const,
    },
  }
}

export async function getLanguagePracticePayload(languageId: string, access: UserAccess) {
  const language = languages.find((entry) => entry.id === languageId)
  if (!language) return null

  const premiumSnippets = await loadPremiumSnippets(language.id)
  const allSnippets = mergeSnippets(language.snippets, premiumSnippets)
  const expectedTotal = Math.max(getTotalSnippetCount(language.id), allSnippets.length)
  const lockedCount = getLockedCount(expectedTotal, access)

  return {
    language: toLanguageMeta(language),
    snippets: applyAccessWall(allSnippets, access),
    access,
    wall: {
      isLocked: lockedCount > 0,
      freeSnippetLimit: PUBLIC_SNIPPET_LIMIT,
      lockedCount,
      requiredPlan: 'plus' as const,
    },
  }
}
