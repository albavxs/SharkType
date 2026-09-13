import { getTrackById, tracks, type Track } from '@/data/tracks'
import { codeLanguages, languages, textLanguages } from '@/data'
import {
  FREE_TRACK_SNIPPET_LIMIT,
  freeTrackSnippetRegistry,
  trackSnippetTotalRegistry,
} from '@/data/generated/free-track-snippets'
import { loadPremiumSnippets, PremiumContentUnavailableError } from '@/lib/server/premium-content'
import { getBaseSnippetsForLanguage } from '@/lib/server/base-practice'
import type { Language, LanguageMeta, Snippet } from '@/lib/types'
import { getLanguageMetaById } from '@/data/metadata'
import type { UserAccess } from './access-control'

const fullLanguageSnippetCache = new Map<string, Promise<Snippet[]>>()

const ALWAYS_MASTERY_CONCEPTS = new Set([
  'conditionals',
  'variables',
  'functions',
  'objects',
  'loops',
  'types',
  'errors',
  'classes',
  'advanced',
])

export interface TrackAccessSummary {
  plusEligible: boolean
  hasPremiumNow: boolean
  freeCount: number
  totalCount: number
  premiumCount: number
}

export interface TrackMasterySummary {
  eligible: boolean
  available: boolean
  challengeCount: number
  totalStars: number
}

export interface TrackBaseUnit {
  key: string
  snippetIds: string[]
}

export interface TrackBaseSummary {
  totalUnits: number
  units: TrackBaseUnit[]
}

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

  const pending = loadPremiumSnippets(language.id, { required: true })
    .then((premiumSnippets) => mergeSnippets(language.snippets, premiumSnippets))
    .catch((error) => {
      fullLanguageSnippetCache.delete(language.id)
      throw error
    })

  fullLanguageSnippetCache.set(language.id, pending)
  return pending
}

function assertPremiumCoverage(input: {
  trackId?: string
  languageId: string
  expectedTotal: number
  resolvedTotal: number
}) {
  if (input.resolvedTotal >= input.expectedTotal) return

  console.error(JSON.stringify({
    event: 'premium_content_incomplete',
    track_id: input.trackId ?? null,
    language_id: input.languageId,
    expected_total: input.expectedTotal,
    resolved_total: input.resolvedTotal,
  }))

  throw new PremiumContentUnavailableError(
    `Premium content for ${input.languageId} is incomplete (${input.resolvedTotal}/${input.expectedTotal}).`,
  )
}

function isTrackMasteryEligible(track: Track, summary: TrackAccessSummary): boolean {
  if (track.textLanguages) return false
  if (track.section === 'concept') return ALWAYS_MASTERY_CONCEPTS.has(track.id)
  if (track.section === 'focused' || track.section === 'cyberdevops') return summary.totalCount > 4
  return false
}

