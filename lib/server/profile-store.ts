import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database'
import { getLevel, reconcileStreakOnLogin } from '@/lib/gamification'
import { getRankFromScore, type RankState } from '@/lib/ranks'
import { ensureUserSocialBackfill, getUserProgressSnapshot } from './progress-store'

type DBClient = SupabaseClient<any>

function isMissingTableError(error: { code?: string; message?: string } | null | undefined): boolean {
  return error?.code === '42P01' || String(error?.message ?? '').includes('does not exist')
}

function logSafeQueryError(scope: string, table: string, error: unknown) {
  const candidate = error as { code?: string; message?: string } | null
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

/**
 * Busca perfil publico por username (case-insensitive).
 * Retorna null se nao existir.
 * `viewerId` opcional — se passado, popula `isFollowedByMe`.
 */
export async function getPublicProfile(
  supabase: DBClient,
  username: string,
  viewerId?: string | null,
): Promise<PublicProfile | null> {
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .maybeSingle()

  if (profileErr) throw profileErr
  if (!profile) return null

  const userId = profile.id
  ensureUserSocialBackfill(supabase, userId).catch((err) => {
    console.error('[getPublicProfile] social backfill failed (non-fatal):', err)
  })

  const [snapshot, achievementsRes, followersRes, followingRes, isFollowedRes] = await Promise.all([
    getUserProgressSnapshot(supabase as unknown as SupabaseClient<Database>, userId),
    safeSelect<{ achievement_id: string }>(supabase, 'user_achievements', q =>
      q.select('achievement_id').eq('user_id', userId),
    ),
    safeSelect<{ follower_id: string }>(supabase, 'follows', q =>
      q.select('follower_id').eq('following_id', userId),
    ),
    safeSelect<{ following_id: string }>(supabase, 'follows', q =>
      q.select('following_id').eq('follower_id', userId),
    ),
    viewerId
      ? safeSelect<{ follower_id: string }>(supabase, 'follows', q =>
          q
            .select('follower_id')
            .eq('follower_id', viewerId)
            .eq('following_id', userId)
            .limit(1),
        )
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

/**
 * Wrapper de select que devolve { data: [], error: null } se a tabela nao existir
 * (ex: migrations 004/005 ainda nao aplicadas). Evita 500 em ambientes parciais.
 */
async function safeSelect<T>(
  supabase: DBClient,
  table: string,
  build: (q: any) => any,
): Promise<{ data: T[] | null; error: any }> {
  try {
    const res = await build(supabase.from(table))
    if (res.error) {
      // 42P01 = undefined_table no Postgres
      if (isMissingTableError(res.error)) {
        return { data: [], error: null }
      }
      logSafeQueryError('safeSelect', table, res.error)
      return { data: null, error: res.error }
    }
    return { data: res.data as T[], error: null }
  } catch (error) {
    logSafeQueryError('safeSelect', table, error)
    return { data: [], error: null }
  }
}
