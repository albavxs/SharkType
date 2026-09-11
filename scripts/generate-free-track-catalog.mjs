import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import * as ts from 'typescript'

const SOURCE_COMMIT = process.env.SHARKTYPE_SOURCE_COMMIT ?? 'cdb34f8242e22417ee2484a062546c797c2650d5'
const PUBLIC_LIMIT = 6
const DEFAULT_ACCESS_POLICY = 'plus_after_limit'
const outputPath = path.resolve('data/generated/free-track-snippets.ts')
const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'sharktype-free-tracks-'))
let moduleCounter = 0

async function importTypescriptSource(source, label) {
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: `${label}.ts`,
  }).outputText

  const filePath = path.join(tempRoot, `${String(moduleCounter++).padStart(3, '0')}-${label}.mjs`)
  await writeFile(filePath, transpiled, 'utf8')
  return import(`${pathToFileURL(filePath).href}?v=${moduleCounter}`)
}

function historicalSource(relativePath) {
  try {
    return execFileSync('git', ['show', `${SOURCE_COMMIT}:${relativePath}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return null
  }
}

function buildTrackSnippets(track, snippets) {
  if (track.slots?.length) {
    return track.slots
      .map((slot) => snippets.find((snippet) => snippet.slot === slot))
      .filter(Boolean)
  }

  if (track.textLanguages) {
    if (track.snippetIds.length > 0) {
      return track.snippetIds
        .map((snippetId) => snippets.find((snippet) => snippet.id === snippetId))
        .filter(Boolean)
    }

    return track.difficultyFilter
      ? snippets.filter((snippet) => snippet.difficulty === track.difficultyFilter)
      : snippets
  }

  return track.snippetIds
    .map((snippetId) => snippets.find((snippet) => snippet.id === snippetId))
    .filter(Boolean)
}

try {
  const tracksSource = await readFile('data/tracks.ts', 'utf8')
  const manifestSource = await readFile('data/manifest.ts', 'utf8')
  const [{ tracks }, { languageManifest, CORE_CONCEPT_LANGUAGE_IDS }] = await Promise.all([
    importTypescriptSource(tracksSource, 'tracks'),
    importTypescriptSource(manifestSource, 'manifest'),
  ])

  const moduleCache = new Map()
  const languageCatalogs = new Map()

  for (const entry of languageManifest) {
    const moduleName = entry.module.replace(/^\.\//, '')
    const sourcePath = `data/${moduleName}.ts`
    let modulePromise = moduleCache.get(sourcePath)

    if (!modulePromise) {
      const oldSource = historicalSource(sourcePath)
      const source = oldSource ?? await readFile(sourcePath, 'utf8')
      modulePromise = importTypescriptSource(source, moduleName.replace(/[^a-z0-9-]/gi, '-'))
      moduleCache.set(sourcePath, modulePromise)
    }

    const mod = await modulePromise
    const exportName = entry.exportName ?? `${entry.id}Snippets`
    const snippets = mod[exportName]

    if (!Array.isArray(snippets)) {
      throw new Error(`Snippet export ${exportName} not found for ${entry.id}`)
    }

    languageCatalogs.set(entry.id, snippets)
  }

  const freeRegistry = {}
  const totalRegistry = {}

  for (const track of tracks) {
    const candidates = languageManifest.filter((entry) => {
      if (track.textLanguages) {
        if (entry.type !== 'text') return false
        return track.snippetIds.length > 0 || entry.id !== 'text-typing'
      }
      return entry.type === 'code'
    })

    const freeByLanguage = {}
    const totalsByLanguage = {}

    for (const entry of candidates) {
      const snippets = languageCatalogs.get(entry.id) ?? []
      const trackSnippets = buildTrackSnippets(track, snippets)
      if (trackSnippets.length === 0) continue

      const accessPolicy = track.accessPolicy ?? DEFAULT_ACCESS_POLICY
      freeByLanguage[entry.id] = accessPolicy === 'free'
        ? trackSnippets
        : trackSnippets.slice(0, PUBLIC_LIMIT)
      totalsByLanguage[entry.id] = trackSnippets.length
    }

    freeRegistry[track.id] = freeByLanguage
    totalRegistry[track.id] = totalsByLanguage
  }

  for (const [trackId, languages] of Object.entries(freeRegistry)) {
    const track = tracks.find((entry) => entry.id === trackId)
    const accessPolicy = track?.accessPolicy ?? DEFAULT_ACCESS_POLICY
    for (const [languageId, snippets] of Object.entries(languages)) {
      if (accessPolicy !== 'free' && snippets.length > PUBLIC_LIMIT) {
        throw new Error(`${trackId}/${languageId} exposes ${snippets.length} free snippets`)
      }

      const ids = snippets.map((snippet) => snippet.id)
      if (new Set(ids).size !== ids.length) {
        throw new Error(`${trackId}/${languageId} has duplicate snippet ids`)
      }
    }
  }

  const conceptCoverage = tracks
    .filter((track) => track.section === 'concept')
    .map((track) => ({
      track: track.id,
      core: Object.fromEntries(
        CORE_CONCEPT_LANGUAGE_IDS.map((languageId) => [
          languageId,
          freeRegistry[track.id]?.[languageId]?.length ?? 0,
        ])
      ),
    }))

  const output = `// AUTO-GENERATED by scripts/generate-free-track-catalog.mjs. Do not edit manually.\n` +
    `import type { Snippet } from '@/lib/types'\n\n` +
    `export const FREE_TRACK_SNIPPET_LIMIT = ${PUBLIC_LIMIT}\n\n` +
    `export const freeTrackSnippetRegistry: Record<string, Record<string, Snippet[]>> = ${JSON.stringify(freeRegistry, null, 2)}\n\n` +
    `export const trackSnippetTotalRegistry: Record<string, Record<string, number>> = ${JSON.stringify(totalRegistry, null, 2)}\n`

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, output, 'utf8')

  console.log(`Generated free track catalog for ${Object.keys(freeRegistry).length} tracks.`)
  console.log(JSON.stringify({ event: 'free_track_catalog.core_coverage', conceptCoverage }))
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}
