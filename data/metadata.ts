import type { LanguageMeta } from '@/lib/types'
import { languageManifest } from './manifest'

const languageMetas = languageManifest.map((entry) => ({
  id: entry.id,
  label: entry.label,
  color: entry.color,
}))

export const codeLanguageMetas: LanguageMeta[] = languageManifest
  .filter((entry) => entry.type === 'code')
  .map((entry) => ({
    id: entry.id,
    label: entry.label,
    color: entry.color,
  }))

export const textLanguageMetas: LanguageMeta[] = languageManifest
  .filter((entry) => entry.type === 'text')
  .map((entry) => ({
    id: entry.id,
    label: entry.label,
    color: entry.color,
  }))

export function getLanguageMetaById(id: string): LanguageMeta | undefined {
  return languageMetas.find((language) => language.id === id)
}

export function getAllLanguageMetas(): LanguageMeta[] {
  return languageMetas.slice()
}
