import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Mastery separation check failed: ${message}`)
    process.exit(1)
  }
}

const tracksPage = read('app/tracks/page.tsx')
const categorySection = read('components/tracks/CategorySection.tsx')
const globals = read('app/globals.css')
const catalogRoute = read('app/api/tracks/catalog/route.ts')

assert(!tracksPage.includes('trackAccessFreePlus'), 'base track cards must not render FREE + PLUS')
assert(!tracksPage.includes('trackAccessSummary'), '/tracks must consume trackMasterySummary, not legacy trackAccessSummary')
assert(tracksPage.includes('trackMasterySummary'), '/tracks must consume Mastery metadata')
assert(!categorySection.includes('w-[200%]'), 'Base and Mastery must not share a 200% sliding viewport')
assert(categorySection.includes('isMasteryOpen &&'), 'closed Mastery panel must not occupy layout height')
assert(categorySection.includes('onOpenMastery'), 'Mastery cards must navigate through the Mastery route')
assert(globals.includes('button:not(:disabled)'), 'enabled buttons must receive the global pointer cursor rule')
assert(globals.includes('button:disabled'), 'disabled buttons must receive the global not-allowed cursor rule')
assert(!catalogRoute.includes('trackAccessSummary:'), 'public track catalog must not expose the legacy mixed Base/Plus summary')
assert(catalogRoute.includes('trackMasterySummary:'), 'public track catalog must expose safe Mastery metadata')

console.log('Mastery separation checks passed.')
