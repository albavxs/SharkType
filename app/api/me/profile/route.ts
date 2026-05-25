import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { ensureProfileForUser, updateProfileIdentity } from '@/lib/server/auth-profile'
import { ensureUserSocialBackfill } from '@/lib/server/progress-store'
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
    await ensureUserSocialBackfill(supabase, user.id)
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

  const body = (await request.json()) as {
    username?: string
    displayName?: string | null
    avatarUrl?: string | null
    bio?: string | null
  }
  if (body.avatarUrl != null && body.avatarUrl !== "") {
    try {
      const u = new URL(body.avatarUrl)
      if (!["http:", "https:"].includes(u.protocol)) {
        return NextResponse.json({ error: "Invalid avatar URL." }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: "Invalid avatar URL." }, { status: 400 })
    }
  }
  const username = sanitizeUsername(body.username ?? '')

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: 'Username must be 3-20 chars using lowercase letters, numbers, or underscores.' },
      { status: 400 }
    )
  }

  try {
    const bio = typeof body.bio === 'string' ? body.bio.trim() : null
    const profile = await updateProfileIdentity(supabase, user.id, {
      username,
      displayName: body.displayName ?? null,
      avatarUrl: body.avatarUrl,
      bio,
      onboardingCompleted: true,
    })

    return NextResponse.json({ profile })
  } catch (profileError) {
    const message = profileError instanceof Error ? profileError.message : 'Could not update profile.'
    const normalized = message.toLowerCase()
    const isDuplicate = normalized.includes('duplicate') || normalized.includes('unique')
    const status = isDuplicate ? 409 : 500
    const errorResponse = isDuplicate ? 'This username is already taken.' : message
    return NextResponse.json({ error: errorResponse }, { status })
  }
}
