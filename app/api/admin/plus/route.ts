import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireSuperAdmin } from '@/lib/server/access-control'

function isAdminConfigError(error: unknown) {
  return error instanceof Error && error.message === 'Supabase admin credentials are not configured.'
}

function adminBackendUnavailable() {
  return NextResponse.json(
    {
      error: 'Admin backend is not configured.',
      code: 'ADMIN_SERVICE_UNAVAILABLE',
    },
    { status: 503 },
  )
}

async function getActor() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { error: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) }

  try {
    await requireSuperAdmin(supabase, user)
    return { user }
  } catch {
    return { error: NextResponse.json({ error: 'Forbidden.' }, { status: 403 }) }
  }
}

export async function GET() {
  const actor = await getActor()
  if ('error' in actor) return actor.error

  try {
    const admin = createAdminClient() as any
    const { data: entitlements, error } = await admin
      .from('user_entitlements')
      .select('*')
      .eq('plan_id', 'plus')
      .order('updated_at', { ascending: false })
      .limit(100)
    if (error) throw error

    const userIds = [...new Set((entitlements ?? []).map((row: any) => row.user_id))]
    const profilesById = new Map<string, any>()
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await admin
        .from('profiles')
        .select('id,username,display_name,is_super_user')
        .in('id', userIds)
      if (profilesError) throw profilesError
      for (const profile of profiles ?? []) profilesById.set(profile.id, profile)
    }

    return NextResponse.json({
      entitlements: (entitlements ?? []).map((row: any) => ({
        ...row,
        profile: profilesById.get(row.user_id) ?? null,
      })),
    })
  } catch (error) {
    console.error('[admin-plus] list failed:', error instanceof Error ? error.message : error)
    if (isAdminConfigError(error)) return adminBackendUnavailable()
    return NextResponse.json({ error: 'Could not load Plus entitlements.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const actor = await getActor()
  if ('error' in actor) return actor.error

  let body: { action?: unknown; username?: unknown; reason?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const action = body.action
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
  const reason = typeof body.reason === 'string' && body.reason.trim() ? body.reason.trim().slice(0, 500) : null

  if ((action !== 'grant' && action !== 'revoke') || !username) {
    return NextResponse.json({ error: 'action and username are required.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient() as any
    const { data: target, error: targetError } = await admin
      .from('profiles')
      .select('id,username,display_name,is_super_user')
      .eq('username', username)
      .maybeSingle()
    if (targetError) throw targetError
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    if (target.is_super_user) {
      return NextResponse.json(
        { error: 'Super admins already have intrinsic Plus access and do not need a manual grant.' },
        { status: 409 },
      )
    }

    if (action === 'grant') {
      const { error: grantError } = await admin.from('user_entitlements').upsert({
        user_id: target.id,
        plan_id: 'plus',
        status: 'manual_grant',
        source: 'manual_grant',
        provider: null,
        provider_customer_id: null,
        provider_subscription_id: null,
        granted_by: actor.user.id,
        reason,
        starts_at: new Date().toISOString(),
        expires_at: null,
      }, { onConflict: 'user_id,plan_id,source' })
      if (grantError) throw grantError
    } else {
      const { data: existing, error: existingError } = await admin
        .from('user_entitlements')
        .select('id')
        .eq('user_id', target.id)
        .eq('plan_id', 'plus')
        .eq('source', 'manual_grant')
        .maybeSingle()
      if (existingError) throw existingError
      if (!existing) return NextResponse.json({ error: 'User has no manual Plus grant to revoke.' }, { status: 404 })

      const { error: revokeError } = await admin
        .from('user_entitlements')
        .update({ status: 'cancelled', reason })
        .eq('id', existing.id)
      if (revokeError) throw revokeError
    }

    const { error: auditError } = await admin.from('entitlement_audit_events').insert({
      actor_user_id: actor.user.id,
      target_user_id: target.id,
      action: action === 'grant' ? 'manual_plus_granted' : 'manual_plus_revoked',
      plan_id: 'plus',
      source: 'manual_grant',
      reason,
      metadata: { username: target.username },
    })
    if (auditError) throw auditError

    return NextResponse.json({ ok: true, action, username: target.username })
  } catch (error) {
    console.error('[admin-plus] mutation failed:', error instanceof Error ? error.message : error)
    if (isAdminConfigError(error)) return adminBackendUnavailable()
    return NextResponse.json({ error: 'Could not update Plus access.' }, { status: 500 })
  }
}
