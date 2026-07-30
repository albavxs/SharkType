import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAuthCookieName, getSupabaseEnv } from '@/lib/supabase/env'
import { ensureProfileForUser } from '@/lib/server/auth-profile'
import { getSafeErrorDetails, logStructuredError, logStructuredInfo } from '@/lib/server/safe-logging'

type AuthCallbackStage = 'provider' | 'env' | 'client_init' | 'exchange_code' | 'get_user' | 'ensure_profile' | 'missing_code'

function normalizeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/'

  try {
    const candidate = new URL(value, 'https://sharktype-callback.invalid')
    if (candidate.origin !== 'https://sharktype-callback.invalid') return '/'
    return `${candidate.pathname}${candidate.search}`
  } catch {
    return '/'
  }
}

function createErrorId(): string {
  return crypto.randomUUID()
}

function redirectToLogin(origin: string, errorId: string) {
  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('oauth_error', '1')
  loginUrl.searchParams.set('error_id', errorId)
  return NextResponse.redirect(loginUrl)
}

function setRedirectLocation(response: NextResponse, origin: string, pathname: string) {
  response.headers.set('location', new URL(pathname, origin).toString())
  return response
}

function logAuthFailure(
  stage: AuthCallbackStage,
  errorId: string,
  next: string,
  details: Record<string, unknown> = {},
) {
  logStructuredError('auth.oauth_callback_error', {
    error_id: errorId,
    stage,
    environment: process.env.NODE_ENV ?? 'unknown',
    next: next.split('?')[0].slice(0, 200),
    ...details,
  })
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const oauthCode = searchParams.get('code')
  const oauthError = searchParams.get('error')
  let next = normalizeNext(searchParams.get('next'))

  if (oauthError) {
    const errorId = createErrorId()
    logAuthFailure('provider', errorId, next, {
      error_code: searchParams.get('error_code') ?? oauthError,
      ...getSafeErrorDetails({
        message: searchParams.get('error_description') ?? 'OAuth provider returned an error.',
      }),
    })
    return redirectToLogin(origin, errorId)
  }

  const env = getSupabaseEnv()

  if (!env.configured) {
    const errorId = createErrorId()
    logAuthFailure('env', errorId, next, {
      missing_vars: env.missingVars,
      key_source: env.keySource,
    })
    return redirectToLogin(origin, errorId)
  }

  if (!oauthCode) {
    const errorId = createErrorId()
    logAuthFailure('missing_code', errorId, next, {
      error_message: 'OAuth callback did not include an authorization code.',
    })
    return redirectToLogin(origin, errorId)
  }

  const callbackResponse = NextResponse.redirect(new URL('/', origin))
  let supabase: Awaited<ReturnType<typeof createClient>>

  try {
    supabase = await createClient(callbackResponse)
  } catch (error) {
    const errorId = createErrorId()
    logAuthFailure('client_init', errorId, next, getSafeErrorDetails(error))
    return redirectToLogin(origin, errorId)
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(oauthCode)
    if (error) {
      const errorId = createErrorId()
      logAuthFailure('exchange_code', errorId, next, getSafeErrorDetails(error))
      return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
    }
  } catch (error) {
    const errorId = createErrorId()
    logAuthFailure('exchange_code', errorId, next, getSafeErrorDetails(error))
    return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
  }

  const sessionCookieName = getSupabaseAuthCookieName(env.url)
  const sessionCookieWritten = callbackResponse.cookies
    .getAll()
    .some(({ name }) => name === sessionCookieName || name.startsWith(`${sessionCookieName}.`))

  if (!sessionCookieWritten) {
    const errorId = createErrorId()
    logAuthFailure('exchange_code', errorId, next, {
      error_code: 'session_cookie_not_written',
      error_message: 'OAuth code exchange succeeded but the session cookie was not attached to the callback response.',
      session_cookie_written: false,
    })
    return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      const errorId = createErrorId()
      logAuthFailure('get_user', errorId, next, getSafeErrorDetails(error))
      return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
    }

    if (!user) {
      const errorId = createErrorId()
      logAuthFailure('get_user', errorId, next, {
        error_message: 'OAuth session was exchanged but no user was returned.',
      })
      return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
    }

    try {
      const profile = await ensureProfileForUser(supabase, user)
      if (!profile.onboardingCompleted) next = '/profile'
    } catch (error) {
      const errorId = createErrorId()
      logAuthFailure('ensure_profile', errorId, next, getSafeErrorDetails(error))
      return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
    }
  } catch (error) {
    const errorId = createErrorId()
    logAuthFailure('get_user', errorId, next, getSafeErrorDetails(error))
    return setRedirectLocation(callbackResponse, origin, `/login?oauth_error=1&error_id=${errorId}`)
  }

  logStructuredInfo('auth.oauth_callback_succeeded', {
    environment: process.env.NODE_ENV ?? 'unknown',
    next: next.split('?')[0].slice(0, 200),
    session_exchanged: true,
    session_cookie_written: true,
    profile_ready: true,
  })

  return setRedirectLocation(callbackResponse, origin, next)
}
