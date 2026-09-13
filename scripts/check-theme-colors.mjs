import fs from 'node:fs'
import path from 'node:path'

const sourcePath = path.join(process.cwd(), 'lib', 'themes.ts')
const source = fs.readFileSync(sourcePath, 'utf8')
const blockRegex = /name:\s*'([^']+)'[\s\S]*?bg:\s*'(#[0-9a-fA-F]{6})'[\s\S]*?main:\s*'(#[0-9a-fA-F]{6})'[\s\S]*?error:\s*'(#[0-9a-fA-F]{6})'[\s\S]*?syntax:\s*\{\s*keyword:\s*'(#[0-9a-fA-F]{6})',\s*string:\s*'(#[0-9a-fA-F]{6})',\s*number:\s*'(#[0-9a-fA-F]{6})',\s*comment:\s*'(#[0-9a-fA-F]{6})',\s*type:\s*'(#[0-9a-fA-F]{6})'/g

function hexToRgb(hex) {
  const normalized = hex.slice(1)
  return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16) / 255)
}

function linearize(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function toOklab(hex) {
  const [sr, sg, sb] = hexToRgb(hex)
  const r = linearize(sr)
  const g = linearize(sg)
  const b = linearize(sb)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  const l3 = Math.cbrt(l)
  const m3 = Math.cbrt(m)
  const s3 = Math.cbrt(s)
  return [
    0.2104542553 * l3 + 0.793617785 * m3 - 0.0040720468 * s3,
    1.9779984951 * l3 - 2.428592205 * m3 + 0.4505937099 * s3,
    0.0259040371 * l3 + 0.7827717662 * m3 - 0.808675766 * s3,
  ]
}

function deltaE(a, b) {
  const labA = toOklab(a)
  const labB = toOklab(b)
  return Math.hypot(labA[0] - labB[0], labA[1] - labB[1], labA[2] - labB[2])
}

const MIN_DISTANCE = 0.075
const failures = []
let matched = 0

for (const match of source.matchAll(blockRegex)) {
  matched += 1
  const [_, name, bg, main, error, keyword, string, number, comment, type] = match
  const comparisons = { main, keyword, string, number, type }

  if (error.toLowerCase() === bg.toLowerCase()) {
    failures.push(`${name}: error equals background (${error})`)
  }

  for (const [label, color] of Object.entries(comparisons)) {
    const distance = deltaE(error, color)
    if (distance < MIN_DISTANCE) {
      failures.push(`${name}: error ${error} is too close to ${label} ${color} (OKLab Δ=${distance.toFixed(3)})`)
    }
  }
}

if (matched === 0) {
  console.error('Theme audit could not parse any themes from lib/themes.ts')
  process.exit(1)
}

if (failures.length > 0) {
  console.error(`Theme semantic color audit failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Theme semantic color audit passed for ${matched} themes.`)
