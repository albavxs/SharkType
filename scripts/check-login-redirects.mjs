import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => readFileSync(resolve(root, file), 'utf8')

const source = read('lib/auth-redirect.ts')
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText
const { normalizePostAuthNext } = await import(
  'data:text/javascript;base64,' + Buffer.from(transpiled).toString('base64')
)

for (const [input, expected] of [
  [null, '/home'],
  ['', '/home'],
  ['/', '/home'],
  ['/?ref=login', '/home'],
  ['https://example.com', '/home'],
  ['//example.com', '/home'],
  ['/\\example.com', '/home'],
  ['/home', '/home'],
  ['/tracks?lang=js', '/tracks?lang=js'],
  ['/profile', '/profile'],
  ['/reset-password', '/reset-password'],
]) {
  assert.equal(normalizePostAuthNext(input), expected, String(input))
}

const callback = read('app/auth/callback/route.ts')
const login = read('app/login/page.tsx')
const env = read('lib/supabase/env.ts')

assert.match(callback, /normalizePostAuthNext\(searchParams\.get\('next'\)\)/)
assert.match(callback, /NextResponse\.redirect\(new URL\('\/home', origin\)\)/)
assert.match(callback, /await ensureProfileForUser\(supabase, user\)/)
assert.doesNotMatch(callback, /next\s*=\s*'\/profile'/)
assert.match(login, /const result = await signInWithPassword\(email, password\)[\s\S]*?router\.replace\('\/home'\)/)
assert.match(env, /getAuthCallbackUrl\(next: string = '\/home'/)
assert.match(env, /next\.startsWith\('\/'\) && !next\.startsWith\('\/\/'\) \? next : '\/home'/)

console.log('Post-login redirects verified for email, OAuth, root fallback and safe deep links.')
