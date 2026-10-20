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

// The Supabase Site URL may receive ?code=... instead of /auth/callback when
// redirectTo is not allowed. Recover on the same host so the PKCE cookie is sent
// to the server-side code exchange. Never forward unrelated query parameters.
export function getUnexpectedAuthCallbackUrl(rawUrl: string): URL | null {
  const incoming = new URL(rawUrl)
  if (incoming.pathname !== '/') return null

  const code = incoming.searchParams.get('code')
  const error = incoming.searchParams.get('error')
  if (!code && !error) return null

  const callback = new URL('/auth/callback', incoming.origin)
  for (const key of ['code', 'error', 'error_code', 'error_description', 'flow']) {
    const value = incoming.searchParams.get(key)
    if (value) callback.searchParams.set(key, value)
  }

  const next = incoming.searchParams.get('type') === 'recovery'
    ? '/reset-password'
    : normalizePostAuthNext(incoming.searchParams.get('next'))
  callback.searchParams.set('next', next)
  return callback
}
