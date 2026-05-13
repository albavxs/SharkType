import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { saveRemoteSession } from '@/lib/server/progress-store'
import type { SessionInput } from '@/lib/gamification'

function isSessionInput(value: unknown): value is SessionInput {
  if (!value || typeof value !== 'object') return false
  const input = value as Record<string, unknown>

  return (
    typeof input.languageId === 'string' &&
    typeof input.snippetId === 'string' &&
    typeof input.wpm === 'number' &&
    typeof input.accuracy === 'number' &&
    typeof input.errors === 'number' &&
    typeof input.duration === 'number' &&
    typeof input.difficulty === 'string'
  )
}

export async function POST(request: Request) {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const payload = (await request.json()) as unknown
  if (!isSessionInput(payload)) {
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

  try {
    const result = await saveRemoteSession(supabase, user.id, payload)
    return NextResponse.json(result)
  } catch (sessionError) {
    return NextResponse.json(
      { error: sessionError instanceof Error ? sessionError.message : 'Could not save session.' },
      { status: 500 }
    )
  }
}
