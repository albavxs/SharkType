import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/lib/supabase/database'

type AsaasEntitlementStatus = 'active' | 'past_due' | 'overdue' | 'cancelled' | 'expired'

function timingSafeEqualString(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const left = encoder.encode(a)
  const right = encoder.encode(b)
  if (left.length !== right.length) return false

  let result = 0
  for (let index = 0; index < left.length; index++) {
    result |= left[index] ^ right[index]
  }
  return result === 0
}

function verifyWebhook(request: Request): boolean {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN
  if (!expected) return false

  const received =
    request.headers.get('asaas-access-token') ??
    request.headers.get('x-asaas-token') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    ''

  return timingSafeEqualString(received, expected)
}

function normalizeStatus(eventType: string, paymentStatus?: string): AsaasEntitlementStatus {
  const event = eventType.toUpperCase()
  const status = paymentStatus?.toUpperCase()

  if (event.includes('DELETED') || event.includes('CANCEL') || status === 'CANCELLED') return 'cancelled'
  if (event.includes('OVERDUE') || status === 'OVERDUE') return 'overdue'
  if (event.includes('EXPIRED') || status === 'EXPIRED') return 'expired'
  if (event.includes('RECEIVED') || event.includes('CONFIRMED') || event.includes('CREATED') || status === 'RECEIVED' || status === 'CONFIRMED') return 'active'
  return 'past_due'
}

function getNestedRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

export async function POST(request: Request) {
  if (!verifyWebhook(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const payload = (await request.json()) as Record<string, unknown>
  const eventType = String(payload.event ?? payload.type ?? 'unknown')
  const payment = getNestedRecord(payload.payment)
  const subscription = getNestedRecord(payload.subscription)
  const providerEventId = String(payload.id ?? `${eventType}:${payment.id ?? subscription.id ?? Date.now()}`)
  const userId = String(
    payment.externalReference ??
      subscription.externalReference ??
      payload.externalReference ??
      ''
  )

  if (!userId) {
    return NextResponse.json({ error: 'Missing externalReference user id.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error: eventError } = await supabase.from('billing_events').insert({
    provider: 'asaas',
    provider_event_id: providerEventId,
    event_type: eventType,
    payload: payload as Json,
  })

  if (eventError) {
    const message = eventError.message.toLowerCase()
    if (message.includes('duplicate') || message.includes('unique')) {
      return NextResponse.json({ ok: true, duplicate: true })
    }
    return NextResponse.json({ error: eventError.message }, { status: 500 })
  }

  const status = normalizeStatus(eventType, typeof payment.status === 'string' ? payment.status : undefined)
  const { error: entitlementError } = await supabase.from('user_entitlements').upsert({
    user_id: userId,
    plan_id: 'plus',
    status,
    source: 'asaas',
    provider: 'asaas',
    provider_customer_id: typeof payment.customer === 'string' ? payment.customer : null,
    provider_subscription_id: typeof subscription.id === 'string' ? subscription.id : typeof payment.subscription === 'string' ? payment.subscription : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,plan_id,source' })

  if (entitlementError) {
    return NextResponse.json({ error: entitlementError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
