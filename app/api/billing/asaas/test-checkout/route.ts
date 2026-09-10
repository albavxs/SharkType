import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserAccess } from '@/lib/server/access-control'
import { createAsaasRecurringCheckout, getAsaasConfig } from '@/lib/server/asaas'

const SANDBOX_TEST_AMOUNT = 1

function getCallbackBaseUrl(request: Request): string {
  const configured = process.env.APP_URL?.trim()
  if (configured) return configured
  return new URL(request.url).origin
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

  try {
    const access = await getUserAccess(supabase, user)
    if (!access.isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const config = getAsaasConfig()
    if (!config.sandbox) {
      return NextResponse.json({ error: 'Sandbox test checkout is disabled in production.' }, { status: 409 })
    }

    const checkoutId = randomUUID()
    const externalReference = `sharktype:sandbox-test:${checkoutId}`
    const admin = createAdminClient() as any

    const { error: insertError } = await admin.from('billing_checkouts').insert({
      id: checkoutId,
      user_id: user.id,
      provider: 'asaas',
      purpose: 'sandbox_test',
      external_reference: externalReference,
      status: 'creating',
      amount: SANDBOX_TEST_AMOUNT,
      currency: 'BRL',
      sandbox: true,
    })
    if (insertError) throw insertError

    try {
      const checkout = await createAsaasRecurringCheckout({
        externalReference,
        amount: SANDBOX_TEST_AMOUNT,
        callbackBaseUrl: getCallbackBaseUrl(request),
        itemName: 'SharkType Asaas Sandbox Test',
        itemDescription: 'Sandbox-only recurring billing validation. Does not grant Plus.',
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
        sandbox: true,
        amount: SANDBOX_TEST_AMOUNT,
        grantsPlus: false,
      })
    } catch (checkoutError) {
      await admin.from('billing_checkouts').update({ status: 'failed' }).eq('id', checkoutId)
      throw checkoutError
    }
  } catch (checkoutError) {
    console.error('[billing] sandbox checkout failed:', checkoutError instanceof Error ? checkoutError.message : checkoutError)
    return NextResponse.json(
      { error: checkoutError instanceof Error ? checkoutError.message : 'Could not start sandbox checkout.' },
      { status: 500 },
    )
  }
}
