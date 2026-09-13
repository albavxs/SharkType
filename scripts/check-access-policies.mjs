import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import * as ts from 'typescript'

const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'sharktype-access-policy-'))
let moduleCounter = 0

async function importTypescript(relativePath) {
  const source = await readFile(relativePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: relativePath,
  }).outputText
  const filePath = path.join(tempRoot, `${String(moduleCounter++).padStart(3, '0')}.mjs`)
  await writeFile(filePath, transpiled, 'utf8')
  return import(`${pathToFileURL(filePath).href}?v=${moduleCounter}`)
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

try {
  const [{ tracks }, { freeTrackSnippetRegistry, trackSnippetTotalRegistry, FREE_TRACK_SNIPPET_LIMIT }] = await Promise.all([
    importTypescript('data/tracks.ts'),
    importTypescript('data/generated/free-track-snippets.ts'),
  ])

  const trackById = new Map(tracks.map((track) => [track.id, track]))
  const freeTrackIds = [
    'comece-aqui',
    'posicao-inicial',
    'dedos-e-alcance',
    'linhas-do-teclado',
    'primeiras-palavras',
    'idioma-iniciante',
    'idioma-medio',
    'idioma-dificil',
  ]

  for (const trackId of freeTrackIds) {
    const track = trackById.get(trackId)
    assert(track?.accessPolicy === 'free', `${trackId} must be accessPolicy free`)

    const languages = freeTrackSnippetRegistry[trackId] ?? {}
    for (const [languageId, snippets] of Object.entries(languages)) {
      const total = trackSnippetTotalRegistry[trackId]?.[languageId] ?? 0
      assert(snippets.length === total, `${trackId}/${languageId} should expose all ${total} free snippets`)
    }
  }

  const premiumTracks = [
    ['react', 'react'],
    ['nextjs', 'nextjs'],
    ['git', 'git'],
    ['angular-junior', 'angular'],
  ]

  for (const [trackId, languageId] of premiumTracks) {
    const snippets = freeTrackSnippetRegistry[trackId]?.[languageId] ?? []
    const total = trackSnippetTotalRegistry[trackId]?.[languageId] ?? 0

    console.log(
      `[check-access-policies] ${trackId}/${languageId} total=${total} freeExposed=${snippets.length} limit=${FREE_TRACK_SNIPPET_LIMIT}`,
    )

    assert(
      Number.isFinite(total) && total > FREE_TRACK_SNIPPET_LIMIT,
      `${trackId}/${languageId} expected total > ${FREE_TRACK_SNIPPET_LIMIT}, got ${total}`,
    )
    assert(
      snippets.length === FREE_TRACK_SNIPPET_LIMIT,
      `${trackId}/${languageId} should expose ${FREE_TRACK_SNIPPET_LIMIT} free snippets, got ${snippets.length}`,
    )
    assert(
      total > snippets.length,
      `${trackId}/${languageId} should have locked Plus snippets (total ${total} <= free ${snippets.length})`,
    )
  }

  console.log('[check-access-policies] OK')
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}
