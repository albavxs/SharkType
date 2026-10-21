import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = (path) => readFileSync(resolve(root, path), 'utf8')
const transpiled = ts.transpileModule(source('lib/stats-display.ts'), {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText

const { getLanguageCompletion, formatSessionDate } = await import(
  'data:text/javascript;base64,' + Buffer.from(transpiled).toString('base64')
)

const completed = getLanguageCompletion(
  ['a', 'b', 'c', 'd', 'e', 'f', 'legacy-one', 'legacy-two'],
  ['a', 'b', 'c', 'd', 'e', 'f'],
)
assert.deepEqual(completed, { completed: 6, total: 6, previous: 2, percent: 100 },
  'Previous exercises must remain counted but never overflow the current catalog.')

assert.deepEqual(getLanguageCompletion(['a', 'a', 'old'], ['a', 'b', 'b']), {
  completed: 1, total: 2, previous: 1, percent: 50,
}, 'Duplicated IDs must not inflate completion or the visible denominator.')

assert.deepEqual(getLanguageCompletion(['legacy'], []), {
  completed: 0, total: 0, previous: 1, percent: 0,
}, 'An empty catalog must never cause Infinity or NaN.')

assert.equal(formatSessionDate('2026-10-20', 'pt'), '20/10/26')
assert.equal(formatSessionDate('2026-10-20', 'en'), '10/20/26')
assert.equal(formatSessionDate('2026-02-31', 'pt'), '2026-02-31')

const stats = source('app/stats/page.tsx')
assert.match(stats, /getLanguageCompletion\(/, 'Language bars must use bounded, catalog-aware completion.')
assert.match(stats, /completion\.previous > 0/, 'Historical completions must remain visible.')
assert.match(stats, /overflow-hidden rounded-full/, 'Progress bar tracks must clip their fill.')
assert.match(stats, /max-w-full rounded-full/, 'Progress fills must never exceed the track width.')
assert.match(stats, /formatSessionDate\(session\.date, locale\)/, 'History dates must use short locale-specific formatting.')
assert.match(stats, /whitespace-nowrap text-xs tabular-nums/, 'History dates should not wrap.')
assert.match(stats, /xl:grid-cols-\[/, 'History and language stats need a spacious desktop layout.')
assert.match(stats, /grid-cols-\[minmax\(0,1fr\)_auto\]/, 'History and language stats need a mobile-safe layout.')
assert.match(stats, /max-h-\[36rem\]/, 'Recent history must remain vertically scrollable.')
assert.doesNotMatch(stats, /const pct = Math\.round\(\(completed \/ total\)/,
  'Raw completed/total ratios may exceed the catalog size.')

console.log('Statistics overflow, catalog migration, dates and responsive layout validated.')
