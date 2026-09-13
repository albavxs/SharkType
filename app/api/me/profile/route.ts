import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { ensureProfileForUser, updateProfileIdentity } from '@/lib/server/auth-profile'
import { ensureUserSocialBackfill } from '@/lib/server/progress-store'
import { isReservedUsername, isValidUsername, sanitizeUsername } from '@/lib/usernames'

const MAX_BIO_LENGTH = 256

async function runSocialBackfill(userId: string) {
  try {
    const admin = createAdminClient()
    await ensureUserSocialBackfill(admin, userId)
  } catch (backfillError) {
    console.error('[profile] social backfill failed (non-fatal):', backfillError)
  }
}

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
    void runSocialBackfill(user.id)
    return NextResponse.json({ profile })
  } catch (profileError) {
    console.error('[profile] load failed:', profileError)
    return NextResponse.json({ error: 'Could not load profile.' }, { status: 500 })
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
  if (body.avatarUrl != null && body.avatarUrl !== '') {
    try {
      const u = new URL(body.avatarUrl)
      if (!['http:', 'https:'].includes(u.protocol)) {
        return NextResponse.json({ error: 'Invalid avatar URL.' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid avatar URL.' }, { status: 400 })
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
    const currentProfile = await ensureProfileForUser(supabase, user)

    // sharkcoder remains the real super-user account, but reserved names cannot
    // be claimed by another account or swapped onto a different profile.
    if (
      isReservedUsername(username) &&
      (!currentProfile.isSuperUser || currentProfile.username !== username)
    ) {
      return NextResponse.json({ error: 'This username is reserved.' }, { status: 409 })
    }

    const bio = typeof body.bio === 'string'
      ? body.bio.trim().slice(0, MAX_BIO_LENGTH)
      : null
    const profile = await updateProfileIdentity(supabase, user.id, {
      username,
      displayName: body.displayName ?? null,
      avatarUrl: body.avatarUrl,
      bio,
      onboardingCompleted: true,
    })

    return NextResponse.json({ profile })
  } catch (profileError) {
    console.error('[profile] update failed:', profileError)
    const message = profileError instanceof Error ? profileError.message : ''
    const normalized = message.toLowerCase()
    const isDuplicate = normalized.includes('duplicate') || normalized.includes('unique')
    return NextResponse.json(
      { error: isDuplicate ? 'This username is already taken.' : 'Could not update profile.' },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}
