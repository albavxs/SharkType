import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { ensureProfileForUser } from '@/lib/server/auth-profile'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'

  if (!next.startsWith('/')) next = '/'

  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
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
