import type { Snippet } from '@/lib/types'

const unavailableMessage =
  'SharkType premium package is not installed in this environment. Configure GITHUB_PACKAGES_TOKEN before building to enable Plus content.'

export async function getPremiumSnippets(_languageId: string): Promise<Snippet[]> {
  throw new Error(unavailableMessage)
}

export async function getAllSnippets(_languageId: string): Promise<Snippet[]> {
  throw new Error(unavailableMessage)
}

export const premiumLanguageIds = Object.freeze([] as string[])
