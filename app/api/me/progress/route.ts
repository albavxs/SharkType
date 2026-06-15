import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDefaultProgress } from '@/lib/gamification'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { bootstrapProfileAndProgress, resetRemoteProgress } from '@/lib/server/progress-store'

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
    return NextResponse.json(
      { error: progressError instanceof Error ? progressError.message : 'Could not load progress.' },
      { status: 500 }
    )
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
    return NextResponse.json(
      { error: resetError instanceof Error ? resetError.message : 'Could not reset progress.' },
      { status: 500 }
    )
  }
}
