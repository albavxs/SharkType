import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const source = (file) => readFileSync(path.join(root, file), 'utf8')
const typing = source('components/typing/TypingArea.tsx')
const toolbar = source('components/typing/Toolbar.tsx')
const dropdown = source('components/typing/LanguageDropdown.tsx')
const env = source('lib/supabase/env.ts')

assert.match(typing, /overflow-y-auto overflow-x-hidden max-h-/, 'Natural text must remain vertically scrollable')
assert.doesNotMatch(typing, /overflow-hidden max-h-\[65px\]/, 'Natural text must not use fixed-height hidden overflow')
assert.match(typing, /isTextMode \? charBottom \+ lineH/, 'Caret scroll must keep a following line visible')
assert.match(typing, /isTextMode && isOverflowing && isIdle/, 'Overflow should be indicated to readers')
assert.match(toolbar, /xl:grid-cols-/, 'Wide toolbar must reserve a central grid track')
assert.match(toolbar, /row-start-2/, 'Smaller toolbar must move practice controls to a dedicated row')
assert.doesNotMatch(toolbar, /absolute left-1\/2 -translate-x-1\/2/, 'Toolbar controls cannot overlap navigation by absolute positioning')
assert.match(toolbar, /col-start-1 row-start-1/, 'Left header group must be in the top row')
assert.match(toolbar, /col-start-2 row-start-1/, 'Right header group must align vertically with the left group')
assert.match(toolbar, /items-center gap-x-3 gap-y-2/, 'Header groups must use vertical center alignment')
assert.match(toolbar, /xl:col-start-3/, 'Right actions must occupy the trailing wide-screen column')
assert.doesNotMatch(toolbar, /sm:flex-wrap|sm:gap-y-2/, 'Top bar must not scatter navigation across rows')
assert.match(toolbar, /overflow-x-auto whitespace-nowrap/, 'Practice controls must remain accessible on narrow devices')
assert.match(dropdown, /aria-expanded=\{open\}/, 'Language selector must communicate its expanded state')
assert.match(dropdown, /event.key === 'Escape'/, 'Language menu must support Escape')
assert.match(env, /VERCEL_ENV === 'preview'/, 'Preview callbacks must use the preview deployment origin')

console.log('Responsive typing, toolbar and preview-origin guards passed')
