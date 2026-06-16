import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { saveRemoteSession } from '@/lib/server/progress-store'
import { rateLimit } from '@/lib/server/rate-limit'
import { isSessionInput, isValidSessionInput } from '@/lib/server/session-validation'

export async function POST(request: Request) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const payload = (await request.json()) as unknown
  if (!isSessionInput(payload)) {
    return NextResponse.json({ error: 'Invalid session payload.' }, { status: 400 })
  }

  if (payload.lenient) {
    return NextResponse.json({ error: "Lenient sessions are not saved." }, { status: 400 })
  }

  if (!isValidSessionInput(payload)) {
    return NextResponse.json({ error: 'Invalid session payload.' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // Rate limit: 20 sessões por minuto por usuário (A2)
  const { success } = rateLimit(`session:${user.id}`, 20, 60_000)
  if (!success) {
    return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
  }

  try {
    const result = await saveRemoteSession(supabase, user.id, payload)
    return NextResponse.json(result)
  } catch (sessionError) {
    console.error('[session] error:', sessionError)
    return NextResponse.json(
      { error: 'Could not save session.' },
      { status: 500 }
    )
  }
}
