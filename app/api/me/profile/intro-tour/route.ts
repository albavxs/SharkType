import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { ensureProfileForUser, updateIntroTourVersionSeen } from '@/lib/server/auth-profile'

function isValidVersionSeen(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 100
}

export async function PATCH(request: Request) {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const body = (await request.json()) as { versionSeen?: unknown }
  if (!isValidVersionSeen(body.versionSeen)) {
    return NextResponse.json({ error: 'Invalid intro tour payload.' }, { status: 400 })
  }

  try {
    const current = await ensureProfileForUser(supabase, user)
    const nextVersionSeen = Math.max(current.introTourVersionSeen ?? 0, body.versionSeen)
    const profile = await updateIntroTourVersionSeen(supabase, user.id, nextVersionSeen)
    return NextResponse.json({ profile })
  } catch (profileError) {
    return NextResponse.json(
      { error: profileError instanceof Error ? profileError.message : 'Could not update intro tour.' },
      { status: 500 }
    )
  }
}
