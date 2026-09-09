import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'

function buildCheckoutUrl(baseUrl: string, userId: string, email?: string | null): string {
  const url = new URL(baseUrl)
  url.searchParams.set('externalReference', userId)
  if (email) url.searchParams.set('email', email)
  return url.toString()
}

export async function POST() {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const checkoutBaseUrl = process.env.ASAAS_PLUS_CHECKOUT_URL
  if (!checkoutBaseUrl) {
    return NextResponse.json(
      { error: 'ASAAS_PLUS_CHECKOUT_URL is not configured.' },
      { status: 503 },
    )
  }

  return NextResponse.json({
    provider: 'asaas',
    checkoutUrl: buildCheckoutUrl(checkoutBaseUrl, user.id, user.email),
  })
}
