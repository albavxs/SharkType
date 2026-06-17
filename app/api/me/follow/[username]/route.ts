import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { rateLimit } from '@/lib/server/rate-limit'
import { recordFeedEvent } from '@/lib/server/feed-store'

async function authedAndTarget(username: string) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return { error: NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 }) }
  }
  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) }
  }
  const { data: target, error: tErr } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', username)
    .maybeSingle()
  if (tErr) return { error: NextResponse.json({ error: 'Profile not found.' }, { status: 500 }) }
  if (!target) return { error: NextResponse.json({ error: 'Profile not found.' }, { status: 404 }) }
  if (target.id === user.id) return { error: NextResponse.json({ error: 'Cannot follow yourself.' }, { status: 400 }) }
  return { supabase, viewer: user, target }
}

export async function POST(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const ctx = await authedAndTarget(username)
  if ('error' in ctx) return ctx.error

  // Rate limit: 30 follows por minuto por usuário (A3)
  const { success } = rateLimit(`follow:${ctx.viewer.id}`, 30, 60_000)
  if (!success) {
    return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
  }

  const { error } = await ctx.supabase.from('follows').insert({
    follower_id: ctx.viewer.id,
    following_id: ctx.target.id,
  })
  if (error && !String(error.message ?? '').includes('duplicate')) {
    return NextResponse.json({ error: 'Could not follow user.' }, { status: 500 })
  }

  // Registra evento no feed (best-effort)
  await recordFeedEvent(ctx.supabase, ctx.viewer.id, 'follow', {
    targetId: ctx.target.id,
    targetUsername: ctx.target.username,
  })

  return NextResponse.json({ following: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const ctx = await authedAndTarget(username)
  if ('error' in ctx) return ctx.error

  const { error } = await ctx.supabase
    .from('follows')
    .delete()
    .eq('follower_id', ctx.viewer.id)
    .eq('following_id', ctx.target.id)
  if (error) {
    return NextResponse.json({ error: 'Could not unfollow user.' }, { status: 500 })
  }
  return NextResponse.json({ following: false })
}
