import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { getUserProgressSnapshot, buildProgressAggregate } from '@/lib/server/progress-store'
import { collectProgressUnlocks } from '@/lib/server/achievements'
import { recordFeedEvent } from '@/lib/server/feed-store'
import { getTrackById } from '@/data/tracks'
import { listTrackBaseSummary } from '@/lib/server/track-store'

export async function POST(request: Request) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => null) as { trackId?: unknown } | null
  const trackId = typeof body?.trackId === 'string' ? body.trackId : ''
  if (!trackId) {
    return NextResponse.json({ error: 'Missing trackId' }, { status: 400 })
  }

  const track = getTrackById(trackId)
  if (!track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const admin = createAdminClient()
    const progressBefore = await getUserProgressSnapshot(admin, user.id)

    if (progressBefore.completedTrackIds?.includes(trackId)) {
      return NextResponse.json({ ok: true, alreadyCompleted: true })
    }

    const baseSummary = listTrackBaseSummary()[trackId]
    const completedSnippetIds = new Set(
      Object.values(progressBefore.languages).flatMap((language) => language.completedSnippetIds)
    )
    const hasCompletedEveryUnit = Boolean(baseSummary?.totalUnits) && baseSummary.units.every(
      (unit) => unit.snippetIds.some((snippetId) => completedSnippetIds.has(snippetId))
    )

    if (!hasCompletedEveryUnit) {
      return NextResponse.json(
        { error: 'Track completion requirements are not met.', code: 'TRACK_NOT_COMPLETED' },
        { status: 409 }
      )
    }

    const progressAfter = {
      ...progressBefore,
      completedTrackIds: [...(progressBefore.completedTrackIds || []), trackId],
    }

    const aggregate = buildProgressAggregate(user.id, progressAfter)
    const { error: updateError } = await admin
      .from('user_progress')
      .upsert(aggregate, { onConflict: 'user_id' })

    if (updateError) throw updateError

    const newlyUnlocked = await collectProgressUnlocks(admin, user.id, progressBefore, progressAfter)

    await recordFeedEvent(admin, user.id, 'track_completed', {
      trackId,
      name: track.name,
    })

    return NextResponse.json({
      ok: true,
      newlyUnlocked,
    })
  } catch (err) {
    console.error('[track-complete] error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
