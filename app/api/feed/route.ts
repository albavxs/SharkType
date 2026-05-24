import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { listFeedEvents } from '@/lib/server/feed-store'

export async function GET(request: Request) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const url = new URL(request.url)
  const scope = url.searchParams.get('scope') === 'following' ? 'following' : 'global'

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data: { user } } = await supabase.auth.getUser()

  if (scope === 'following' && !user) {
    return NextResponse.json({ events: [], scope, error: 'Authentication required for following feed.' }, { status: 401 })
  }

  try {
    const events = await listFeedEvents(supabase, scope, user?.id ?? null, 50)
    return NextResponse.json({ events, scope })
  } catch (err) {
    return NextResponse.json({ events: [], scope, error: "Could not load feed." }, { status: 500 })
  }
}
