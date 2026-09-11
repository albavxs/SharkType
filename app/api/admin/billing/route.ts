import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireSuperAdmin } from '@/lib/server/access-control'
import { getPremiumContentHealth } from '@/lib/server/premium-content'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    await requireSuperAdmin(supabase, user)
  } catch {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  try {
    const admin = createAdminClient() as any
    const [checkoutsResult, subscriptionsResult, eventsResult, premiumHealth] = await Promise.all([
      admin.from('billing_checkouts').select('*').order('created_at', { ascending: false }).limit(20),
      admin.from('billing_subscriptions').select('*').order('created_at', { ascending: false }).limit(20),
      admin.from('billing_events').select('id,provider_event_id,event_type,received_at,processed_at,processing_error').order('received_at', { ascending: false }).limit(30),
      getPremiumContentHealth(),
    ])

    if (checkoutsResult.error) throw checkoutsResult.error
    if (subscriptionsResult.error) throw subscriptionsResult.error
    if (eventsResult.error) throw eventsResult.error

    const asaasEnv = process.env.ASAAS_ENV?.trim().toLowerCase() ?? null
    const apiConfigured = Boolean(process.env.ASAAS_API_KEY?.trim())
    const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN?.trim() ?? ''

    return NextResponse.json({
      config: {
        environment: asaasEnv,
        apiConfigured,
        webhookConfigured: webhookToken.length >= 32,
        sandbox: asaasEnv === 'sandbox',
      },
      premiumHealth,
      checkouts: checkoutsResult.data ?? [],
      subscriptions: subscriptionsResult.data ?? [],
      events: eventsResult.data ?? [],
    })
  } catch (statusError) {
    console.error('[admin-billing] status failed:', statusError instanceof Error ? statusError.message : statusError)
    return NextResponse.json({ error: 'Could not load billing status.' }, { status: 500 })
  }
}
