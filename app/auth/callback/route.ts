import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { ensureProfileForUser } from '@/lib/server/auth-profile'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const oauthError = searchParams.get('error')
  let next = searchParams.get('next') ?? '/'

  if (!next.startsWith('/')) next = '/'

  if (oauthError) {
    return NextResponse.redirect(`${origin}/login?oauth_error=1`)
  }

  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?oauth_error=1`)
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const profile = await ensureProfileForUser(supabase, user)
      if (!profile.onboardingCompleted) {
        next = '/profile'
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
