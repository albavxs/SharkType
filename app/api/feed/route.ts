import { NextResponse } from 'next/server'
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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (scope === 'following' && !user) {
    return NextResponse.json({ events: [], scope, error: 'Authentication required for following feed.' }, { status: 401 })
  }

  try {
    const events = await listFeedEvents(supabase, scope, user?.id ?? null, 50)
    // Feed global pode ser cacheado por 60s (conteudo agregado, mudanca tolerada).
    // Feed following e per-user (cookies), nao pode entrar no shared cache.
    const headers: HeadersInit = scope === 'global'
      ? { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' }
      : { 'Cache-Control': 'private, no-store' }
    return NextResponse.json({ events, scope }, { headers })
  } catch (err) {
    return NextResponse.json({ events: [], scope, error: "Could not load feed." }, { status: 500 })
  }
}
