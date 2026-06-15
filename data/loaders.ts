import type { Language, Snippet } from '@/lib/types'
import { getLanguageMetaById } from './metadata'

type SnippetLoader = () => Promise<Snippet[]>

const snippetLoaders: Record<string, SnippetLoader> = {
  cpp: async () => (await import('./cpp')).cppSnippets,
  javascript: async () => (await import('./javascript')).javascriptSnippets,
  typescript: async () => (await import('./typescript')).typescriptSnippets,
  python: async () => (await import('./python')).pythonSnippets,
  rust: async () => (await import('./rust')).rustSnippets,
  go: async () => (await import('./go')).goSnippets,
  java: async () => (await import('./java')).javaSnippets,
  kotlin: async () => (await import('./kotlin')).kotlinSnippets,
  scala: async () => (await import('./scala')).scalaSnippets,
  swift: async () => (await import('./swift')).swiftSnippets,
  ruby: async () => (await import('./ruby')).rubySnippets,
  lua: async () => (await import('./lua')).luaSnippets,
  html: async () => (await import('./html')).htmlSnippets,
  css: async () => (await import('./css')).cssSnippets,
  sql: async () => (await import('./sql')).sqlSnippets,
  bash: async () => (await import('./bash')).bashSnippets,
  docker: async () => (await import('./docker')).dockerSnippets,
  git: async () => (await import('./git')).gitSnippets,
  linux: async () => (await import('./linux')).linuxSnippets,
  kubernetes: async () => (await import('./kubernetes')).kubernetesSnippets,
  terraform: async () => (await import('./terraform')).terraformSnippets,
  ansible: async () => (await import('./ansible')).ansibleSnippets,
  cicd: async () => (await import('./cicd')).cicdSnippets,
  nmap: async () => (await import('./cybersec')).nmapSnippets,
  'web-recon': async () => (await import('./cybersec')).webReconSnippets,
  firewall: async () => (await import('./cybersec')).firewallSnippets,
  'network-analysis': async () => (await import('./cybersec')).networkAnalysisSnippets,
  hardening: async () => (await import('./cybersec')).hardeningSnippets,
  crypto: async () => (await import('./cybersec')).cryptoSnippets,
  vue: async () => (await import('./vue')).vueSnippets,
  react: async () => (await import('./react')).reactSnippets,
  nodejs: async () => (await import('./nodejs')).nodejsSnippets,
  testing: async () => (await import('./testing')).testingSnippets,
  patterns: async () => (await import('./patterns')).patternsSnippets,
  algorithms: async () => (await import('./algorithms')).algorithmsSnippets,
  mongodb: async () => (await import('./mongodb')).mongodbSnippets,
  jinja: async () => (await import('./jinja')).jinjaSnippets,
  nextjs: async () => (await import('./nextjs')).nextjsSnippets,
  angular: async () => (await import('./angular')).angularSnippets,
  'text-typing': async () => (await import('./text-typing')).typingSnippets,
  'text-ptbr': async () => (await import('./text-ptbr')).ptbrSnippets,
  'text-en': async () => (await import('./text-en')).enSnippets,
  'text-es': async () => (await import('./text-es')).esSnippets,
  'text-fr': async () => (await import('./text-fr')).frSnippets,
}

export async function loadLanguageById(id: string): Promise<Language | null> {
  const meta = getLanguageMetaById(id)
  const loader = snippetLoaders[id]

  if (!meta || !loader) {
    return null
  }

  const snippets = await loader()
  return { ...meta, snippets }
}
