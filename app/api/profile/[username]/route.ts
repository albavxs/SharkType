import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { getPublicProfile } from '@/lib/server/profile-store'

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const { username } = await params
  const normalizedUsername = username.toLowerCase()
  if (!normalizedUsername || normalizedUsername.length < 3 || normalizedUsername.length > 20) {
    return NextResponse.json({ error: 'Invalid username.' }, { status: 400 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data: { user } } = await supabase.auth.getUser()

  try {
    const profile = await getPublicProfile(supabase, normalizedUsername, user?.id ?? null)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })
    }
    return NextResponse.json({ profile })
  } catch (err) {
    const candidate = err as { code?: string; message?: string } | null
    console.error('[profile-route] public profile lookup failed:', {
      username: normalizedUsername,
      code: candidate?.code ?? 'unknown',
      message: candidate?.message ?? String(err),
    })
    return NextResponse.json({ error: 'Could not load profile.' }, { status: 500 })
  }
}
