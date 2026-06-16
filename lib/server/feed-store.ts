import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json } from '@/lib/supabase/database'
import type { I18nString } from '@/lib/types'

type DBClient = SupabaseClient<Database>
type FeedEventRow = Database['public']['Tables']['feed_events']['Row']
type RawFeedEventType = FeedEventRow['event_type']
type JsonObject = { [key: string]: Json | undefined }

export type FeedEventType = Exclude<RawFeedEventType, 'achievement_unlock'>
export type ManualPostCategory = 'ranked_tip' | 'language_fact' | 'announcement'

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

export interface FeedManualPostPayload extends JsonObject {
  title: I18nString
  body: I18nString
  category: ManualPostCategory
  seedKey?: string
}

export interface FeedPayloadMap {
  session: FeedSessionPayload
  achievement: FeedAchievementPayload
  level_up: FeedLevelUpPayload
  follow: FeedFollowPayload
  track_completed: FeedTrackCompletedPayload
  manual_post: FeedManualPostPayload
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
export type ManualPostFeedEvent = FeedEventBase<'manual_post'>

export type FeedEvent =
  | SessionFeedEvent
  | AchievementFeedEvent
  | LevelUpFeedEvent
  | FollowFeedEvent
  | TrackCompletedFeedEvent
  | ManualPostFeedEvent

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

function normalizeManualCategory(value: string | null): ManualPostCategory {
  if (value === 'ranked_tip' || value === 'language_fact' || value === 'announcement') {
    return value
  }
  return 'announcement'
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
  return xp === null ? { achievementId, name } : { achievementId, name, xp }
}

function normalizeTrackCompletedPayload(payload: JsonObject): FeedTrackCompletedPayload {
  const trackId = getString(payload, 'trackId') ?? 'track'
  const name = getI18nString(payload, 'name') ?? fallbackI18n(trackId, 'track')
  const xp = getNumber(payload, 'xp')

  return xp === null ? { trackId, name } : { trackId, name, xp }
}

function normalizeManualPostPayload(payload: JsonObject): FeedManualPostPayload {
  const title = getI18nString(payload, 'title') ?? fallbackI18n('Post', 'post')
  const body = getI18nString(payload, 'body') ?? fallbackI18n('', '')
  const category = normalizeManualCategory(getString(payload, 'category'))
  const seedKey = getString(payload, 'seedKey') ?? getString(payload, 'seed_key') ?? undefined

  return seedKey ? { title, body, category, seedKey } : { title, body, category }
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
    case 'manual_post':
      return {
        id: row.id,
        userId: row.user_id,
        username: 'unknown',
        displayName: null,
        avatarUrl: null,
        eventType: 'manual_post',
        payload: normalizeManualPostPayload(payload),
        createdAt: row.created_at,
      }
    default:
      return null
  }
}

async function hydrateFeedEvents(supabase: DBClient, events: FeedEvent[]): Promise<FeedEvent[]> {
  if (events.length === 0) return []

  const distinctUserIds = Array.from(new Set(events.map((event) => event.userId)))
  const profilesRes = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', distinctUserIds)

  if (profilesRes.error) return []

  const profileMap = new Map<string, { username: string; display_name: string | null; avatar_url: string | null }>()
  for (const profile of profilesRes.data ?? []) {
    profileMap.set(profile.id, {
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
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

export async function getFeedEventById(
  supabase: DBClient,
  id: number,
): Promise<FeedEvent | null> {
  const result = await supabase
    .from('feed_events')
    .select('id, user_id, event_type, payload, created_at')
    .eq('id', id)
    .maybeSingle()

  if (result.error || !result.data) return null

  const normalized = normalizeFeedEvent(result.data)
  if (!normalized) return null

  const [hydrated] = await hydrateFeedEvents(supabase, [normalized])
  return hydrated ?? null
}

export async function listFeedEvents(
  supabase: DBClient,
  scope: 'global' | 'following',
  viewerId: string | null,
  limit = 50,
): Promise<FeedEvent[]> {
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

  let query = supabase
    .from('feed_events')
    .select('id, user_id, event_type, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userIds) query = query.in('user_id', userIds)

  const eventsRes = await query
  if (eventsRes.error) return []

  const events = (eventsRes.data ?? [])
    .map(normalizeFeedEvent)
    .filter((event): event is FeedEvent => Boolean(event))

  return hydrateFeedEvents(supabase, events)
}
