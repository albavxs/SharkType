import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>

  try {
    const { id } = await params
  const feedEventId = parseInt(id, 10)
    if (isNaN(feedEventId)) {
      return NextResponse.json({ error: 'Invalid feed event ID' }, { status: 400 })
    }

    // Buscar likes com informacoes dos usuarios
    const likesRes = await supabase
      .from('feed_likes')
      .select('user_id, created_at')
      .eq('feed_event_id', feedEventId)
      .order('created_at', { ascending: false })

    if (likesRes.error) {
      throw likesRes.error
    }

    const likes = likesRes.data ?? []
    if (likes.length === 0) {
      return NextResponse.json({ likes: [], count: 0 }, { status: 200 })
    }

    // Hidrata com perfis
    const userIds = likes.map((l: any) => l.user_id)
    const profilesRes = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (profilesRes.error) {
      throw profilesRes.error
    }

    const profileMap = new Map<string, { username: string; avatar_url: string | null }>()
    for (const p of profilesRes.data ?? []) {
      profileMap.set((p as any).id, {
        username: (p as any).username,
        avatar_url: (p as any).avatar_url,
      })
    }

    const enrichedLikes = likes.map((l: any) => {
      const profile = profileMap.get(l.user_id)
      return {
        userId: l.user_id,
        username: profile?.username ?? 'unknown',
        avatarUrl: profile?.avatar_url ?? null,
        createdAt: l.created_at,
      }
    })

    return NextResponse.json({ likes: enrichedLikes, count: enrichedLikes.length }, { status: 200 })
  } catch (err) {
    console.error('Error fetching likes:', err)
    return NextResponse.json({ error: 'Failed to fetch likes', likes: [], count: 0 }, { status: 500 })
  }
}
