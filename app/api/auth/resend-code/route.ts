import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { createPublicClient } from '@/lib/supabase/public'
import { sharedRateLimit } from '@/lib/server/rate-limit'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  let body: { email?: unknown }
  try {
    body = (await request.json()) as { email?: unknown }
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const emailKey = createHash('sha256').update(email).digest('hex').slice(0, 32)
  const { success } = await sharedRateLimit(`auth-resend:${emailKey}`, 3, 15 * 60_000)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  try {
    const supabase = createPublicClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      console.warn('[auth-resend] provider rejected resend:', error.message)
    }
  } catch (resendError) {
    console.warn('[auth-resend] resend failed:', resendError instanceof Error ? resendError.message : resendError)
  }

  return NextResponse.json({ ok: true })
}
