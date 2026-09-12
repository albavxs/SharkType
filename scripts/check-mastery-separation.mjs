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
const plusPage = read('app/plus/page.tsx')

assert(!tracksPage.includes('trackAccessFreePlus'), 'base track cards must not render FREE + PLUS')
assert(!tracksPage.includes('trackAccessSummary'), '/tracks must consume separated Base/Mastery summaries')
assert(tracksPage.includes('trackBaseSummary'), '/tracks must consume Base metadata')
assert(tracksPage.includes('trackMasterySummary'), '/tracks must consume Mastery metadata')
assert(!tracksPage.includes('track.snippetIds.length'), 'base progress must not use full track snippet count')
assert(!tracksPage.includes('track.slots.length'), 'base progress must not use raw slot count')
assert(categorySection.includes('-translate-x-full'), 'Base pane must slide laterally out of view')
assert(categorySection.includes('translate-x-full'), 'Mastery pane must slide laterally into view')
assert(categorySection.includes('absolute inset-x-0 top-0'), 'inactive lateral pane must be removed from document height')
assert(categorySection.includes('Trilhas base'), 'Mastery navigation must restore the Base return control')
assert(categorySection.includes('onOpenMastery'), 'Mastery cards must navigate through the Mastery route')
assert(globals.includes('button:not(:disabled)'), 'enabled buttons must receive the global pointer cursor rule')
assert(globals.includes('button:disabled'), 'disabled buttons must receive the global not-allowed cursor rule')
assert(catalogRoute.includes('trackBaseSummary:'), 'public track catalog must expose Base metadata')
assert(catalogRoute.includes('trackMasterySummary:'), 'public track catalog must expose safe Mastery metadata')
assert(!catalogRoute.includes('trackAccessSummary:'), 'public track catalog must not expose the legacy mixed Base/Plus summary')
assert(plusPage.includes("router.replace('/settings/billing')"), 'Plus users must redirect from /plus to billing settings')

console.log('Mastery separation checks passed.')
