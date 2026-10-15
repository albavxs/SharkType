export function normalizeNext(value: string | null, fallback: string = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback

  try {
    const candidate = new URL(value, 'https://sharktype-callback.invalid')
    if (candidate.origin !== 'https://sharktype-callback.invalid') return fallback
    return `${candidate.pathname}${candidate.search}`
  } catch {
    return fallback
  }
}
