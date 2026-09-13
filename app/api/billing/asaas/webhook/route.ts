import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Installed during prebuild by scripts/install-premium-package.mjs.
// @ts-expect-error Private package is intentionally absent from the public lockfile.
import * as privateWebhookModule from '@albavxs/sharktype-premium/billing/webhook'

const MAX_WEBHOOK_BYTES = 128 * 1024

type AsaasWebhookPayload = {
  id?: string
  event?: string
  [key: string]: unknown
}

type PrivateWebhookRuntime = {
  webhookTokenMatches: (received: string) => boolean
  summarizeAsaasWebhookPayload: (payload: AsaasWebhookPayload) => Record<string, unknown>
  processAsaasWebhookEvent: (admin: unknown, payload: AsaasWebhookPayload) => Promise<void>
}

const privateWebhook = privateWebhookModule as unknown as PrivateWebhookRuntime

export async function POST(request: Request) {
  try {
    const receivedToken = request.headers.get('asaas-access-token') ?? ''
    if (!privateWebhook.webhookTokenMatches(receivedToken)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
  } catch (error) {
    console.error('[billing] webhook configuration error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Webhook payload is too large.' }, { status: 413 })
  }

  const rawBody = await request.text()
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Webhook payload is too large.' }, { status: 413 })
  }

  let payload: AsaasWebhookPayload
  try {
    payload = JSON.parse(rawBody) as AsaasWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (
    !payload.id ||
    !payload.event ||
    payload.id.length > 200 ||
    payload.event.length > 160
  ) {
    return NextResponse.json({ error: 'Missing or invalid webhook event id/type.' }, { status: 400 })
  }

  const admin = createAdminClient()
  let retryingUnprocessedEvent = false

  const { error: insertError } = await admin.from('billing_events').insert({
    provider: 'asaas',
    provider_event_id: payload.id,
    event_type: payload.event,
    payload: privateWebhook.summarizeAsaasWebhookPayload(payload),
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
    await privateWebhook.processAsaasWebhookEvent(admin, payload)

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
