import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { normalizeNext } from '@/lib/auth-redirect'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { getSafeErrorDetails, logStructuredError, logStructuredInfo } from '@/lib/server/safe-logging'

// Email links (recovery, signup confirmation, email change) land here with a
// token_hash, so they work in any browser. The PKCE `code` flow in
// /auth/callback only works in the browser that started the request.
const EMAIL_OTP_TYPES: readonly EmailOtpType[] = ['recovery', 'signup', 'invite', 'magiclink', 'email', 'email_change']

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (EMAIL_OTP_TYPES as readonly string[]).includes(value)
}

function failureRedirect(origin: string, type: EmailOtpType | null) {
  // /reset-password without a session shows the "invalid recovery link" state
  // with a button to request a new email.
  if (type === 'recovery') return NextResponse.redirect(new URL('/reset-password', origin))

  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('oauth_error', '1')
  loginUrl.searchParams.set('error_id', crypto.randomUUID())
  return NextResponse.redirect(loginUrl)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const rawType = searchParams.get('type')
  const type = isEmailOtpType(rawType) ? rawType : null
  const next = type === 'recovery' ? '/reset-password' : normalizeNext(searchParams.get('next'), '/home')

  if (!tokenHash || !type) {
    logStructuredError('auth.email_confirm_error', { stage: 'missing_params', type: rawType?.slice(0, 32) ?? null })
    return failureRedirect(origin, type)
  }

  if (!getSupabaseEnv().configured) {
    logStructuredError('auth.email_confirm_error', { stage: 'env', type })
    return failureRedirect(origin, type)
  }

  const response = NextResponse.redirect(new URL(next, origin))

  try {
    const supabase = await createClient(response)
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

    if (error) {
      logStructuredError('auth.email_confirm_error', { stage: 'verify', type, ...getSafeErrorDetails(error) })
      return failureRedirect(origin, type)
    }
  } catch (error) {
    logStructuredError('auth.email_confirm_error', { stage: 'verify', type, ...getSafeErrorDetails(error) })
    return failureRedirect(origin, type)
  }

  logStructuredInfo('auth.email_confirm_succeeded', { type, next: next.split('?')[0].slice(0, 200) })
  return response
}
