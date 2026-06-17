import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json } from '@/lib/supabase/database'
import type { I18nString } from '@/lib/types'

type DBClient = SupabaseClient<Database>
type FeedEventRow = Database['public']['Tables']['feed_events']['Row']
type RawFeedEventType = FeedEventRow['event_type']
type JsonObject = { [key: string]: Json | undefined }

export type FeedEventType = Exclude<RawFeedEventType, 'achievement_unlock'>

export interface FeedSessionPayload extends JsonObject {
  languageId: string
  wpm: number
  accuracy: number
  xpEarned: number
}

export interface FeedAchievementPayload extends JsonObject {
  achievementId: string
  name: I18nString
  xp?: number
}

export interface FeedLevelUpPayload extends JsonObject {
  level: number
}

export interface FeedFollowPayload extends JsonObject {
  targetId: string
  targetUsername: string
}

export interface FeedTrackCompletedPayload extends JsonObject {
  trackId: string
  name: I18nString
  xp?: number
}

export interface FeedPayloadMap {
  session: FeedSessionPayload
  achievement: FeedAchievementPayload
  level_up: FeedLevelUpPayload
  follow: FeedFollowPayload
  track_completed: FeedTrackCompletedPayload
}

type FeedEventBase<T extends FeedEventType> = {
  id: number
  userId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  eventType: T
  payload: FeedPayloadMap[T]
  createdAt: string
}

export type SessionFeedEvent = FeedEventBase<'session'>
export type AchievementFeedEvent = FeedEventBase<'achievement'>
export type LevelUpFeedEvent = FeedEventBase<'level_up'>
export type FollowFeedEvent = FeedEventBase<'follow'>
export type TrackCompletedFeedEvent = FeedEventBase<'track_completed'>

export type FeedEvent =
  | SessionFeedEvent
  | AchievementFeedEvent
  | LevelUpFeedEvent
  | FollowFeedEvent
  | TrackCompletedFeedEvent

type FeedEventQueryRow = Pick<FeedEventRow, 'id' | 'user_id' | 'event_type' | 'payload' | 'created_at'>

function isJsonObject(value: Json | null): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getString(value: JsonObject, key: string): string | null {
  const result = value[key]
  return typeof result === 'string' ? result : null
}

function getNumber(value: JsonObject, key: string): number | null {
  const result = value[key]
  return typeof result === 'number' ? result : null
}

function getI18nString(value: JsonObject, key: string): I18nString | null {
  const raw = value[key]
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const record = raw as JsonObject
  const pt = typeof record.pt === 'string' ? record.pt : null
  const en = typeof record.en === 'string' ? record.en : null
  if (!pt && !en) return null

  return {
    pt: pt ?? en ?? '',
    en: en ?? pt ?? '',
  }
}

function fallbackI18n(value: string, fallback = ''): I18nString {
  const resolved = value || fallback
  return { pt: resolved, en: resolved }
}

function normalizeAchievementPayload(payload: JsonObject): FeedAchievementPayload {
  const achievementId = getString(payload, 'achievementId') ?? getString(payload, 'achievement_id') ?? 'achievement'
  const name =
    getI18nString(payload, 'name') ??
    (() => {
      const pt = getString(payload, 'achievement_name_pt')
      const en = getString(payload, 'achievement_name_en')
      if (!pt && !en) return null
      return {
        pt: pt ?? en ?? achievementId,
        en: en ?? pt ?? achievementId,
      }
    })() ??
    fallbackI18n(achievementId, 'achievement')

  const xp = getNumber(payload, 'xp')

  return xp === null
    ? { achievementId, name }
    : { achievementId, name, xp }
}

function normalizeTrackCompletedPayload(payload: JsonObject): FeedTrackCompletedPayload {
  const trackId = getString(payload, 'trackId') ?? 'track'
  const name = getI18nString(payload, 'name') ?? fallbackI18n(trackId, 'track')
  const xp = getNumber(payload, 'xp')

  return xp === null
    ? { trackId, name }
    : { trackId, name, xp }
}

