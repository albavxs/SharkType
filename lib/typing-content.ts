import type { Snippet } from '@/lib/types'

export interface TypingTrackReference {
  id: string
  snippetIds: readonly string[]
  textLanguages?: true
}

export interface TypingContentAudit {
  id: string
  rawLength: number
  spaceCount: number
  normalizedLength: number
  repeatedSpaceRuns: number[]
}

function getTypingNumber(id: string): number | null {
  const match = /^typing-(\d{3})$/.exec(id)
  return match ? Number(match[1]) : null
}

export function auditTypingSnippets(snippets: readonly Snippet[]): TypingContentAudit[] {
  return snippets
    .filter((snippet) => getTypingNumber(snippet.id) !== null)
    .map((snippet) => {
      const repeatedSpaceRuns = [...snippet.code.matchAll(/ {2,}/g)].map((match) => match[0].length)

      return {
        id: snippet.id,
        rawLength: snippet.code.length,
        spaceCount: [...snippet.code].filter((character) => character === ' ').length,
        normalizedLength: snippet.code.replace(/ +/g, ' ').length,
        repeatedSpaceRuns,
      }
    })
}

/**
 * Fails during the build when the text-typing catalog is incomplete or
 * contains characters that the typing renderer cannot represent faithfully.
 * Repeated internal spaces are intentionally allowed and audited rather than
 * normalized: they are part of several keyboard-position drills.
 */
export function validateTypingCatalog(
  snippets: readonly Snippet[],
  tracks: readonly TypingTrackReference[],
  context = 'text-typing',
): TypingContentAudit[] {
  const issues: string[] = []
  const typingSnippets = snippets.filter((snippet) => getTypingNumber(snippet.id) !== null)
  const snippetById = new Map<string, Snippet>()

  for (const snippet of typingSnippets) {
    if (snippetById.has(snippet.id)) {
      issues.push(`snippet duplicado: ${snippet.id}`)
    }
    snippetById.set(snippet.id, snippet)

    if (snippet.code.trim().length === 0) {
      issues.push(`${snippet.id}: texto vazio ou composto apenas por espaços`)
    }
    if (/^\s|\s$/.test(snippet.code)) {
      issues.push(`${snippet.id}: texto não pode começar ou terminar com whitespace`)
    }
    if (/[\t\r\n\u200B-\u200D\uFEFF]/.test(snippet.code)) {
      issues.push(`${snippet.id}: contém tabulação, quebra de linha ou caractere invisível`)
    }
  }

  for (let number = 1; number <= 100; number += 1) {
    const id = `typing-${String(number).padStart(3, '0')}`
    if (!snippetById.has(id)) issues.push(`snippet ausente: ${id}`)
  }

  const referenceCounts = new Map<string, number>()
  for (const track of tracks) {
    if (!track.textLanguages || track.snippetIds.length === 0) continue

    for (const snippetId of track.snippetIds) {
      if (!snippetById.has(snippetId)) {
        issues.push(`trilha ${track.id} referencia snippet inexistente: ${snippetId}`)
        continue
      }
      referenceCounts.set(snippetId, (referenceCounts.get(snippetId) ?? 0) + 1)
    }
  }

  for (let number = 21; number <= 100; number += 1) {
    const id = `typing-${String(number).padStart(3, '0')}`
    const references = referenceCounts.get(id) ?? 0
    if (references !== 1) {
      issues.push(`${id}: esperado em exatamente uma trilha nova, encontrado em ${references}`)
    }
  }

  if (issues.length > 0) {
    throw new Error(`[typing-content] Validação falhou em "${context}":\n- ${issues.join('\n- ')}`)
  }

  return auditTypingSnippets(typingSnippets)
}
