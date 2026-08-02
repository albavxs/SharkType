import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const braceExpansionPath = require.resolve('brace-expansion')
const braceExpansionModule = require(braceExpansionPath)

// Minimatch 3 expects brace-expansion to export a function directly.
if (typeof braceExpansionModule !== 'function' && typeof braceExpansionModule.expand === 'function') {
  require.cache[braceExpansionPath].exports = braceExpansionModule.expand
}

const eslintPackagePath = require.resolve('eslint/package.json')
const eslintBinPath = path.join(path.dirname(eslintPackagePath), 'bin', 'eslint.js')

require(eslintBinPath)