function normalizeFeedEvent(row: FeedEventQueryRow): FeedEvent | null {
  const payload = isJsonObject(row.payload) ? row.payload : {}

  switch (row.event_type as RawFeedEventType) {
    case 'session':
      return {
        id: row.id,
        userId: row.user_id,
        username: 'unknown',
        displayName: null,
        avatarUrl: null,
        eventType: 'session',
        payload: {
          languageId: getString(payload, 'languageId') ?? '',
          wpm: getNumber(payload, 'wpm') ?? 0,
          accuracy: getNumber(payload, 'accuracy') ?? 0,
          xpEarned: getNumber(payload, 'xpEarned') ?? 0,
        },
        createdAt: row.created_at,
      }
    case 'achievement':
    case 'achievement_unlock':
      return {
        id: row.id,
        userId: row.user_id,
        username: 'unknown',
        displayName: null,
        avatarUrl: null,
        eventType: 'achievement',
        payload: normalizeAchievementPayload(payload),
        createdAt: row.created_at,
      }
    case 'level_up':
      return {
        id: row.id,
        userId: row.user_id,
        username: 'unknown',
        displayName: null,
        avatarUrl: null,
        eventType: 'level_up',
        payload: {
          level: getNumber(payload, 'level') ?? 0,
        },
        createdAt: row.created_at,
      }
    case 'follow':
      return {
        id: row.id,
        userId: row.user_id,
        username: 'unknown',
        displayName: null,
        avatarUrl: null,
        eventType: 'follow',
        payload: {
          targetId: getString(payload, 'targetId') ?? '',
          targetUsername: getString(payload, 'targetUsername') ?? 'unknown',
        },
        createdAt: row.created_at,
      }
    case 'track_completed':
      return {
        id: row.id,
        userId: row.user_id,
        username: 'unknown',
        displayName: null,
        avatarUrl: null,
        eventType: 'track_completed',
        payload: normalizeTrackCompletedPayload(payload),
        createdAt: row.created_at,
      }
    default:
      return null
  }
}

/**
 * Insere evento no feed_events. Best-effort: erros sao swallowados
 * (chamado dentro de saveRemoteSession e checkUnlocks).
 */
export async function recordFeedEvent<T extends FeedEventType>(
  supabase: DBClient,
  userId: string,
  eventType: T,
  payload: FeedPayloadMap[T],
  options?: { createdAt?: string }
): Promise<void> {
  try {
    await supabase.from('feed_events').insert({
      user_id: userId,
      event_type: eventType,
      payload,
      created_at: options?.createdAt,
    })
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
    userIds = (followsRes.data ?? []).map((row) => row.following_id)
    if (userIds.length === 0) return []
  }

  // Tenta single-query com embedded profile (PostgREST relationship).
  // Se o relationship nao estiver definido no DB (FK ausente), cai pro fallback 2-query.
  let query = supabase
    .from('feed_events')
    .select('id, user_id, event_type, payload, created_at, profiles:profiles!feed_events_user_id_fkey(id, username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userIds) query = query.in('user_id', userIds)

  const joinedRes = await query
  if (!joinedRes.error && joinedRes.data) {
    return joinedRes.data
      .map((row: any) => {
        const event = normalizeFeedEvent({
          id: row.id,
          user_id: row.user_id,
          event_type: row.event_type,
          payload: row.payload,
          created_at: row.created_at,
        })
        if (!event) return null
        const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
        return {
          ...event,
          username: p?.username ?? 'unknown',
          displayName: p?.display_name ?? null,
          avatarUrl: p?.avatar_url ?? null,
        }
      })
      .filter((event): event is FeedEvent => Boolean(event))
  }

  // Fallback: 2-query (FK nao declarada). Mantem comportamento antigo.
  let fallbackQuery = supabase
    .from('feed_events')
    .select('id, user_id, event_type, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userIds) fallbackQuery = fallbackQuery.in('user_id', userIds)

  const eventsRes = await fallbackQuery
  if (eventsRes.error) return []
  const events = (eventsRes.data ?? [])
    .map(normalizeFeedEvent)
    .filter((event): event is FeedEvent => Boolean(event))

  if (events.length === 0) return []

  const distinctUserIds = Array.from(new Set(events.map((event) => event.userId)))
  const profilesRes = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', distinctUserIds)
  if (profilesRes.error) return []

  const profileMap = new Map<string, { username: string; display_name: string | null; avatar_url: string | null }>()
  for (const p of profilesRes.data ?? []) {
    profileMap.set(p.id, {
      username: p.username,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
    })
  }

  return events.map((event) => {
    const profile = profileMap.get(event.userId)
    return {
      ...event,
      username: profile?.username ?? 'unknown',
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    }
  })
}
