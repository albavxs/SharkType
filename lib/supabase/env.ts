export const SUPABASE_URL_ENV = 'NEXT_PUBLIC_SUPABASE_URL'
export const SUPABASE_PUBLISHABLE_KEY_ENV = 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
export const SUPABASE_ANON_KEY_ENV = 'NEXT_PUBLIC_SUPABASE_ANON_KEY'

export type SupabaseKeySource = 'publishable' | 'anon' | null
export type SupabaseEnvVarName =
  | typeof SUPABASE_URL_ENV
  | typeof SUPABASE_PUBLISHABLE_KEY_ENV
  | typeof SUPABASE_ANON_KEY_ENV

export interface SupabaseEnv {
  url: string
  publishableKey: string
  configured: boolean
  keySource: SupabaseKeySource
  missingVars: SupabaseEnvVarName[]
}

export interface SupabaseEnvErrorPayload {
  error: string
  missingVars: SupabaseEnvVarName[]
  keySource: SupabaseKeySource
}

function resolveSupabasePublicKey() {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (publishableKey) {
    return {
      publishableKey,
      keySource: 'publishable' as const,
    }
  }

  if (anonKey) {
    return {
      publishableKey: anonKey,
      keySource: 'anon' as const,
    }
  }

  return {
    publishableKey: '',
    keySource: null,
  }
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const { publishableKey, keySource } = resolveSupabasePublicKey()
  const missingVars: SupabaseEnvVarName[] = []

  if (!url) {
    missingVars.push(SUPABASE_URL_ENV)
  }

  if (!publishableKey) {
    missingVars.push(SUPABASE_PUBLISHABLE_KEY_ENV, SUPABASE_ANON_KEY_ENV)
  }

  return {
    url,
    publishableKey,
    configured: missingVars.length === 0,
    keySource,
    missingVars,
  }
}

export function getSupabaseEnvErrorMessage(env: SupabaseEnv = getSupabaseEnv()): string {
  if (env.configured) {
    return 'Supabase is configured.'
  }

  const missingList = env.missingVars.join(', ')
  return `Supabase public env vars are missing from this build: ${missingList}. Set ${SUPABASE_URL_ENV} and either ${SUPABASE_PUBLISHABLE_KEY_ENV} or ${SUPABASE_ANON_KEY_ENV}, then redeploy so the new NEXT_PUBLIC_* values are bundled.`
}

export function getSupabaseEnvErrorPayload(
  env: SupabaseEnv = getSupabaseEnv()
): SupabaseEnvErrorPayload {
  return {
    error: getSupabaseEnvErrorMessage(env),
    missingVars: env.missingVars,
    keySource: env.keySource,
  }
}

export function assertSupabaseConfigured(env: SupabaseEnv = getSupabaseEnv()): SupabaseEnv {
  if (!env.configured) {
    throw new Error(getSupabaseEnvErrorMessage(env))
  }

  return env
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
