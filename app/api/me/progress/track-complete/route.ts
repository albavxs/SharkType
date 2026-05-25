import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { getUserProgressSnapshot } from '@/lib/server/progress-store'
import { checkUnlocks } from '@/lib/server/achievements'
import { recordFeedEvent } from '@/lib/server/feed-store'
import { getTrackById } from '@/data/tracks'

export async function POST(request: Request) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { trackId } = await request.json()
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
    const progress = await getUserProgressSnapshot(supabase, user.id)
    
    // Se ja completou, nao faz nada mas retorna ok
    if (progress.completedTrackIds?.includes(trackId)) {
      return NextResponse.json({ ok: true, alreadyCompleted: true })
    }

    // Adiciona trilha concluida
    const updatedCompletedTracks = [...(progress.completedTrackIds || []), trackId]
    progress.completedTrackIds = updatedCompletedTracks

    // Salva no banco
    const aggregate = buildProgressAggregate(user.id, progress)
    const { error: updateError } = await supabase
      .from('user_progress')
      .upsert(aggregate, { onConflict: 'user_id' })

    if (updateError) throw updateError

    // Hooks: achievements + feed events
    const newlyUnlocked = await checkUnlocks(supabase, user.id, progress)
    
    // Registra evento de trilha concluida no feed
    await recordFeedEvent(supabase, user.id, 'track_completed', {
      trackId,
      name: track.name,
    })

    // Registra achievements no feed
    for (const a of newlyUnlocked) {
      await recordFeedEvent(supabase, user.id, 'achievement', {
        achievementId: a.id,
        name: a.name,
      })
    }

    return NextResponse.json({
      ok: true,
      newlyUnlocked,
    })
  } catch (err) {
    console.error('[track-complete] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
