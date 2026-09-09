import { getTrackById, tracks, type Track } from '@/data/tracks'
import { codeLanguages, languages, textLanguages } from '@/data'
import { PUBLIC_SNIPPET_LIMIT, getTotalSnippetCount } from '@/data/public-snippet-counts'
import { loadPremiumSnippets } from '@/lib/server/premium-content'
import type { Language, LanguageMeta, Snippet } from '@/lib/types'
import { getLanguageMetaById } from '@/data/metadata'
import type { UserAccess } from './access-control'

const fullLanguageSnippetCache = new Map<string, Promise<Snippet[]>>()

function toLanguageMeta(language: Language): LanguageMeta {
  return {
    id: language.id,
    label: language.label,
    color: language.color,
  }
}

function getTrackLanguageSource(track: Track): Language[] {
  return track.textLanguages ? textLanguages : codeLanguages
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

function getFullLanguageSnippets(language: Language): Promise<Snippet[]> {
  const cached = fullLanguageSnippetCache.get(language.id)
  if (cached) return cached

  const pending = loadPremiumSnippets(language.id)
    .then((premiumSnippets) => mergeSnippets(language.snippets, premiumSnippets))
    .catch((error) => {
      fullLanguageSnippetCache.delete(language.id)
      throw error
    })

  fullLanguageSnippetCache.set(language.id, pending)
  return pending
}

export async function getTrackLanguages(track: Track): Promise<LanguageMeta[]> {
  const sourceLanguages = getTrackLanguageSource(track)
  const candidateLanguages = track.textLanguages && track.snippetIds.length === 0
    ? sourceLanguages.filter((language) => language.id !== 'text-typing')
    : sourceLanguages

  const supported = await Promise.all(
    candidateLanguages.map(async (language) => {
      const allLanguageSnippets = await getFullLanguageSnippets(language)
      const trackSnippets = buildTrackSnippets(track, allLanguageSnippets)
      return trackSnippets.length > 0 ? toLanguageMeta(language) : null
    })
  )

  return supported.filter((language): language is LanguageMeta => Boolean(language))
}

export async function listTrackLanguageBadges(): Promise<Record<string, LanguageMeta[]>> {
  const entries = await Promise.all(
    tracks.map(async (track) => [track.id, await getTrackLanguages(track)] as const)
  )

  return Object.fromEntries(entries)
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
  const availableLanguages = await getTrackLanguages(track)
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

  // Build from the complete server-side language catalog first. The free wall
  // is per track, so a snippet that is globally #7 can still be one of the
  // first six exercises of a specific concept track.
  const allLanguageSnippets = await getFullLanguageSnippets(language)
  const fullTrackSnippets = buildTrackSnippets(track, allLanguageSnippets)
  const lockedCount = getLockedCount(fullTrackSnippets.length, access)

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

  const allSnippets = await getFullLanguageSnippets(language)
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
