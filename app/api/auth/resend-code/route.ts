import { NextResponse } from 'next/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { createPublicClient } from '@/lib/supabase/public'

export async function POST(request: Request) {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const body = (await request.json()) as { email?: string }
  if (!body.email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  try {
    const supabase = createPublicClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: body.email,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (resendError) {
    return NextResponse.json(
      { error: resendError instanceof Error ? resendError.message : 'Could not resend confirmation code.' },
      { status: 500 }
    )
  }
}
