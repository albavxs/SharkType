import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserAccess } from '@/lib/server/access-control'
import { sharedRateLimit } from '@/lib/server/rate-limit'
import {
  createAsaasRecurringCheckout,
  getAsaasConfig,
  getPlusPlan,
  isPlusPlanKey,
  type PlusPlanKey,
} from '@/lib/server/asaas'

const CHECKOUT_REUSE_WINDOW_MS = 15 * 60_000

function getCallbackBaseUrl(request: Request): string {
  const configured = process.env.APP_URL?.trim()
  if (configured) return configured
  return new URL(request.url).origin
}

async function readRequestedPlan(request: Request): Promise<PlusPlanKey | null> {
  const body = await request.json().catch(() => ({})) as { plan?: unknown }
  if (body.plan == null) return 'monthly'
  return isPlusPlanKey(body.plan) ? body.plan : null
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { success } = await sharedRateLimit(`plus-checkout:${user.id}`, 5, 10 * 60_000)
  if (!success) {
    return NextResponse.json({ error: 'Too many checkout attempts. Try again shortly.' }, { status: 429 })
  }

  const requestedPlan = await readRequestedPlan(request)
  if (!requestedPlan) {
    return NextResponse.json({ error: 'Invalid Plus plan.' }, { status: 400 })
  }

  try {
    const config = getAsaasConfig()
    if (config.sandbox) {
      return NextResponse.json(
        { error: 'Commercial Plus checkout is disabled while ASAAS_ENV=sandbox.' },
        { status: 409 },
      )
    }

    const access = await getUserAccess(supabase, user)
    if (access.isPlus) {
      return NextResponse.json({ error: 'Plus access is already active.' }, { status: 409 })
    }

    const plan = getPlusPlan(requestedPlan)
    const admin = createAdminClient()
    const recentThreshold = new Date(Date.now() - CHECKOUT_REUSE_WINDOW_MS).toISOString()
    const prefix = `sharktype:plus:${plan.key}:`

    const { data: existingCheckout, error: existingError } = await admin
      .from('billing_checkouts')
      .select('checkout_url,status,amount,created_at,external_reference')
      .eq('user_id', user.id)
      .eq('provider', 'asaas')
      .eq('purpose', 'plus_subscription')
      .eq('sandbox', false)
      .in('status', ['creating', 'active'])
      .gte('created_at', recentThreshold)
      .like('external_reference', `${prefix}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingError) throw existingError

    if (existingCheckout?.status === 'active' && existingCheckout.checkout_url) {
      return NextResponse.json({
        checkoutUrl: existingCheckout.checkout_url,
        plan: plan.key,
        cycle: plan.cycle,
        amount: Number(existingCheckout.amount),
        reused: true,
      })
    }

    if (existingCheckout?.status === 'creating') {
      return NextResponse.json(
        { error: 'A checkout is already being initialized. Try again shortly.' },
        { status: 409 },
      )
    }

    const checkoutId = randomUUID()
    const externalReference = `${prefix}${checkoutId}`

    const { error: insertError } = await admin.from('billing_checkouts').insert({
      id: checkoutId,
      user_id: user.id,
      provider: 'asaas',
      purpose: 'plus_subscription',
      external_reference: externalReference,
      status: 'creating',
      amount: plan.amount,
      currency: 'BRL',
      sandbox: false,
    })
    if (insertError) throw insertError

    try {
      const checkout = await createAsaasRecurringCheckout({
        externalReference,
        amount: plan.amount,
        callbackBaseUrl: getCallbackBaseUrl(request),
        itemName: plan.itemName,
        itemDescription: plan.itemDescription,
        cycle: plan.cycle,
      })

      const { error: updateError } = await admin
        .from('billing_checkouts')
        .update({
          provider_checkout_id: checkout.id,
          checkout_url: checkout.checkoutUrl,
          status: 'active',
        })
        .eq('id', checkoutId)
      if (updateError) throw updateError

      return NextResponse.json({
        checkoutUrl: checkout.checkoutUrl,
        plan: plan.key,
        cycle: plan.cycle,
        amount: plan.amount,
        reused: false,
      })
    } catch (checkoutError) {
      await admin.from('billing_checkouts').update({ status: 'failed' }).eq('id', checkoutId)
      throw checkoutError
    }
  } catch (checkoutError) {
    console.error('[billing] plus checkout failed:', checkoutError instanceof Error ? checkoutError.message : checkoutError)
    return NextResponse.json(
      { error: 'Could not start checkout.' },
      { status: 500 },
    )
  }
}
