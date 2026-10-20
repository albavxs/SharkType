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
const { normalizePostAuthNext, getUnexpectedAuthCallbackUrl } = await import(
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

// Supabase can fall back to the project Site URL, returning a PKCE code to '/'.
const rootCode = getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/?code=sample-once&tracking=ignore')
assert.ok(rootCode)
assert.equal(rootCode.origin, 'https://shark-type-io.vercel.app')
assert.equal(rootCode.pathname, '/auth/callback')
assert.equal(rootCode.searchParams.get('code'), 'sample-once')
assert.equal(rootCode.searchParams.get('next'), '/home')
assert.equal(rootCode.searchParams.has('tracking'), false)

const aliasCode = getUnexpectedAuthCallbackUrl('https://sharktype-paulo-guilhermes-projects-25ec340b.vercel.app/?code=sample-alias')
assert.equal(aliasCode?.origin, 'https://sharktype-paulo-guilhermes-projects-25ec340b.vercel.app')
assert.equal(aliasCode?.pathname, '/auth/callback')
assert.equal(aliasCode?.searchParams.get('next'), '/home')

const deepLink = getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/?code=sample-deep&next=%2Ftracks%3Flang%3Djs')
assert.equal(deepLink?.searchParams.get('next'), '/tracks?lang=js')

const badNext = getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/?code=sample-bad&next=https%3A%2F%2Fevil.example')
assert.equal(badNext?.searchParams.get('next'), '/home')

const rootError = getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/?error=access_denied')
assert.equal(rootError?.pathname, '/auth/callback')
assert.equal(rootError?.searchParams.get('error'), 'access_denied')
assert.equal(rootError?.searchParams.get('next'), '/home')

const resetLink = getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/?code=sample-reset&type=recovery')
assert.equal(resetLink?.searchParams.get('next'), '/reset-password')

const signupLink = getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/?code=sample-signup&flow=signup')
assert.equal(signupLink?.searchParams.get('flow'), 'signup')
assert.equal(signupLink?.searchParams.get('next'), '/home')

assert.equal(getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/'), null)
assert.equal(getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/home?code=example'), null)
assert.equal(getUnexpectedAuthCallbackUrl('https://shark-type-io.vercel.app/auth/callback?code=example'), null)

const proxy = read('proxy.ts')
assert.match(proxy, /getUnexpectedAuthCallbackUrl\(request\.url\)/)
assert.match(proxy, /NextResponse\.redirect\(callbackUrl, 307\)/)
assert.match(proxy, /Cache-Control', 'no-store'/)
assert.match(proxy, /return updateSession\(request\)/)

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

console.log('Post-login redirects verified for email, OAuth, unexpected root PKCE callbacks and safe deep links.')
