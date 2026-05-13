import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDefaultProgress, type UserProgress } from '@/lib/gamification'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { importLocalProgress } from '@/lib/server/progress-store'

function normalizeProgressInput(progress?: Partial<UserProgress> | null): UserProgress {
  const empty = createDefaultProgress()

  return {
    version: 1,
    totalXP: progress?.totalXP ?? empty.totalXP,
    level: progress?.level ?? empty.level,
    streak: {
      current: progress?.streak?.current ?? empty.streak.current,
      lastPracticeDate: progress?.streak?.lastPracticeDate ?? empty.streak.lastPracticeDate,
    },
    languages: progress?.languages ?? empty.languages,
    history: Array.isArray(progress?.history) ? progress.history : empty.history,
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as { progress?: Partial<UserProgress> }
  const progress = normalizeProgressInput(body.progress)

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const result = await importLocalProgress(supabase, user, progress)
    return NextResponse.json(result)
  } catch (importError) {
    return NextResponse.json(
      { error: importError instanceof Error ? importError.message : 'Could not import progress.' },
      { status: 500 }
    )
  }
}
