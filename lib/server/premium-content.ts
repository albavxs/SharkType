import type { Snippet } from '@/lib/types'

type PremiumContentModule = {
  getPremiumSnippets?: (languageId: string) => Snippet[] | Promise<Snippet[]>
  premiumSnippetRegistry?: Record<string, Snippet[]>
}

const DEFAULT_PREMIUM_MODULE = '@sharktype/premium-content'

async function importPremiumModule(): Promise<PremiumContentModule | null> {
  const specifier = process.env.SHARKTYPE_PREMIUM_CONTENT_MODULE ?? DEFAULT_PREMIUM_MODULE

  try {
    const dynamicImport = new Function('specifier', 'return import(specifier)') as (
      specifier: string
    ) => Promise<PremiumContentModule>
    return await dynamicImport(specifier)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[premium-content] private package unavailable:', error instanceof Error ? error.message : error)
    }
    return null
  }
}

export async function loadPremiumSnippets(languageId: string): Promise<Snippet[]> {
  const premiumModule = await importPremiumModule()
  if (!premiumModule) return []

  if (premiumModule.getPremiumSnippets) {
    return premiumModule.getPremiumSnippets(languageId)
  }

  return premiumModule.premiumSnippetRegistry?.[languageId] ?? []
}
