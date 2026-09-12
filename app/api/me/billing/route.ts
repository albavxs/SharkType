import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess } from '@/lib/server/access-control'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const access = await getUserAccess(supabase, user)

    const [{ data: entitlement, error: entitlementError }, { data: subscription, error: subscriptionError }] = await Promise.all([
      supabase
        .from('user_entitlements')
        .select('status, source, starts_at, expires_at, provider_subscription_id, updated_at')
        .eq('user_id', user.id)
        .eq('plan_id', 'plus')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('billing_subscriptions')
        .select('provider, status, cycle, amount, next_due_date, sandbox, updated_at')
        .eq('user_id', user.id)
        .eq('purpose', 'plus_subscription')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    if (entitlementError) throw entitlementError
    if (subscriptionError) throw subscriptionError

    const source = access.isSuperAdmin
      ? 'super_admin'
      : entitlement?.source === 'manual_grant'
        ? 'manual_grant'
        : entitlement?.source === 'asaas'
          ? 'subscription'
          : null

    return NextResponse.json({
      access: {
        plan: access.plan,
        isPlus: access.isPlus,
        source,
      },
      entitlement: entitlement
        ? {
            status: entitlement.status,
            startsAt: entitlement.starts_at,
            expiresAt: entitlement.expires_at,
          }
        : null,
      subscription: source === 'subscription' && subscription
        ? {
            provider: subscription.provider,
            status: subscription.status,
            cycle: subscription.cycle,
            amount: subscription.amount,
            nextDueDate: subscription.next_due_date,
            sandbox: subscription.sandbox,
          }
        : null,
    })
  } catch (error) {
    console.error('[billing] failed to load own billing state:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Could not load billing state.' }, { status: 500 })
  }
}
