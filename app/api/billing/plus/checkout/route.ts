import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserAccess } from '@/lib/server/access-control'
import {
  createAsaasRecurringCheckout,
  getAsaasConfig,
  getPlusPlan,
  isPlusPlanKey,
  type PlusPlanKey,
} from '@/lib/server/asaas'

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
    const checkoutId = randomUUID()
    const externalReference = `sharktype:plus:${plan.key}:${checkoutId}`
    const admin = createAdminClient() as any

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
      })
    } catch (checkoutError) {
      await admin.from('billing_checkouts').update({ status: 'failed' }).eq('id', checkoutId)
      throw checkoutError
    }
  } catch (checkoutError) {
    console.error('[billing] plus checkout failed:', checkoutError instanceof Error ? checkoutError.message : checkoutError)
    return NextResponse.json(
      { error: checkoutError instanceof Error ? checkoutError.message : 'Could not start checkout.' },
      { status: 500 },
    )
  }
}
