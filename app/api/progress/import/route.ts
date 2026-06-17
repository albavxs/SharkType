import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createDefaultProgress, type UserProgress } from '@/lib/gamification'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
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
      lastActivityAt: progress?.streak?.lastActivityAt ?? empty.streak.lastActivityAt,
      lastStreakAt: progress?.streak?.lastStreakAt ?? empty.streak.lastStreakAt,
    },
    rankedScore: progress?.rankedScore ?? empty.rankedScore,
    rankedSessions: progress?.rankedSessions ?? empty.rankedSessions,
    languages: progress?.languages ?? empty.languages,
    history: Array.isArray(progress?.history) ? progress.history : empty.history,
    completedTrackIds: Array.isArray(progress?.completedTrackIds) ? progress.completedTrackIds : empty.completedTrackIds,
  }
}

export async function POST(request: Request) {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const body = (await request.json()) as { progress?: Partial<UserProgress> }
  const progress = normalizeProgressInput(body.progress)

  const MAX_RANKED_IMPORT = 50
  const rankedHistoryCount = progress.history.filter((s) => s.rankedEligible).length
  if (rankedHistoryCount > MAX_RANKED_IMPORT) {
    return NextResponse.json(
      { error: 'Import limit exceeded for ranked sessions.' },
      { status: 400 }
    )
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
    const result = await importLocalProgress(supabase, user, progress)
    return NextResponse.json(result)
  } catch (importError) {
    return NextResponse.json(
      { error: importError instanceof Error ? importError.message : 'Could not import progress.' },
      { status: 500 }
    )
  }
}
