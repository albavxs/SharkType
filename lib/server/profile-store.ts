import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database'
import { computeAverageWPM, computeScore, getLevel } from '@/lib/gamification'
import { getRankFromScore, type RankState } from '@/lib/ranks'
import { ensureUserSocialBackfill } from './progress-store'

type DBClient = SupabaseClient<any>

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
  await ensureUserSocialBackfill(supabase, userId)

  const [progressRes, languagesRes, achievementsRes, followersRes, followingRes, isFollowedRes, recentSessionsRes] = await Promise.all([
    supabase
      .from('user_progress')
      .select('total_xp, current_streak, total_sessions, best_wpm, best_accuracy')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('user_language_progress')
      .select('language_id, total_sessions, best_wpm, best_accuracy')
      .eq('user_id', userId)
      .order('total_sessions', { ascending: false })
      .limit(5),
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
    supabase
      .from('typing_sessions')
      .select('wpm')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (progressRes.error) throw progressRes.error
  if (languagesRes.error) throw languagesRes.error
  if (recentSessionsRes.error) throw recentSessionsRes.error

  const totalXP = progressRes.data?.total_xp ?? 0
  const level = getLevel(totalXP).level
  const avgWPM = computeAverageWPM((recentSessionsRes.data ?? []).map((row) => row.wpm))
  const score = computeScore(avgWPM, level)
  const rank = getRankFromScore(score, progressRes.data?.total_sessions ?? 0)

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
    currentStreak: progressRes.data?.current_streak ?? 0,
    totalSessions: progressRes.data?.total_sessions ?? 0,
    bestWPM: progressRes.data?.best_wpm ?? 0,
    bestAccuracy: progressRes.data?.best_accuracy ?? 0,
    topLanguages: (languagesRes.data ?? []).map(row => ({
      languageId: row.language_id,
      totalSessions: row.total_sessions,
      bestWPM: row.best_wpm,
      bestAccuracy: row.best_accuracy,
    })),
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
      if (res.error.code === '42P01' || String(res.error.message ?? '').includes('does not exist')) {
        return { data: [], error: null }
      }
      return { data: null, error: res.error }
    }
    return { data: res.data as T[], error: null }
  } catch (e) {
    return { data: [], error: null }
  }
}
