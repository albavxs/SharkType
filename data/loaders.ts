import type { Language, PracticeWall, Snippet } from '@/lib/types'
import { getLanguageMetaById } from './metadata'

interface PracticePayload {
  language?: {
    id: string
    label: string
    color: string
  }
  snippets?: Snippet[]
  wall?: PracticeWall
}

export function getBundledLanguageById(id: string): Language | null {
  void id
  return null
}

export async function loadLanguageById(id: string): Promise<Language | null> {
  const meta = getLanguageMetaById(id)
  if (!meta) return null

  const response = await fetch(`/api/languages/${encodeURIComponent(id)}/practice`, { cache: 'no-store' })
  if (!response.ok) return null

  const payload = (await response.json()) as PracticePayload
  return {
    ...(payload.language ?? meta),
    snippets: payload.snippets ?? [],
    wall: payload.wall,
  }
}
