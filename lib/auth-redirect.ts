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

// Successful sign-in should never fall back to the public landing page.
// Preserve explicit internal destinations such as /reset-password or /tracks.
export function normalizePostAuthNext(value: string | null): string {
  const destination = normalizeNext(value, '/home')
  return destination === '/' || destination.startsWith('/?') ? '/home' : destination
}
