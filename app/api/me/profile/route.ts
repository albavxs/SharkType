import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { ensureProfileForUser, updateProfileIdentity } from '@/lib/server/auth-profile'
import { isValidUsername, sanitizeUsername } from '@/lib/usernames'

export async function GET() {
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

  try {
    const profile = await ensureProfileForUser(supabase, user)
    return NextResponse.json({ profile })
  } catch (profileError) {
    return NextResponse.json(
      { error: profileError instanceof Error ? profileError.message : 'Could not load profile.' },
      { status: 500 }
    )
  }
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

  const body = (await request.json()) as { username?: string; displayName?: string | null }
  const username = sanitizeUsername(body.username ?? '')

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: 'Username must be 3-20 chars using lowercase letters, numbers, or underscores.' },
      { status: 400 }
    )
  }

  try {
    const profile = await updateProfileIdentity(supabase, user.id, {
      username,
      displayName: body.displayName ?? null,
      onboardingCompleted: true,
    })

    return NextResponse.json({ profile })
  } catch (profileError) {
    const message = profileError instanceof Error ? profileError.message : 'Could not update profile.'
    const normalized = message.toLowerCase()
    const status = normalized.includes('duplicate') || normalized.includes('unique') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
