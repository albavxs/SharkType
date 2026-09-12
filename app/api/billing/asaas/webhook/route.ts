import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getWebhookToken } from '@/lib/server/asaas'

type AsaasWebhookPayload = {
  id?: string
  event?: string
  checkout?: {
    id?: string
    status?: string
    customer?: string | null
  }
  subscription?: {
    id?: string
    customer?: string | null
    status?: string
    cycle?: string | null
    value?: number | null
    nextDueDate?: string | null
    externalReference?: string | null
  }
  payment?: {
    id?: string
    customer?: string | null
    subscription?: string | null
    status?: string
    value?: number | null
  }
  authorization?: {
    id?: string
    status?: string
    customerId?: string | null
    frequency?: string | null
    value?: number | null
    startDate?: string | null
    finishDate?: string | null
    immediateQrCode?: {
      conciliationIdentifier?: string | null
      expirationDate?: string | null
    }
  }
  paymentInstruction?: {
    id?: string
    status?: string
    dueDate?: string | null
    paymentId?: string | null
    payment?: string | null
    authorization?: { id?: string | null }
  }
  [key: string]: unknown
}

function safeTokenEquals(received: string, expected: string): boolean {
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function checkoutStatus(event: string): string | null {
  if (event === 'CHECKOUT_PAID') return 'paid'
  if (event === 'CHECKOUT_CANCELED') return 'canceled'
  if (event === 'CHECKOUT_EXPIRED') return 'expired'
  if (event === 'CHECKOUT_CREATED') return 'active'
  return null
}

async function findBillingOwnerForCustomer(admin: any, customerId: string | null | undefined) {
  if (!customerId) return null

  const { data: checkout } = await admin
    .from('billing_checkouts')
    .select('user_id,purpose,sandbox,provider_customer_id')
    .eq('provider', 'asaas')
    .eq('provider_customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (checkout) return checkout

  const { data: pixAuthorization } = await admin
    .from('billing_pix_authorizations')
    .select('user_id,sandbox,provider_customer_id')
    .eq('provider', 'asaas')
    .eq('provider_customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!pixAuthorization) return null
  return {
    ...pixAuthorization,
    purpose: 'plus_subscription',
  }
}

async function upsertPlusEntitlement(admin: any, input: {
  userId: string
  customerId?: string | null
  subscriptionId?: string | null
  status: 'active' | 'overdue' | 'cancelled'
  reason: string
}) {
  const { error } = await admin.from('user_entitlements').upsert({
    user_id: input.userId,
    plan_id: 'plus',
    status: input.status,
    source: 'asaas',
    provider: 'asaas',
    provider_customer_id: input.customerId ?? null,
    provider_subscription_id: input.subscriptionId ?? null,
    reason: input.reason,
    expires_at: null,
  }, { onConflict: 'user_id,plan_id,source' })
  if (error) throw error
}

async function recordAudit(admin: any, userId: string, action: string, metadata: Record<string, unknown>) {
  const { error } = await admin.from('entitlement_audit_events').insert({
    target_user_id: userId,
    action,
    plan_id: 'plus',
    source: 'asaas',
    reason: 'Asaas webhook synchronization',
    metadata,
  })
  if (error) throw error
}

async function processCheckoutEvent(admin: any, payload: AsaasWebhookPayload) {
  const event = payload.event ?? ''
  const checkout = payload.checkout
  const status = checkoutStatus(event)
  if (!checkout?.id || !status) return

  const { data: localCheckout, error: findError } = await admin
    .from('billing_checkouts')
    .select('*')
    .eq('provider', 'asaas')
    .eq('provider_checkout_id', checkout.id)
    .maybeSingle()
  if (findError) throw findError
  if (!localCheckout) return

  const { error: updateError } = await admin
    .from('billing_checkouts')
    .update({
      status,
      provider_customer_id: checkout.customer ?? localCheckout.provider_customer_id ?? null,
    })
    .eq('id', localCheckout.id)
  if (updateError) throw updateError

  if (localCheckout.sandbox || localCheckout.purpose !== 'plus_subscription') return

  if (event === 'CHECKOUT_PAID') {
    await upsertPlusEntitlement(admin, {
      userId: localCheckout.user_id,
      customerId: checkout.customer,
      status: 'active',
      reason: 'Initial Asaas checkout paid',
    })
    await recordAudit(admin, localCheckout.user_id, 'asaas_checkout_paid', { checkoutId: checkout.id })
  }
}

async function processPixAutomaticEvent(admin: any, payload: AsaasWebhookPayload) {
  const event = payload.event ?? ''
  const authorization = payload.authorization
  if (!event.startsWith('PIX_AUTOMATIC_RECURRING_AUTHORIZATION_') || !authorization?.id) return

  const { data: localAuthorization, error: findError } = await admin
    .from('billing_pix_authorizations')
    .select('*')
    .eq('provider', 'asaas')
    .eq('provider_authorization_id', authorization.id)
    .maybeSingle()
  if (findError) throw findError
  if (!localAuthorization) return

  const status = authorization.status
    ?? (event.endsWith('_ACTIVATED') ? 'ACTIVE'
      : event.endsWith('_CANCELLED') ? 'CANCELLED'
        : event.endsWith('_EXPIRED') ? 'EXPIRED'
          : event.endsWith('_REFUSED') ? 'REFUSED'
            : 'CREATED')

  const { error: updateError } = await admin
    .from('billing_pix_authorizations')
    .update({
      status,
      provider_customer_id: authorization.customerId ?? localAuthorization.provider_customer_id,
      frequency: authorization.frequency ?? localAuthorization.frequency,
      amount: authorization.value ?? localAuthorization.amount,
      conciliation_identifier: authorization.immediateQrCode?.conciliationIdentifier
        ?? localAuthorization.conciliation_identifier,
    })
    .eq('id', localAuthorization.id)
  if (updateError) throw updateError

  if (localAuthorization.sandbox) return

  if (event === 'PIX_AUTOMATIC_RECURRING_AUTHORIZATION_ACTIVATED') {
    await upsertPlusEntitlement(admin, {
      userId: localAuthorization.user_id,
      customerId: authorization.customerId ?? localAuthorization.provider_customer_id,
      status: 'active',
      reason: 'Asaas Pix Automatic authorization activated',
    })
    await recordAudit(admin, localAuthorization.user_id, 'asaas_pix_automatic_activated', {
      authorizationId: authorization.id,
    })
  }
}

async function processSubscriptionEvent(admin: any, payload: AsaasWebhookPayload) {
  const subscription = payload.subscription
  const event = payload.event ?? ''
  if (!subscription?.id) return

  const linkedOwner = await findBillingOwnerForCustomer(admin, subscription.customer)
  if (!linkedOwner) return

  const subscriptionStatus = event === 'SUBSCRIPTION_DELETED' || event === 'SUBSCRIPTION_INACTIVATED'
    ? 'INACTIVE'
    : subscription.status ?? 'UNKNOWN'

  const { error: upsertError } = await admin.from('billing_subscriptions').upsert({
    user_id: linkedOwner.user_id,
    provider: 'asaas',
    purpose: linkedOwner.purpose,
    provider_subscription_id: subscription.id,
    provider_customer_id: subscription.customer ?? null,
    status: subscriptionStatus,
    cycle: subscription.cycle ?? null,
    amount: subscription.value ?? null,
    next_due_date: subscription.nextDueDate?.slice(0, 10) ?? null,
    sandbox: Boolean(linkedOwner.sandbox),
  }, { onConflict: 'provider,provider_subscription_id' })
  if (upsertError) throw upsertError

  if (linkedOwner.sandbox || linkedOwner.purpose !== 'plus_subscription') return

  if (event === 'SUBSCRIPTION_INACTIVATED' || event === 'SUBSCRIPTION_DELETED') {
    await upsertPlusEntitlement(admin, {
      userId: linkedOwner.user_id,
      customerId: subscription.customer,
      subscriptionId: subscription.id,
      status: 'cancelled',
      reason: `Asaas ${event.toLowerCase()}`,
    })
    await recordAudit(admin, linkedOwner.user_id, 'asaas_subscription_inactive', { subscriptionId: subscription.id, event })
    return
  }

  if (subscriptionStatus === 'ACTIVE') {
    await upsertPlusEntitlement(admin, {
      userId: linkedOwner.user_id,
      customerId: subscription.customer,
      subscriptionId: subscription.id,
      status: 'active',
      reason: 'Asaas subscription active',
    })
  }
}

async function processPaymentEvent(admin: any, payload: AsaasWebhookPayload) {
  const event = payload.event ?? ''
  const payment = payload.payment
  if (!payment?.subscription) return

  const { data: subscription, error } = await admin
    .from('billing_subscriptions')
    .select('*')
    .eq('provider', 'asaas')
    .eq('provider_subscription_id', payment.subscription)
    .maybeSingle()
  if (error) throw error
  if (!subscription || subscription.sandbox || subscription.purpose !== 'plus_subscription') return

  if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
    await upsertPlusEntitlement(admin, {
      userId: subscription.user_id,
      customerId: payment.customer,
      subscriptionId: payment.subscription,
      status: 'active',
      reason: `Asaas ${event.toLowerCase()}`,
    })
  } else if (event === 'PAYMENT_OVERDUE') {
    await upsertPlusEntitlement(admin, {
      userId: subscription.user_id,
      customerId: payment.customer,
      subscriptionId: payment.subscription,
      status: 'overdue',
      reason: 'Asaas payment overdue',
    })
  } else if (event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_CHARGEBACK_REQUESTED') {
    await upsertPlusEntitlement(admin, {
      userId: subscription.user_id,
      customerId: payment.customer,
      subscriptionId: payment.subscription,
      status: 'cancelled',
      reason: `Asaas ${event.toLowerCase()}`,
    })
  }
}

export async function POST(request: Request) {
  let expectedToken: string
  try {
    expectedToken = getWebhookToken()
  } catch (error) {
    console.error('[billing] webhook configuration error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  }

  const receivedToken = request.headers.get('asaas-access-token') ?? ''
  if (!safeTokenEquals(receivedToken, expectedToken)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let payload: AsaasWebhookPayload
  try {
    payload = (await request.json()) as AsaasWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (!payload.id || !payload.event) {
    return NextResponse.json({ error: 'Missing webhook event id or type.' }, { status: 400 })
  }

  const admin = createAdminClient() as any
  let retryingUnprocessedEvent = false

  const { error: insertError } = await admin.from('billing_events').insert({
    provider: 'asaas',
    provider_event_id: payload.id,
    event_type: payload.event,
    payload,
  })

  if (insertError) {
    if (insertError.code !== '23505') {
      console.error('[billing] webhook persistence failed:', insertError.message)
      return NextResponse.json({ error: 'Could not persist webhook event.' }, { status: 500 })
    }

    const { data: existing, error: existingError } = await admin
      .from('billing_events')
      .select('processed_at,processing_error')
      .eq('provider', 'asaas')
      .eq('provider_event_id', payload.id)
      .maybeSingle()

    if (existingError) {
      console.error('[billing] duplicate webhook lookup failed:', existingError.message)
      return NextResponse.json({ error: 'Could not inspect duplicate webhook event.' }, { status: 500 })
    }

    if (existing?.processed_at) {
      return NextResponse.json({ received: true, duplicate: true, processed: true })
    }

    retryingUnprocessedEvent = true
  }

  try {
    if (payload.event.startsWith('CHECKOUT_')) await processCheckoutEvent(admin, payload)
    if (payload.event.startsWith('SUBSCRIPTION_')) await processSubscriptionEvent(admin, payload)
    if (payload.event.startsWith('PAYMENT_')) await processPaymentEvent(admin, payload)
    if (payload.event.startsWith('PIX_AUTOMATIC_RECURRING_')) await processPixAutomaticEvent(admin, payload)

    await admin
      .from('billing_events')
      .update({ processed_at: new Date().toISOString(), processing_error: null })
      .eq('provider', 'asaas')
      .eq('provider_event_id', payload.id)

    return NextResponse.json({ received: true, retried: retryingUnprocessedEvent })
  } catch (processingError) {
    const message = processingError instanceof Error ? processingError.message : 'Unknown webhook processing error.'
    console.error('[billing] webhook processing failed:', message)
    await admin
      .from('billing_events')
      .update({ processing_error: message })
      .eq('provider', 'asaas')
      .eq('provider_event_id', payload.id)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
