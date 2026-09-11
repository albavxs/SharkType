import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseEnv } from 'node:util'

function loadLocalPremiumToken() {
  if (process.env.GITHUB_PACKAGES_TOKEN?.trim()) return

  for (const filename of ['.env.local', '.env']) {
    const envPath = path.join(process.cwd(), filename)
    if (!existsSync(envPath)) continue

    try {
      const parsed = parseEnv(readFileSync(envPath, 'utf8'))
      const localToken = parsed.GITHUB_PACKAGES_TOKEN?.trim()
      if (localToken) {
        process.env.GITHUB_PACKAGES_TOKEN = localToken
        console.info(`[premium-content] loaded GITHUB_PACKAGES_TOKEN from ${filename}`)
        return
      }
    } catch (error) {
      console.warn(
        `[premium-content] could not read ${filename}:`,
        error instanceof Error ? error.message : error,
      )
    }
  }
}

loadLocalPremiumToken()

const token = process.env.GITHUB_PACKAGES_TOKEN?.trim()
const packageName = '@albavxs/sharktype-premium@0.1.0'
const requirePremium = process.env.SHARKTYPE_REQUIRE_PREMIUM_PACKAGE === 'true'
  || Boolean(process.env.VERCEL)

if (!token) {
  const message = '[premium-content] GITHUB_PACKAGES_TOKEN not configured.'
  if (requirePremium) {
    console.error(`${message} Premium package is required for this hosted build.`)
    process.exit(1)
  }

  console.info(`${message} Skipping private premium package install for this local/non-hosted build.`)
  process.exit(0)
}

const tempDir = mkdtempSync(path.join(tmpdir(), 'sharktype-npm-'))
const userConfigPath = path.join(tempDir, '.npmrc')

writeFileSync(
  userConfigPath,
  [
    '@albavxs:registry=https://npm.pkg.github.com',
    `//npm.pkg.github.com/:_authToken=${token}`,
    'always-auth=true',
    'package-lock=false',
    '',
  ].join('\n'),
  { mode: 0o600 }
)

try {
  execFileSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    [
      'install',
      '--no-save',
      '--package-lock=false',
      '--ignore-scripts',
      '--include=dev',
      packageName,
    ],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        npm_config_userconfig: userConfigPath,
      },
    }
  )

  const verifyScript = [
    "import('@albavxs/sharktype-premium').then(async (m) => {",
    "  if (typeof m.getPremiumSnippets !== 'function') throw new Error('getPremiumSnippets export is missing')",
    "  const expectations = { react: 6, git: 14 }",
    "  for (const [languageId, expected] of Object.entries(expectations)) {",
    "    const snippets = await m.getPremiumSnippets(languageId)",
    "    if (!Array.isArray(snippets)) throw new Error(`${languageId} premium payload is not an array`)",
    "    if (snippets.length !== expected) throw new Error(`${languageId} premium payload has ${snippets.length} snippets; expected ${expected}`)",
    "  }",
    "  console.info('[premium-content] payload verified: react=6, git=14')",
    "}).catch((error) => { console.error('[premium-content] payload verification failed:', error); process.exit(2) })",
  ].join('\n')

  execFileSync(
    process.platform === 'win32' ? 'node.exe' : 'node',
    ['-e', verifyScript],
    { stdio: 'inherit', env: process.env },
  )

  console.info(`[premium-content] installed and verified ${packageName}`)
} catch (error) {
  console.error(`[premium-content] failed to install or verify ${packageName}`)
  throw error
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
