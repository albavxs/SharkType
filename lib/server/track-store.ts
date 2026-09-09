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

export function getTrackLanguages(track: Track): LanguageMeta[] {
  const sourceLanguages = getTrackLanguageSource(track)

  if (track.textLanguages) {
    const source = track.snippetIds.length > 0
      ? sourceLanguages.filter((language) => language.id === 'text-typing')
      : sourceLanguages.filter((language) => language.id !== 'text-typing')

    return source.map(toLanguageMeta)
  }

  if (track.slots && track.slots.length > 0) {
    return sourceLanguages
      .filter((language) =>
        language.snippets.some((snippet) => snippet.slot && track.slots!.includes(snippet.slot))
      )
      .map(toLanguageMeta)
  }

  const seen = new Set<string>()
  const result: LanguageMeta[] = []

  for (const snippetId of track.snippetIds) {
    for (const language of sourceLanguages) {
      if (seen.has(language.id)) continue
      if (!language.snippets.some((snippet) => snippet.id === snippetId)) continue
      seen.add(language.id)
      result.push(toLanguageMeta(language))
    }
  }

  return result
}

function buildTrackSnippets(track: Track, language: Language): Snippet[] {
  if (track.slots && track.slots.length > 0) {
    return track.slots
      .map((slot) => language.snippets.find((snippet) => snippet.slot === slot))
      .filter((snippet): snippet is Snippet => Boolean(snippet))
  }

  if (track.textLanguages) {
    if (track.snippetIds.length > 0) {
      const snippets = track.snippetIds
        .map((snippetId) => {
          const snippet = language.snippets.find((entry) => entry.id === snippetId)
          return snippet
        })
        .filter((snippet): snippet is Snippet => Boolean(snippet))

      return snippets
    }

    return track.difficultyFilter
      ? language.snippets.filter((snippet) => snippet.difficulty === track.difficultyFilter)
      : language.snippets
  }

  return track.snippetIds
    .map((snippetId) => language.snippets.find((snippet) => snippet.id === snippetId))
    .filter((snippet): snippet is Snippet => Boolean(snippet))
}

export function listTrackLanguageBadges(): Record<string, LanguageMeta[]> {
  return Object.fromEntries(
    tracks.map((track) => [track.id, getTrackLanguages(track)])
  )
}

function applyAccessWall(snippets: Snippet[], premiumSnippets: Snippet[], access: UserAccess): Snippet[] {
  const publicSnippets = snippets.slice(0, PUBLIC_SNIPPET_LIMIT)
  if (!access.isPlus) return publicSnippets

  const seen = new Set(publicSnippets.map((snippet) => snippet.id))
  const unlockedPremium = premiumSnippets.filter((snippet) => {
    if (seen.has(snippet.id)) return false
    seen.add(snippet.id)
    return true
  })

  return [...publicSnippets, ...unlockedPremium]
}

function getLockedCount(languageId: string, publicCount: number, premiumCount: number, access: UserAccess): number {
  if (access.isPlus) return 0

  const knownTotal = Math.max(getTotalSnippetCount(languageId), publicCount + premiumCount)
  return Math.max(0, knownTotal - PUBLIC_SNIPPET_LIMIT)
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

  const publicSnippets = buildTrackSnippets(track, language)
  const premiumSnippets = await loadPremiumSnippets(language.id)
  const lockedCount = getLockedCount(language.id, publicSnippets.length, premiumSnippets.length, access)

  return {
    availableLanguages,
    selectedLanguage: toLanguageMeta(language),
    snippets: applyAccessWall(publicSnippets, premiumSnippets, access),
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
  const lockedCount = getLockedCount(language.id, language.snippets.length, premiumSnippets.length, access)

  return {
    language: toLanguageMeta(language),
    snippets: applyAccessWall(language.snippets, premiumSnippets, access),
    access,
    wall: {
      isLocked: lockedCount > 0,
      freeSnippetLimit: PUBLIC_SNIPPET_LIMIT,
      lockedCount,
      requiredPlan: 'plus' as const,
    },
  }
}
