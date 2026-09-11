import type { Snippet } from '@/lib/types'

type PremiumContentModule = {
  getPremiumSnippets?: (languageId: string) => Snippet[] | Promise<Snippet[]>
  premiumSnippetRegistry?: Record<string, Snippet[]>
}

export interface PremiumContentHealth {
  available: boolean
  module: string
  samplePremiumCounts: Record<string, number>
  error: string | null
}

export class PremiumContentUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PremiumContentUnavailableError'
  }
}

const DEFAULT_PREMIUM_MODULE = '@albavxs/sharktype-premium'
let premiumModulePromise: Promise<PremiumContentModule | null> | null = null
let premiumModuleError: string | null = null

function getPremiumModuleSpecifier(): string {
  return process.env.SHARKTYPE_PREMIUM_CONTENT_MODULE?.trim() || DEFAULT_PREMIUM_MODULE
}

async function importPremiumModule(): Promise<PremiumContentModule | null> {
  if (premiumModulePromise) return premiumModulePromise

  const specifier = getPremiumModuleSpecifier()
  premiumModulePromise = (async () => {
    try {
      const dynamicImport = new Function('specifier', 'return import(specifier)') as (
        specifier: string
      ) => Promise<PremiumContentModule>
      const module = await dynamicImport(specifier)
      premiumModuleError = null
      return module
    } catch (error) {
      premiumModuleError = error instanceof Error ? error.message : String(error)
      console.error('[premium-content] private package unavailable:', premiumModuleError)
      return null
    }
  })()

  return premiumModulePromise
}

async function resolvePremiumSnippets(
  premiumModule: PremiumContentModule,
  languageId: string,
): Promise<Snippet[]> {
  if (premiumModule.getPremiumSnippets) {
    return premiumModule.getPremiumSnippets(languageId)
  }

  return premiumModule.premiumSnippetRegistry?.[languageId] ?? []
}

export async function loadPremiumSnippets(
  languageId: string,
  options: { required?: boolean } = {},
): Promise<Snippet[]> {
  const premiumModule = await importPremiumModule()
  if (!premiumModule) {
    if (options.required) {
      throw new PremiumContentUnavailableError(
        `Premium content module ${getPremiumModuleSpecifier()} is unavailable.`,
      )
    }
    return []
  }

  try {
    return await resolvePremiumSnippets(premiumModule, languageId)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[premium-content] failed to load ${languageId}:`, message)
    if (options.required) {
      throw new PremiumContentUnavailableError(`Premium content for ${languageId} could not be loaded.`)
    }
    return []
  }
}

export async function getPremiumContentHealth(
  sampleLanguageIds: string[] = ['react', 'git'],
): Promise<PremiumContentHealth> {
  const premiumModule = await importPremiumModule()
  const specifier = getPremiumModuleSpecifier()

  if (!premiumModule) {
    return {
      available: false,
      module: specifier,
      samplePremiumCounts: {},
      error: premiumModuleError ?? 'Premium module could not be imported.',
    }
  }

  const samplePremiumCounts: Record<string, number> = {}
  try {
    for (const languageId of sampleLanguageIds) {
      const snippets = await resolvePremiumSnippets(premiumModule, languageId)
      samplePremiumCounts[languageId] = snippets.length
    }

    return {
      available: true,
      module: specifier,
      samplePremiumCounts,
      error: null,
    }
  } catch (error) {
    return {
      available: false,
      module: specifier,
      samplePremiumCounts,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
