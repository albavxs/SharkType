import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { requireSuperAdmin } from '@/lib/server/access-control'

type AdminAction = 'grant' | 'revoke'

async function getAuthedAdmin() {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return { error: NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 }) }
  }

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) }
  }

  try {
    await requireSuperAdmin(supabase, user)
    return { supabase, user }
  } catch {
    return { error: NextResponse.json({ error: 'Forbidden.' }, { status: 403 }) }
  }
}

export async function GET() {
  const context = await getAuthedAdmin()
  if ('error' in context) return context.error

  const { supabase } = context
  const { data: entitlements, error } = await supabase
    .from('user_entitlements')
    .select('*, profiles:user_id(username, display_name, avatar_url)')
    .eq('plan_id', 'plus')
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entitlements: entitlements ?? [] })
}

export async function POST(request: Request) {
  const context = await getAuthedAdmin()
  if ('error' in context) return context.error

  const { supabase, user } = context
  const body = (await request.json()) as {
    username?: string
    userId?: string
    action?: AdminAction
    reason?: string
  }

  const action = body.action
  if (action !== 'grant' && action !== 'revoke') {
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
  }

  const profileQuery = supabase
    .from('profiles')
    .select('id, username')
    .limit(1)

  const { data: profiles, error: profileError } = body.userId
    ? await profileQuery.eq('id', body.userId)
    : await profileQuery.eq('username', body.username ?? '')

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const target = profiles?.[0]
  if (!target) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const reason = typeof body.reason === 'string' && body.reason.trim().length > 0
    ? body.reason.trim().slice(0, 280)
    : null

  if (action === 'grant') {
    const { error } = await supabase
      .from('user_entitlements')
      .upsert({
        user_id: target.id,
        plan_id: 'plus',
        status: 'manual_grant',
        source: 'manual_grant',
        provider: null,
        granted_by: user.id,
        reason,
        expires_at: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,plan_id,source' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    const { error } = await supabase
      .from('user_entitlements')
      .update({
        status: 'cancelled',
        reason,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', target.id)
      .eq('plan_id', 'plus')
      .eq('source', 'manual_grant')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  await supabase.from('entitlement_audit_events').insert({
    actor_user_id: user.id,
    target_user_id: target.id,
    action,
    plan_id: 'plus',
    source: 'manual_grant',
    reason,
    metadata: { username: target.username },
  })

  return NextResponse.json({ ok: true })
}
