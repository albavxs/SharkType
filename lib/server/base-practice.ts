import { freeTrackSnippetRegistry } from '@/data/generated/free-track-snippets'
import { getAllLanguageMetas, getLanguageMetaById } from '@/data/metadata'
import type { LanguageMeta, Snippet } from '@/lib/types'

export interface QuickPracticePayload {
  availableLanguages: LanguageMeta[]
  selectedLanguage: LanguageMeta | null
  snippets: Snippet[]
}

function listBaseLanguageIds(): string[] {
  const ids = new Set<string>()

  for (const languages of Object.values(freeTrackSnippetRegistry)) {
    for (const languageId of Object.keys(languages)) {
      ids.add(languageId)
    }
  }

  return [...ids]
}

export function getQuickPracticeLanguages(): LanguageMeta[] {
  const supportedIds = new Set(listBaseLanguageIds())

  return getAllLanguageMetas().filter((language) => supportedIds.has(language.id))
}

export function getBaseSnippetsForLanguage(languageId: string): Snippet[] {
  const seen = new Set<string>()
  const snippets: Snippet[] = []

  for (const languages of Object.values(freeTrackSnippetRegistry)) {
    for (const snippet of languages[languageId] ?? []) {
      if (seen.has(snippet.id)) continue
      seen.add(snippet.id)
      snippets.push(snippet)
    }
  }

  return snippets
}

export function getQuickPracticePayload(requestedLanguageId: string | null | undefined): QuickPracticePayload {
  const availableLanguages = getQuickPracticeLanguages()
  const selectedLanguage =
    (requestedLanguageId
      ? availableLanguages.find((language) => language.id === requestedLanguageId)
      : null) ?? availableLanguages[0] ?? null

  if (!selectedLanguage) {
    return {
      availableLanguages,
      selectedLanguage: null,
      snippets: [],
    }
  }

  return {
    availableLanguages,
    selectedLanguage: getLanguageMetaById(selectedLanguage.id) ?? selectedLanguage,
    snippets: getBaseSnippetsForLanguage(selectedLanguage.id),
  }
}
