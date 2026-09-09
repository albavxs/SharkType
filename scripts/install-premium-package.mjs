import { execFileSync } from 'node:child_process'

const token = process.env.GITHUB_PACKAGES_TOKEN?.trim()
const packageName = '@albavxs/sharktype-premium@0.1.0'

if (!token) {
  console.info('[premium-content] GITHUB_PACKAGES_TOKEN not configured; skipping private premium package install.')
  process.exit(0)
}

try {
  execFileSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['install', '--no-save', '--ignore-scripts', packageName],
    {
      stdio: 'inherit',
      env: process.env,
    }
  )
  console.info(`[premium-content] installed ${packageName}`)
} catch (error) {
  console.error(`[premium-content] failed to install ${packageName}`)
  throw error
}
