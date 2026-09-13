import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import { getLevel, reconcileStreakOnLogin } from '@/lib/gamification'
import { getRankFromScore, type RankState } from '@/lib/ranks'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/database'
import { getUserProgressSnapshot } from './progress-store'

type DBClient = SupabaseClient<Database>
type QueryError = { code?: string; message?: string }
type QueryResult<T> = { data: T[] | null; error: QueryError | null }

function isMissingTableError(error: QueryError | null | undefined): boolean {
  return error?.code === '42P01' || String(error?.message ?? '').includes('does not exist')
}

function logSafeQueryError(scope: string, table: string, error: unknown) {
  const candidate = error as QueryError | null
  console.error(`[profile-store] ${scope} failed for ${table}:`, {
    code: candidate?.code ?? 'unknown',
    message: candidate?.message ?? String(error),
  })
}

export interface PublicLanguageStat {
  languageId: string
  totalSessions: number
  bestWPM: number
  bestAccuracy: number
}

export interface PublicProfile {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  createdAt: string
  totalXP: number
  level: number
  score: number
  rank: RankState
  currentStreak: number
  totalSessions: number
  rankedSessions: number
  bestWPM: number
  bestAccuracy: number
  topLanguages: PublicLanguageStat[]
  achievementIds: string[]
  followerCount: number
  followingCount: number
  isFollowedByMe: boolean
}

export async function getPublicProfile(
  _supabase: DBClient,
  username: string,
  viewerId?: string | null,
): Promise<PublicProfile | null> {
  const db = createAdminClient()
  const normalizedUsername = username.toLowerCase()
  const { data: profile, error: profileErr } = await db
    .from('profiles')
    .select('id,username,display_name,avatar_url,bio,created_at')
    .eq('username', normalizedUsername)
    .maybeSingle()

  if (profileErr) throw profileErr
  if (!profile) return null

  const userId = profile.id
  const [snapshot, achievementsRes, followersRes, followingRes, isFollowedRes] = await Promise.all([
    getUserProgressSnapshot(db, userId, { persistAggregates: false }),
    safeSelect<{ achievement_id: string }>('user_achievements', async () => {
      const result = await db.from('user_achievements').select('achievement_id').eq('user_id', userId)
      return { data: result.data, error: result.error }
    }),
    safeSelect<{ follower_id: string }>('follows', async () => {
      const result = await db.from('follows').select('follower_id').eq('following_id', userId)
      return { data: result.data, error: result.error }
    }),
    safeSelect<{ following_id: string }>('follows', async () => {
      const result = await db.from('follows').select('following_id').eq('follower_id', userId)
      return { data: result.data, error: result.error }
    }),
    viewerId
      ? safeSelect<{ follower_id: string }>('follows', async () => {
          const result = await db
            .from('follows')
            .select('follower_id')
            .eq('follower_id', viewerId)
            .eq('following_id', userId)
            .limit(1)
          return { data: result.data, error: result.error }
        })
      : Promise.resolve({ data: [], error: null }),
  ])

  const totalXP = snapshot.totalXP
  const level = getLevel(totalXP).level
  const score = snapshot.rankedScore
  const rankedSessions = snapshot.rankedSessions
  const totalSessions = snapshot.history.length
  const rank = getRankFromScore(score)
  const bestWPM = Object.values(snapshot.languages).reduce((best, entry) => Math.max(best, entry.bestWPM), 0)
  const bestAccuracy = Object.values(snapshot.languages).reduce((best, entry) => Math.max(best, entry.bestAccuracy), 0)
  const topLanguages = Object.entries(snapshot.languages)
    .map(([languageId, entry]) => ({
      languageId,
      totalSessions: entry.totalSessions,
      bestWPM: entry.bestWPM,
      bestAccuracy: entry.bestAccuracy,
    }))
    .sort((a, b) => b.totalSessions - a.totalSessions || b.bestWPM - a.bestWPM)
    .slice(0, 5)
  const currentStreak = reconcileStreakOnLogin(snapshot.streak).streak.current

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio ?? null,
    createdAt: profile.created_at,
    totalXP,
    level,
    score,
    rank,
    currentStreak,
    totalSessions,
    rankedSessions,
    bestWPM,
    bestAccuracy,
    topLanguages,
    achievementIds: (achievementsRes.data ?? []).map(r => r.achievement_id),
    followerCount: (followersRes.data ?? []).length,
    followingCount: (followingRes.data ?? []).length,
    isFollowedByMe: (isFollowedRes.data ?? []).length > 0,
  }
}

async function safeSelect<T>(
  table: string,
  execute: () => Promise<QueryResult<T>>,
): Promise<QueryResult<T>> {
  try {
    const res = await execute()
    if (res.error) {
      if (isMissingTableError(res.error)) {
        return { data: [], error: null }
      }
      logSafeQueryError('safeSelect', table, res.error)
      return { data: null, error: res.error }
    }
    return res
  } catch (error) {
    logSafeQueryError('safeSelect', table, error)
    return { data: [], error: null }
  }
}
