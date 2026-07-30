import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDefaultProgress } from '@/lib/gamification'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { ensureProfileForUser } from '@/lib/server/auth-profile'
import { bootstrapProfileAndProgress, resetRemoteProgress } from '@/lib/server/progress-store'
import { getSafeErrorDetails, logStructuredError } from '@/lib/server/safe-logging'

export async function GET() {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json({
      profile: null,
      progress: createDefaultProgress(),
      streakNotification: null,
    })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const payload = await bootstrapProfileAndProgress(supabase, user)
    return NextResponse.json(payload)
  } catch (progressError) {
    logStructuredError('progress.load_degraded', getSafeErrorDetails(progressError))

    try {
      const profile = await ensureProfileForUser(supabase, user)
      return NextResponse.json({
        profile,
        progress: createDefaultProgress(),
        streakNotification: null,
        degraded: true,
      })
    } catch (profileError) {
      logStructuredError('progress.profile_fallback_failed', getSafeErrorDetails(profileError))
      return NextResponse.json({ error: 'Could not load authenticated progress.' }, { status: 500 })
    }
  }
}

export async function DELETE() {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json({ ok: true })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    await resetRemoteProgress(supabase, user.id)
    return NextResponse.json({ ok: true })
  } catch (resetError) {
    console.error('[progress] reset failed:', resetError)
    return NextResponse.json(
      { error: resetError instanceof Error ? resetError.message : 'Could not reset progress.' },
      { status: 500 }
    )
  }
}
