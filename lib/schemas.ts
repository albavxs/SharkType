import { z } from 'zod'

/**
 * Schemas Zod para validacao runtime dos dados de snippets/linguagens.
 * Em desenvolvimento, falhas dao throw com mensagem detalhada.
 * Em producao, falhas viram warning no console (nao quebrar o app do usuario).
 *
 * Tipos canonicos continuam em lib/types.ts — estes schemas espelham aqueles tipos.
 */

export const I18nStringSchema = z.object({
  pt: z.string().min(1),
  en: z.string().min(1),
})

export const DifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const SnippetSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  concept: I18nStringSchema,
  difficulty: DifficultySchema,
  prompt: I18nStringSchema.optional(),
  slot: z.string().optional(),
})

export const LanguageSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'cor deve ser hex #rrggbb'),
  snippets: z.array(SnippetSchema).min(1, 'linguagem precisa de pelo menos 1 snippet'),
})

export const LanguageListSchema = z.array(LanguageSchema)

/**
 * Valida um array de Language. Em dev, throw. Em prod, log + return original.
 * Detecta ids duplicados de linguagem e de snippet (escopo: dentro da mesma linguagem).
 */
export function validateLanguages<T>(languages: T, context = 'languages'): T {
  const isDev = process.env.NODE_ENV !== 'production'
  const result = LanguageListSchema.safeParse(languages)

  if (!result.success) {
    const message = `[schemas] Validacao falhou em "${context}":\n${result.error.message}`
    if (isDev) throw new Error(message)
    console.warn(message)
    return languages
  }

  // Validacao adicional: ids unicos
  const langIds = new Set<string>()
  for (const lang of result.data) {
    if (langIds.has(lang.id)) {
      const msg = `[schemas] ID de linguagem duplicado: "${lang.id}"`
      if (isDev) throw new Error(msg)
      console.warn(msg)
    }
    langIds.add(lang.id)

    const snippetIds = new Set<string>()
    for (const snip of lang.snippets) {
      if (snippetIds.has(snip.id)) {
        const msg = `[schemas] Snippet duplicado em "${lang.id}": "${snip.id}"`
        if (isDev) throw new Error(msg)
        console.warn(msg)
      }
      snippetIds.add(snip.id)
    }
  }

  return languages
}
