import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserAccess } from '@/lib/server/access-control'
import {
  createAsaasPixAutomaticAuthorization,
  getPlusPlan,
  isPlusPlanKey,
  upsertAsaasCustomer,
  type PlusPlanKey,
} from '@/lib/server/asaas'

function normalizeCpfCnpj(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const digits = value.replace(/\D/g, '')
  return digits.length === 11 || digits.length === 14 ? digits : null
}

async function readInput(request: Request): Promise<{ plan: PlusPlanKey; cpfCnpj: string } | null> {
  const body = await request.json().catch(() => ({})) as { plan?: unknown; cpfCnpj?: unknown }
  const plan = body.plan == null ? 'monthly' : isPlusPlanKey(body.plan) ? body.plan : null
  const cpfCnpj = normalizeCpfCnpj(body.cpfCnpj)
  if (!plan || !cpfCnpj) return null
  return { plan, cpfCnpj }
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

  const input = await readInput(request)
  if (!input) {
    return NextResponse.json({ error: 'Informe um plano válido e um CPF/CNPJ válido.' }, { status: 400 })
  }

  try {
    const access = await getUserAccess(supabase, user)
    if (access.isPlus) {
      return NextResponse.json({ error: 'Plus access is already active.' }, { status: 409 })
    }

    const plan = getPlusPlan(input.plan)
    const profileResult = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('id', user.id)
      .maybeSingle()

    const displayName = profileResult.data?.display_name?.trim()
      || profileResult.data?.username?.trim()
      || user.email?.split('@')[0]
      || 'SharkType user'

    const customer = await upsertAsaasCustomer({
      externalReference: `sharktype:user:${user.id}`,
      name: displayName,
      cpfCnpj: input.cpfCnpj,
      email: user.email ?? null,
    })

    const contractId = `sharktype:plus:pix:${plan.key}:${randomUUID()}`
    const authorization = await createAsaasPixAutomaticAuthorization({
      customerId: customer.id,
      contractId,
      amount: plan.amount,
      cycle: plan.cycle,
      description: `SharkType Plus — ${plan.key}`,
    })

    const admin = createAdminClient() as any
    const qrExpiration = authorization.qrCode.expirationDate
      ? new Date(authorization.qrCode.expirationDate.replace(' ', 'T') + (authorization.qrCode.expirationDate.includes('Z') ? '' : '-03:00')).toISOString()
      : null

    const { error: insertError } = await admin.from('billing_pix_authorizations').insert({
      user_id: user.id,
      provider: 'asaas',
      provider_authorization_id: authorization.id,
      provider_customer_id: customer.id,
      plan_key: plan.key,
      status: authorization.status,
      frequency: authorization.frequency,
      amount: plan.amount,
      sandbox: authorization.sandbox,
      conciliation_identifier: authorization.qrCode.conciliationIdentifier,
      qr_expires_at: qrExpiration,
    })
    if (insertError) throw insertError

    return NextResponse.json({
      authorizationId: authorization.id,
      status: authorization.status,
      plan: plan.key,
      amount: plan.amount,
      frequency: authorization.frequency,
      sandbox: authorization.sandbox,
      qrCode: authorization.qrCode,
    }, { status: 201 })
  } catch (authorizationError) {
    console.error('[billing] Pix Automatic authorization failed:', authorizationError instanceof Error ? authorizationError.message : authorizationError)
    return NextResponse.json({
      error: authorizationError instanceof Error
        ? authorizationError.message
        : 'Could not create Pix Automatic authorization.',
    }, { status: 500 })
  }
}
