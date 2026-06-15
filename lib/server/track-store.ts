import { getTrackById, tracks, type Track } from '@/data/tracks'
import { languages, textLanguages } from '@/data'
import type { Language, LanguageMeta, Snippet } from '@/lib/types'
import { getLanguageMetaById } from '@/data/metadata'

function toLanguageMeta(language: Language): LanguageMeta {
  return {
    id: language.id,
    label: language.label,
    color: language.color,
  }
}

export function getTrackLanguages(track: Track): LanguageMeta[] {
  if (track.textLanguages) {
    const source = track.snippetIds.length > 0
      ? textLanguages.filter((language) => language.id === 'text-typing')
      : textLanguages.filter((language) => language.id !== 'text-typing')

    return source.map(toLanguageMeta)
  }

  if (track.slots && track.slots.length > 0) {
    return languages
      .filter((language) =>
        language.snippets.some((snippet) => snippet.slot && track.slots!.includes(snippet.slot))
      )
      .map(toLanguageMeta)
  }

  const seen = new Set<string>()
  const result: LanguageMeta[] = []

  for (const snippetId of track.snippetIds) {
    for (const language of languages) {
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
      return track.snippetIds
        .map((snippetId) => language.snippets.find((snippet) => snippet.id === snippetId))
        .filter((snippet): snippet is Snippet => Boolean(snippet))
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

export function getTrackPracticePayload(trackId: string, requestedLanguageId?: string | null) {
  const track = getTrackById(trackId)
  if (!track) return null

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
    }
  }

  const language = languages.find((entry) => entry.id === selectedLanguageMeta.id)
  if (!language) {
    const fallbackMeta = getLanguageMetaById(selectedLanguageMeta.id) ?? selectedLanguageMeta
    return {
      availableLanguages,
      selectedLanguage: fallbackMeta,
      snippets: [] as Snippet[],
    }
  }

  return {
    availableLanguages,
    selectedLanguage: toLanguageMeta(language),
    snippets: buildTrackSnippets(track, language),
  }
}
