import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { importLocalProgress } from '@/lib/server/progress-store'
import { rateLimit } from '@/lib/server/rate-limit'
import { sanitizeImportedProgressSnapshot } from '@/lib/server/session-validation'

function legacyImportEnabled(): boolean {
  return process.env.ALLOW_LEGACY_PROGRESS_IMPORT?.trim().toLowerCase() === 'true'
}

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

  // Imported browser history is not authoritative enough for competitive stats.
  // Keep the migration path closed by default and enable it only during an
  // explicitly controlled migration window.
  if (!legacyImportEnabled()) {
    return NextResponse.json(
      { error: 'Legacy progress import is disabled.' },
      { status: 410 }
    )
  }

  const { success } = rateLimit(`progress-import:${user.id}`, 1, 24 * 60 * 60 * 1000)
  if (!success) {
    return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
  }

  try {
    const body = (await request.json()) as { progress?: unknown }
    const progress = sanitizeImportedProgressSnapshot(body.progress)
    const admin = createAdminClient()
    const result = await importLocalProgress(admin, user, progress)
    return NextResponse.json(result)
  } catch (importError) {
    if (importError instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
    }
    console.error('[progress-import] failed:', importError instanceof Error ? importError.message : importError)
    return NextResponse.json(
      { error: 'Could not import progress.' },
      { status: 500 }
    )
  }
}
