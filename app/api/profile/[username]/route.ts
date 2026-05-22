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
  if (!username || username.length < 3 || username.length > 20) {
    return NextResponse.json({ error: 'Invalid username.' }, { status: 400 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data: { user } } = await supabase.auth.getUser()

  try {
    const profile = await getPublicProfile(supabase, username, user?.id ?? null)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })
    }
    return NextResponse.json({ profile })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not load profile.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
