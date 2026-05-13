const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/

export function sanitizeUsername(input: string): string {
  const normalized = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')

  const base = normalized.slice(0, 20)
  if (base.length >= 3) return base

  return `shark${base}`.slice(0, 20)
}

export function isValidUsername(input: string): boolean {
  return USERNAME_REGEX.test(input)
}

export function buildUsernameCandidate(base: string, suffix: number): string {
  if (suffix === 0) return base

  const suffixText = `${suffix}`
  const maxBaseLength = Math.max(3, 20 - suffixText.length - 1)
  return `${base.slice(0, maxBaseLength)}_${suffixText}`
}
