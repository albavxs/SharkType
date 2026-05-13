export interface SupabaseEnv {
  url: string
  publishableKey: string
  configured: boolean
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''

  return {
    url,
    publishableKey,
    configured: Boolean(url && publishableKey),
  }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv().configured
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin

  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`

  return 'http://localhost:3000'
}

export function getAuthCallbackUrl(next: string = '/'): string {
  const url = new URL('/auth/callback', getBaseUrl())
  url.searchParams.set('next', next.startsWith('/') ? next : '/')
  return url.toString()
}
