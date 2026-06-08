import { Snippet } from './types'

interface BlockPair {
  start: string
  end: string
}

interface BoilerplateBlock {
  start: RegExp
  end: RegExp
}

interface SnippetSanitizerConfig {
  lineCommentPatterns: RegExp[]
  blockCommentPairs: BlockPair[]
  boilerplatePatterns: RegExp[]
  boilerplateBlocks?: BoilerplateBlock[]
}

const textLanguagePrefix = 'text-'

const sharedSlashBlock: BlockPair = { start: '/*', end: '*/' }

const jsFamilyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [
    /^import\s.+;?$/,
    /^export\s+\*\s+from\s+['"].+['"];?$/,
    /^export\s+\{.+\}\s+from\s+['"].+['"];?$/,
    /^(const|let|var)\s+.+=\s*require\(.+\);?$/,
    /^require\(.+\);?$/,
  ],
}

const shellFamilyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^#(?!\!)/],
  blockCommentPairs: [],
  boilerplatePatterns: [],
}

const yamlFamilyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^#/],
  blockCommentPairs: [],
  boilerplatePatterns: [],
}

const htmlFamilyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [],
  blockCommentPairs: [{ start: '<!--', end: '-->' }],
  boilerplatePatterns: [],
}

const pythonFamilyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^#(?!\!)/],
  blockCommentPairs: [{ start: "'''", end: "'''" }, { start: '"""', end: '"""' }, { start: '{#', end: '#}' }],
  boilerplatePatterns: [/^from\s+[\w.]+\s+import\s+.+$/, /^import\s+[\w.,\s]+$/],
}

const javaFamilyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [/^package\s+[\w.]+;?$/, /^import\s+(static\s+)?[\w.*]+\s*;?$/],
}

const swiftConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [/^import\s+\w+(?:\.\w+)*$/],
}

const rustConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [/^use\s+[\w:.*{},\s]+\s*;?$/],
}

const goConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [/^import\s+["`].+["`]$/],
  boilerplateBlocks: [{ start: /^import\s*\($/, end: /^\)$/ }],
}

const cppConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [/^#include\s+[<"].+[>"]$/, /^using\s+namespace\s+\w+\s*;?$/],
}

const rubyConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^#/],
  blockCommentPairs: [{ start: '=begin', end: '=end' }],
  boilerplatePatterns: [/^require(?:_relative)?\s+['"].+['"]$/],
}

const cssConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [/^@import\s.+;?$/],
}

const sqlConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^--/],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [],
}

const defaultCodeConfig: SnippetSanitizerConfig = {
  lineCommentPatterns: [/^\/\//],
  blockCommentPairs: [sharedSlashBlock],
  boilerplatePatterns: [],
}

export function calculateWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(correctChars / 5 / minutes)
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

export function getRandomSnippet(snippets: Snippet[], currentId?: string): Snippet {
  const pool = snippets.filter(s => s.id !== currentId)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function calculateRawWPM(totalChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(totalChars / 5 / minutes)
}

export function calculateConsistency(wpmSamples: number[]): number {
  if (wpmSamples.length < 2) return 100
  const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length
  if (mean === 0) return 100
  const variance = wpmSamples.reduce((sum, v) => sum + (v - mean) ** 2, 0) / wpmSamples.length
  const stddev = Math.sqrt(variance)
  return Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100)))
}

function getSnippetSanitizerConfig(languageId: string): SnippetSanitizerConfig {
  if (['javascript', 'typescript', 'react', 'vue', 'nextjs', 'angular', 'nodejs', 'testing', 'patterns', 'algorithms', 'mongodb'].includes(languageId)) {
    return jsFamilyConfig
  }

  if (['bash', 'linux', 'nmap', 'web-recon', 'firewall', 'network-analysis', 'hardening', 'crypto'].includes(languageId)) {
    return shellFamilyConfig
  }

  if (['terraform', 'ansible', 'cicd', 'kubernetes', 'git', 'docker'].includes(languageId)) {
    return yamlFamilyConfig
  }

  if (languageId === 'html') return htmlFamilyConfig
  if (['python', 'jinja'].includes(languageId)) return pythonFamilyConfig
  if (['java', 'kotlin', 'scala'].includes(languageId)) return javaFamilyConfig
  if (languageId === 'swift') return swiftConfig
  if (languageId === 'rust') return rustConfig
  if (languageId === 'go') return goConfig
  if (languageId === 'cpp') return cppConfig
  if (languageId === 'ruby') return rubyConfig
  if (languageId === 'css') return cssConfig
  if (languageId === 'sql') return sqlConfig
  if (languageId === 'lua') return { ...shellFamilyConfig, lineCommentPatterns: [/^--/] }

  return defaultCodeConfig
}

function isStandaloneBlockCommentLine(trimmed: string, pair: BlockPair): boolean {
  return trimmed.startsWith(pair.start) && trimmed.endsWith(pair.end)
}

export function sanitizeSnippetForTyping(code: string, languageId: string): string {
  if (languageId.startsWith(textLanguagePrefix)) return code

  const config = getSnippetSanitizerConfig(languageId)
  const lines = code.split('\n')
  const sanitized: string[] = []

  let blockCommentEnd: string | null = null
  let boilerplateBlockEnd: RegExp | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (blockCommentEnd) {
      if (trimmed.endsWith(blockCommentEnd)) blockCommentEnd = null
      continue
    }

    if (boilerplateBlockEnd) {
      if (boilerplateBlockEnd.test(trimmed)) boilerplateBlockEnd = null
      continue
    }

    if (trimmed.length === 0) {
      sanitized.push('')
      continue
    }

    const blockPair = config.blockCommentPairs.find(pair => trimmed.startsWith(pair.start))
    if (blockPair) {
      if (!isStandaloneBlockCommentLine(trimmed, blockPair)) {
        blockCommentEnd = blockPair.end
      }
      continue
    }

    if (config.lineCommentPatterns.some(pattern => pattern.test(trimmed))) {
      continue
    }

    const boilerplateBlock = config.boilerplateBlocks?.find(block => block.start.test(trimmed))
    if (boilerplateBlock) {
      boilerplateBlockEnd = boilerplateBlock.end
      continue
    }

    if (config.boilerplatePatterns.some(pattern => pattern.test(trimmed))) {
      continue
    }

    sanitized.push(line)
  }

  return sanitized.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function generateChallengeSequence(snippets: Snippet[]): Snippet[] {
  const shuffled = [...snippets]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
