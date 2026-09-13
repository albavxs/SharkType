import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function text(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8')
}

async function walk(relativeDir) {
  const absoluteDir = path.join(root, relativeDir)
  const entries = await readdir(absoluteDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relative = path.join(relativeDir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue
      files.push(...await walk(relative))
    } else {
      files.push(relative)
    }
  }

  return files
}

const hardening = await text('supabase/migrations/202609130001_security_hardening.sql')
assert(
  hardening.includes('revoke insert, update, delete on public.user_progress from anon, authenticated;'),
  'user_progress client writes must remain revoked',
)
assert(
  hardening.includes('revoke insert, update, delete on public.user_language_progress from anon, authenticated;'),
  'user_language_progress client writes must remain revoked',
)
assert(
  hardening.includes('revoke insert, update, delete on public.typing_sessions from anon, authenticated;'),
  'typing_sessions client writes must remain revoked',
)
assert(
  hardening.includes('revoke all on public.profiles from anon, authenticated;'),
  'profiles must not regain broad client privileges',
)
assert(
  !hardening.includes('is_super_user\n) on public.profiles to authenticated'),
  'is_super_user must never be client writable',
)

const throttle = await text('supabase/migrations/202609130002_request_throttle.sql')
assert(throttle.includes('security definer'), 'shared throttle RPC must remain server-owned')
assert(
  throttle.includes('grant execute on function public.consume_request_throttle(text, integer, integer) to service_role;'),
  'shared throttle RPC must only be executable by service_role',
)

const sensitiveServerModules = [
  'lib/supabase/admin.ts',
  'lib/server/asaas.ts',
  'lib/server/access-control.ts',
  'lib/server/auth-profile.ts',
  'lib/server/premium-content.ts',
  'lib/server/profile-store.ts',
  'lib/server/rate-limit.ts',
  'lib/server/session-validation.ts',
]

for (const file of sensitiveServerModules) {
  const source = await text(file)
  assert(source.includes("import 'server-only'"), `${file} must stay server-only`)
}

const sharedLimitedRoutes = [
  'app/api/auth/resend-code/route.ts',
  'app/api/billing/plus/checkout/route.ts',
  'app/api/billing/plus/pix-automatic/route.ts',
  'app/api/me/avatar/route.ts',
  'app/api/progress/import/route.ts',
  'app/api/progress/session/route.ts',
]

for (const file of sharedLimitedRoutes) {
  const source = await text(file)
  assert(source.includes('sharedRateLimit'), `${file} must use the shared rate limiter`)
}

const importRoute = await text('app/api/progress/import/route.ts')
assert(
  importRoute.includes('ALLOW_LEGACY_PROGRESS_IMPORT'),
  'legacy progress import must remain explicitly gated',
)

const masteryRoute = await text('app/api/tracks/[track]/mastery/route.ts')
const accessCheckIndex = masteryRoute.indexOf('if (!access.isPlus)')
const payloadIndex = masteryRoute.indexOf('getTrackMasteryPayload(')
assert(accessCheckIndex >= 0, 'Mastery route must enforce Plus access')
assert(payloadIndex > accessCheckIndex, 'Mastery payload must only load after Plus authorization')

const sourceFiles = [
  ...await walk('app'),
  ...await walk('components'),
  ...await walk('lib'),
].filter((file) => /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(file))

for (const file of sourceFiles) {
  const source = await text(file)
  if (source.includes("'use client'") || source.includes('"use client"')) {
    assert(
      !source.includes('@albavxs/sharktype-premium'),
      `private premium package must not be imported by client code: ${file}`,
    )
    assert(
      !source.includes('SUPABASE_SERVICE_ROLE_KEY'),
      `service-role credential must not be referenced by client code: ${file}`,
    )
    assert(
      !source.includes('ASAAS_API_KEY') && !source.includes('ASAAS_WEBHOOK_TOKEN'),
      `Asaas secrets must not be referenced by client code: ${file}`,
    )
  }
}

console.log('[check-security-boundaries] OK')
