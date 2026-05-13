import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDefaultProgress } from '@/lib/gamification'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { bootstrapProfileAndProgress, resetRemoteProgress } from '@/lib/server/progress-store'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      profile: null,
      progress: createDefaultProgress(),
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
  if (!isSupabaseConfigured()) {
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
