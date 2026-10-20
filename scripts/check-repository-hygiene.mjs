import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bannedPathPart = /(?:^|\/)sharktype-sanitize-\d{8}-\d{6}(?:\/|$)|(?:^|\/)SharkType-sanitize\.git(?:\/|$)/
const bannedFilename = /(?:^|\/)(?:gitleaks-(?:before|after)\.json|SharkType-before-selective-sanitize\.bundle|(?:dev|master)-safe\.tar)$/

let paths
try {
  paths = execFileSync('git', ['ls-files', '--cached', '-z'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  }).split('\0').filter(Boolean)
} catch {
  console.error('Unable to inspect tracked files with git ls-files.')
  process.exit(1)
}

const forbidden = paths.filter((path) =>
  bannedPathPart.test(path) || bannedFilename.test(path)
)
if (forbidden.length > 0) {
  console.error('Blocked tracked backup or security audit artifacts:')
  for (const file of forbidden) console.error('  ' + file)
  console.error('Remove these paths from the Git index before merging.')
  process.exit(1)
}

console.log('Repository hygiene OK: no tracked sanitization archives or audit reports.')
