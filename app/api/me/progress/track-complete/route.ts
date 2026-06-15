import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { getUserProgressSnapshot, buildProgressAggregate } from '@/lib/server/progress-store'
import { collectProgressUnlocks } from '@/lib/server/achievements'
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
    const progressBefore = await getUserProgressSnapshot(supabase, user.id)
    
    // Se ja completou, nao faz nada mas retorna ok
    if (progressBefore.completedTrackIds?.includes(trackId)) {
      return NextResponse.json({ ok: true, alreadyCompleted: true })
    }

    // Adiciona trilha concluida
    const progressAfter = {
      ...progressBefore,
      completedTrackIds: [...(progressBefore.completedTrackIds || []), trackId],
    }

    // Salva no banco
    const aggregate = buildProgressAggregate(user.id, progressAfter)
    const { error: updateError } = await supabase
      .from('user_progress')
      .upsert(aggregate, { onConflict: 'user_id' })

    if (updateError) throw updateError

    // Hooks: achievements + feed events
    const newlyUnlocked = await collectProgressUnlocks(supabase, user.id, progressBefore, progressAfter)
    
    // Registra evento de trilha concluida no feed
    await recordFeedEvent(supabase, user.id, 'track_completed', {
      trackId,
      name: track.name,
    })

    return NextResponse.json({
      ok: true,
      newlyUnlocked,
    })
  } catch (err) {
    console.error('[track-complete] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
