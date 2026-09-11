import { getTrackById, tracks, type Track } from '@/data/tracks'
import { codeLanguages, languages, textLanguages } from '@/data'
import {
  FREE_TRACK_SNIPPET_LIMIT,
  freeTrackSnippetRegistry,
  trackSnippetTotalRegistry,
} from '@/data/generated/free-track-snippets'
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
  const supportedIds = new Set(Object.keys(freeTrackSnippetRegistry[track.id] ?? {}))

  return sourceLanguages
    .filter((language) => supportedIds.has(language.id))
    .map(toLanguageMeta)
}

export async function listTrackLanguageBadges(): Promise<Record<string, LanguageMeta[]>> {
  const entries = await Promise.all(
    tracks.map(async (track) => [track.id, await getTrackLanguages(track)] as const)
  )

  return Object.fromEntries(entries)
}

function applyLanguageAccessWall(snippets: Snippet[], access: UserAccess): Snippet[] {
  if (access.isPlus) return snippets
  return snippets.slice(0, PUBLIC_SNIPPET_LIMIT)
}

function buildPracticeWall(
  freeSnippetLimit: number,
  premiumCount: number,
  access: UserAccess,
  hasPlusContent = premiumCount > 0,
) {
  const lockedCount = access.isPlus ? 0 : premiumCount
  return {
    isLocked: lockedCount > 0,
    hasPlusContent,
    hasPlusAccess: access.isPlus,
    freeSnippetLimit,
    lockedCount,
    premiumCount,
    requiredPlan: 'plus' as const,
  }
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
  const trackHasPlusContent = (track.accessPolicy ?? 'plus_after_limit') !== 'free'

  if (!selectedLanguageMeta) {
    return {
      availableLanguages,
      selectedLanguage: null,
      snippets: [] as Snippet[],
      access,
      wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, 0, access, trackHasPlusContent),
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
      wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, 0, access, trackHasPlusContent),
    }
  }

  const freeTrackSnippets = freeTrackSnippetRegistry[track.id]?.[language.id] ?? []
  const expectedTotal = trackSnippetTotalRegistry[track.id]?.[language.id] ?? freeTrackSnippets.length
  const premiumCount = Math.max(0, expectedTotal - freeTrackSnippets.length)

  let snippets = freeTrackSnippets

  if (access.isPlus) {
    const allLanguageSnippets = await getFullLanguageSnippets(language)
    const fullTrackSnippets = buildTrackSnippets(track, allLanguageSnippets)

    if (fullTrackSnippets.length < expectedTotal) {
      console.error(JSON.stringify({
        event: 'premium_content_incomplete',
        track_id: track.id,
        language_id: language.id,
        expected_total: expectedTotal,
        resolved_total: fullTrackSnippets.length,
      }))
    }

    snippets = fullTrackSnippets.length >= freeTrackSnippets.length
      ? fullTrackSnippets
      : freeTrackSnippets
  }

  return {
    availableLanguages,
    selectedLanguage: toLanguageMeta(language),
    snippets,
    access,
    wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, premiumCount, access, trackHasPlusContent),
  }
}

export async function getLanguagePracticePayload(languageId: string, access: UserAccess) {
  const language = languages.find((entry) => entry.id === languageId)
  if (!language) return null

  const allSnippets = await getFullLanguageSnippets(language)
  const expectedTotal = Math.max(getTotalSnippetCount(language.id), allSnippets.length)
  const premiumCount = Math.max(0, expectedTotal - PUBLIC_SNIPPET_LIMIT)

  return {
    language: toLanguageMeta(language),
    snippets: applyLanguageAccessWall(allSnippets, access),
    access,
    wall: buildPracticeWall(PUBLIC_SNIPPET_LIMIT, premiumCount, access),
  }
}
