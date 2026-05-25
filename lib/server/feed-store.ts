import type { SupabaseClient } from '@supabase/supabase-js'

type DBClient = SupabaseClient<any>

export type FeedEventType = 'session' | 'achievement' | 'level_up' | 'follow'

export interface FeedEvent {
  id: number
  userId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  eventType: FeedEventType
  payload: Record<string, unknown>
  createdAt: string
}

/**
 * Insere evento no feed_events. Best-effort: erros sao swallowados
 * (chamado dentro de saveRemoteSession e checkUnlocks).
 */
export async function recordFeedEvent(
  supabase: DBClient,
  userId: string,
  eventType: FeedEventType,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from('feed_events').insert({ user_id: userId, event_type: eventType, payload })
  } catch {
    // ignora — tabela pode nao existir ainda
  }
}

/**
 * Lista eventos do feed. scope='global' retorna todos, scope='following'
 * exige viewerId e filtra apenas usuarios seguidos.
 */
export async function listFeedEvents(
  supabase: DBClient,
  scope: 'global' | 'following',
  viewerId: string | null,
  limit = 50,
): Promise<FeedEvent[]> {
  // Buscar IDs seguidos primeiro se scope=following
  let userIds: string[] | null = null
  if (scope === 'following') {
    if (!viewerId) return []
    const followsRes = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', viewerId)
    if (followsRes.error) return []
    userIds = (followsRes.data ?? []).map((r: any) => r.following_id)
    if (userIds.length === 0) return []
  }

  let query = supabase
    .from('feed_events')
    .select('id, user_id, event_type, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userIds) query = query.in('user_id', userIds)

  const eventsRes = await query
  if (eventsRes.error) return []
  const events = (eventsRes.data ?? []) as Array<{
    id: number
    user_id: string
    event_type: FeedEventType
    payload: Record<string, unknown>
    created_at: string
  }>

  if (events.length === 0) return []

  // Hidrata com perfis (1 query batched)
  const distinctUserIds = Array.from(new Set(events.map(e => e.user_id)))
  const profilesRes = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', distinctUserIds)
  if (profilesRes.error) return []

  const profileMap = new Map<string, { username: string; display_name: string | null; avatar_url: string | null }>()
  for (const p of profilesRes.data ?? []) {
    profileMap.set((p as any).id, {
      username: (p as any).username,
      display_name: (p as any).display_name,
      avatar_url: (p as any).avatar_url,
    })
  }

  return events.map(e => {
    const profile = profileMap.get(e.user_id)
    return {
      id: e.id,
      userId: e.user_id,
      username: profile?.username ?? 'unknown',
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      eventType: e.event_type,
      payload: e.payload,
      createdAt: e.created_at,
    }
  })
}
