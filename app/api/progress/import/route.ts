import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { importLocalProgress } from '@/lib/server/progress-store'
import { rateLimit } from '@/lib/server/rate-limit'
import { sanitizeImportedProgressSnapshot } from '@/lib/server/session-validation'

export async function POST(request: Request) {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { success } = rateLimit(`progress-import:${user.id}`, 3, 24 * 60 * 60 * 1000)
  if (!success) {
    return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
  }

  try {
    const body = (await request.json()) as { progress?: unknown }
    const progress = sanitizeImportedProgressSnapshot(body.progress)
    const result = await importLocalProgress(supabase, user, progress)
    return NextResponse.json(result)
  } catch (importError) {
    if (importError instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
    }
    return NextResponse.json(
      { error: importError instanceof Error ? importError.message : 'Could not import progress.' },
      { status: 500 }
    )
  }
}
