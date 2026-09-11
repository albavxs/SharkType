import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const token = process.env.GITHUB_PACKAGES_TOKEN?.trim()
const packageName = '@albavxs/sharktype-premium@0.1.0'

if (!token) {
  console.info('[premium-content] GITHUB_PACKAGES_TOKEN not configured; skipping private premium package install.')
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
      // Vercel runs builds with NODE_ENV=production. Preserve build-time tooling
      // such as @tailwindcss/postcss instead of letting this second npm install
      // prune devDependencies before `next build` starts.
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
  console.info(`[premium-content] installed ${packageName}`)
} catch (error) {
  console.error(`[premium-content] failed to install ${packageName}`)
  throw error
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