function buildTrackBaseSummary(track: Track): TrackBaseSummary {
  const freeByLanguage = freeTrackSnippetRegistry[track.id] ?? {}
  const languageSnippets = Object.values(freeByLanguage)

  if (track.slots?.length) {
    const units = track.slots
      .map((slot) => {
        const snippetIds = Array.from(new Set(
          languageSnippets
            .flatMap((snippets) => snippets)
            .filter((snippet) => snippet.slot === slot)
            .map((snippet) => snippet.id),
        ))

        return {
          key: `slot:${slot}`,
          snippetIds,
        }
      })
      .filter((unit) => unit.snippetIds.length > 0)

    return {
      totalUnits: units.length,
      units,
    }
  }

  const maxUnits = languageSnippets.reduce(
    (max, snippets) => Math.max(max, snippets.length),
    0,
  )

  const units = Array.from({ length: maxUnits }, (_, index) => {
    const snippetIds = Array.from(new Set(
      languageSnippets
        .map((snippets) => snippets[index]?.id)
        .filter((snippetId): snippetId is string => Boolean(snippetId)),
    ))

    return {
      key: `unit:${index + 1}`,
      snippetIds,
    }
  }).filter((unit) => unit.snippetIds.length > 0)

  return {
    totalUnits: units.length,
    units,
  }
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

export function listTrackBaseSummary(): Record<string, TrackBaseSummary> {
  return Object.fromEntries(
    tracks.map((track) => [track.id, buildTrackBaseSummary(track)] as const),
  )
}

export function listTrackAccessSummary(): Record<string, TrackAccessSummary> {
  return Object.fromEntries(
    tracks.map((track) => {
      const freeByLanguage = freeTrackSnippetRegistry[track.id] ?? {}
      const totalByLanguage = trackSnippetTotalRegistry[track.id] ?? {}
      const languageIds = new Set([
        ...Object.keys(freeByLanguage),
        ...Object.keys(totalByLanguage),
      ])

      let freeCount = 0
      let totalCount = 0

      for (const languageId of languageIds) {
        const free = freeByLanguage[languageId]?.length ?? 0
        const total = totalByLanguage[languageId] ?? free
        freeCount += free
        totalCount += total
      }

      const premiumCount = Math.max(0, totalCount - freeCount)
      const plusEligible = !track.textLanguages && (track.accessPolicy ?? 'plus_after_limit') !== 'free'

      return [
        track.id,
        {
          plusEligible,
          hasPremiumNow: plusEligible && premiumCount > 0,
          freeCount,
          totalCount,
          premiumCount,
        },
      ] as const
    }),
  )
}

export function listTrackMasterySummary(): Record<string, TrackMasterySummary> {
  const accessSummary = listTrackAccessSummary()

  return Object.fromEntries(
    tracks.map((track) => {
      const summary = accessSummary[track.id] ?? {
        plusEligible: false,
        hasPremiumNow: false,
        freeCount: 0,
        totalCount: 0,
        premiumCount: 0,
      }
      const eligible = isTrackMasteryEligible(track, summary)
      const challengeCount = eligible ? summary.premiumCount : 0

      return [
        track.id,
        {
          eligible,
          available: eligible && challengeCount > 0,
          challengeCount,
          totalStars: challengeCount * 3,
        },
      ] as const
    }),
  )
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

  if (!selectedLanguageMeta) {
    return {
      availableLanguages,
      selectedLanguage: null,
      snippets: [] as Snippet[],
      access,
      wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, 0, access, false),
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
      wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, 0, access, false),
    }
  }

  const freeTrackSnippets = freeTrackSnippetRegistry[track.id]?.[language.id] ?? []

  return {
    availableLanguages,
    selectedLanguage: toLanguageMeta(language),
    snippets: freeTrackSnippets,
    access,
    wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, 0, access, false),
  }
}

export async function getTrackMasteryPayload(
  trackId: string,
  requestedLanguageId: string | null | undefined,
  access: UserAccess
) {
  const track = getTrackById(trackId)
  if (!track || track.textLanguages) return null

  const summary = listTrackMasterySummary()[track.id]
  if (!summary?.eligible || !summary.available) return null

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
      mastery: summary,
    }
  }

  const language = sourceLanguages.find((entry) => entry.id === selectedLanguageMeta.id)
  if (!language) return null

  const baseSnippets = freeTrackSnippetRegistry[track.id]?.[language.id] ?? []
  const baseIds = new Set(baseSnippets.map((snippet) => snippet.id))
  const expectedTotal = trackSnippetTotalRegistry[track.id]?.[language.id] ?? baseSnippets.length
  const allLanguageSnippets = await getFullLanguageSnippets(language)
  const fullTrackSnippets = buildTrackSnippets(track, allLanguageSnippets)

  assertPremiumCoverage({
    trackId: track.id,
    languageId: language.id,
    expectedTotal,
    resolvedTotal: fullTrackSnippets.length,
  })

  const masterySnippets = fullTrackSnippets.filter((snippet) => !baseIds.has(snippet.id))

  return {
    availableLanguages,
    selectedLanguage: toLanguageMeta(language),
    snippets: masterySnippets,
    access,
    mastery: {
      eligible: true,
      available: masterySnippets.length > 0,
      challengeCount: masterySnippets.length,
      totalStars: masterySnippets.length * 3,
    },
  }
}

export async function getLanguagePracticePayload(languageId: string, access: UserAccess) {
  const language = languages.find((entry) => entry.id === languageId)
  if (!language) return null

  const snippets = getBaseSnippetsForLanguage(language.id)

  return {
    language: toLanguageMeta(language),
    snippets,
    access,
    wall: buildPracticeWall(FREE_TRACK_SNIPPET_LIMIT, 0, access, false),
  }
}
