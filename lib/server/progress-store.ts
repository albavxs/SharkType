import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthProfile, LeaderboardEntry } from '@/lib/auth-types'
import {
  applySessionToProgress,
  computeAverageWPM,
  computeScore,
  createDefaultProgress,
  deriveProgressSummary,
  getLevel,
  type SessionInput,
  type SessionOutput,
  type SessionRecord,
  type UserProgress,
} from '@/lib/gamification'
import type { Database } from '@/lib/supabase/database'
import { ensureProfileForUser, getOwnProfile } from './auth-profile'
import { checkUnlocks } from './achievements'
import { recordFeedEvent } from './feed-store'

type DBClient = SupabaseClient<any>
type TypingSessionRow = Database['public']['Tables']['typing_sessions']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

function mapProfileRow(row: Database['public']['Tables']['profiles']['Row']): AuthProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    provider: row.provider,
    emailVerified: row.email_verified,
    localImportedAt: row.local_imported_at,
    onboardingCompleted: row.onboarding_completed,
  }
}

function mapSessionRow(row: Database['public']['Tables']['typing_sessions']['Row']): SessionRecord {
  return {
    date: row.created_at.slice(0, 10),
    languageId: row.language_id,
    snippetId: row.snippet_id,
    wpm: row.wpm,
    accuracy: row.accuracy,
    errors: row.errors,
    duration: row.duration,
    xpEarned: row.xp_earned,
  }
}

function buildInsertedSession(input: SessionInput, output: SessionOutput, createdAt: string) {
  return {
    language_id: input.languageId,
    snippet_id: input.snippetId,
    wpm: input.wpm,
    accuracy: input.accuracy,
    errors: input.errors,
    duration: input.duration,
    difficulty: input.difficulty,
    xp_earned: output.xpEarned,
    created_at: createdAt,
  }
}

export function buildProgressAggregate(userId: string, progress: UserProgress) {
  const summary = deriveProgressSummary(progress)

  return {
    user_id: userId,
    total_xp: progress.totalXP,
    current_streak: progress.streak.current,
    last_practice_date: progress.streak.lastPracticeDate || null,
    best_wpm: summary.bestWPM,
    best_accuracy: summary.bestAccuracy,
    total_sessions: progress.history.length,
    completed_track_ids: progress.completedTrackIds || [],
  }
}

function buildLanguageRows(userId: string, progress: UserProgress) {
  return Object.entries(progress.languages).map(([languageId, entry]) => ({
    user_id: userId,
    language_id: languageId,
    completed_snippet_ids: entry.completedSnippetIds,
    best_wpm: entry.bestWPM,
    best_accuracy: entry.bestAccuracy,
    total_sessions: entry.totalSessions,
  }))
}

function buildImportedSessionRows(userId: string, history: SessionRecord[]) {
  return history.map((record, index) => ({
    user_id: userId,
    language_id: record.languageId,
    snippet_id: record.snippetId,
    wpm: record.wpm,
    accuracy: record.accuracy,
    errors: record.errors,
    duration: record.duration,
    difficulty: 'easy',
    xp_earned: record.xpEarned,
    created_at: `${record.date}T12:${String(index % 60).padStart(2, '0')}:00.000Z`,
  }))
}

function shiftISODate(date: string, offsetDays: number) {
  const target = new Date(`${date}T00:00:00.000Z`)
  target.setUTCDate(target.getUTCDate() + offsetDays)
  return target.toISOString().slice(0, 10)
}

function deriveStreakFromSessionRows(rows: TypingSessionRow[]): UserProgress['streak'] {
  if (rows.length === 0) {
    return { current: 0, lastPracticeDate: '' }
  }

  const uniqueDates = Array.from(new Set(rows.map((row) => row.created_at.slice(0, 10))))
  const lastPracticeDate = uniqueDates[0] ?? ''
  if (!lastPracticeDate) {
    return { current: 0, lastPracticeDate: '' }
  }

  let current = 0
  let expectedDate = lastPracticeDate

  for (const date of uniqueDates) {
    if (date !== expectedDate) break
    current += 1
    expectedDate = shiftISODate(expectedDate, -1)
  }

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = shiftISODate(today, -1)
  const isActive = lastPracticeDate === today || lastPracticeDate === yesterday

  return {
    current: isActive ? current : 0,
    lastPracticeDate,
  }
}

function buildProgressFromSessionRows(
  rows: TypingSessionRow[],
  completedTrackIds: string[]
): UserProgress {
  const progress = createDefaultProgress()
  progress.completedTrackIds = completedTrackIds
  progress.history = rows.map(mapSessionRow)
  progress.streak = deriveStreakFromSessionRows(rows)

  for (const row of rows) {
    progress.totalXP += row.xp_earned

    const current = progress.languages[row.language_id] ?? {
      completedSnippetIds: [],
      bestWPM: 0,
      bestAccuracy: 0,
      totalSessions: 0,
    }

    if (!current.completedSnippetIds.includes(row.snippet_id)) {
      current.completedSnippetIds.push(row.snippet_id)
    }

    current.bestWPM = Math.max(current.bestWPM, row.wpm)
    current.bestAccuracy = Math.max(current.bestAccuracy, row.accuracy)
    current.totalSessions += 1

    progress.languages[row.language_id] = current
  }

  progress.level = getLevel(progress.totalXP).level
  return progress
}

async function syncProgressAggregates(supabase: DBClient, userId: string, progress: UserProgress) {
  const aggregate = buildProgressAggregate(userId, progress)
  const languageRows = buildLanguageRows(userId, progress)

  const progressUpsert = await supabase.from('user_progress').upsert(aggregate, { onConflict: 'user_id' })
  if (progressUpsert.error) throw progressUpsert.error

  const deleteLanguages = await supabase.from('user_language_progress').delete().eq('user_id', userId)
  if (deleteLanguages.error) throw deleteLanguages.error

  if (languageRows.length > 0) {
    const languageInsert = await supabase.from('user_language_progress').insert(languageRows)
    if (languageInsert.error) throw languageInsert.error
  }
}

async function markProfileSocialState(
  supabase: DBClient,
  userId: string,
  payload: Partial<Pick<ProfileRow, 'stats_reconciled_at' | 'social_seeded_at'>>
) {
  const update = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)

  if (update.error) throw update.error
}

async function seedHistoricalFeedFromSessions(
  supabase: DBClient,
  userId: string,
  sessions: TypingSessionRow[],
  shouldSeed: boolean
) {
  if (!shouldSeed) {
    return
  }

  for (const session of sessions.slice(0, 12)) {
    await recordFeedEvent(
      supabase,
      userId,
      'session',
      {
        languageId: session.language_id,
        wpm: session.wpm,
        accuracy: session.accuracy,
        xpEarned: session.xp_earned,
      },
      { createdAt: session.created_at }
    )
  }
}

function isMissingTable(error: any): boolean {
  return error?.code === '42P01' || String(error?.message ?? '').includes('does not exist')
}

export async function ensureUserSocialBackfill(supabase: DBClient, userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) {
    if (isMissingTable(profileError)) return
    throw profileError
  }
  if (!profile) return

  const needsStats = !profile.stats_reconciled_at
  const needsSocial = !profile.social_seeded_at

  if (!needsStats && !needsSocial) return

  const [progressRowRes, sessionsRes] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('typing_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ])

  if (progressRowRes.error) throw progressRowRes.error
  if (sessionsRes.error) throw sessionsRes.error

  const completedTrackIds = Array.isArray(progressRowRes.data?.completed_track_ids)
    ? progressRowRes.data.completed_track_ids
    : []
  const sessions = sessionsRes.data ?? []
  const progress = buildProgressFromSessionRows(sessions, completedTrackIds)
  const now = new Date().toISOString()
  const existingFeed = needsSocial
    ? await supabase.from('feed_events').select('id').eq('user_id', userId).limit(1)
    : null

  try {
    if (needsStats) {
      await syncProgressAggregates(supabase, userId, progress)
    }

    if (needsSocial) {
      const shouldSeedHistoricalSessions = !existingFeed?.error && (existingFeed?.data ?? []).length === 0
      await checkUnlocks(supabase, userId, progress)
      await seedHistoricalFeedFromSessions(supabase, userId, sessions, shouldSeedHistoricalSessions)
    }

    await markProfileSocialState(supabase, userId, {
      stats_reconciled_at: needsStats ? now : profile.stats_reconciled_at,
      social_seeded_at: needsSocial ? now : profile.social_seeded_at,
    })
  } catch (err) {
    if (isMissingTable(err)) return
    throw err
  }
}

export async function getUserProgressSnapshot(supabase: DBClient, userId: string): Promise<UserProgress> {
  const progress = createDefaultProgress()

  const [progressResult, languagesResult, sessionsResult] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_language_progress').select('*').eq('user_id', userId),
    supabase.from('typing_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ])

  if (progressResult.error && !isMissingTable(progressResult.error)) throw progressResult.error
  if (languagesResult.error && !isMissingTable(languagesResult.error)) throw languagesResult.error
  if (sessionsResult.error && !isMissingTable(sessionsResult.error)) throw sessionsResult.error

  if (progressResult.data) {
    progress.totalXP = progressResult.data.total_xp
    progress.streak = {
      current: progressResult.data.current_streak,
      lastPracticeDate: progressResult.data.last_practice_date ?? '',
    }
    progress.completedTrackIds = Array.isArray(progressResult.data.completed_track_ids)
      ? progressResult.data.completed_track_ids
      : []
  }

  for (const row of languagesResult.data ?? []) {
    progress.languages[row.language_id] = {
      completedSnippetIds: Array.isArray(row.completed_snippet_ids)
        ? row.completed_snippet_ids.filter((value: unknown): value is string => typeof value === 'string')
        : [],
      bestWPM: row.best_wpm,
      bestAccuracy: row.best_accuracy,
      totalSessions: row.total_sessions,
    }
  }

  progress.history = (sessionsResult.data ?? []).map(mapSessionRow)
  progress.level = getLevel(progress.totalXP).level

  return progress
}

export async function getProfileAndProgress(supabase: DBClient, user: { id: string }) {
  ensureUserSocialBackfill(supabase, user.id).catch((err) => {
    console.error('[getProfileAndProgress] social backfill failed (non-fatal):', err)
  })
  const profile = await getOwnProfile(supabase, user.id)
  if (!profile) {
    throw new Error('Profile not found for authenticated user.')
  }

  const progress = await getUserProgressSnapshot(supabase, user.id)
  return { profile, progress }
}

export async function bootstrapProfileAndProgress(
  supabase: DBClient,
  user: Parameters<typeof ensureProfileForUser>[1]
) {
  const profile = await ensureProfileForUser(supabase, user)
  ensureUserSocialBackfill(supabase, user.id).catch((err) => {
    console.error('[bootstrapProfileAndProgress] social backfill failed (non-fatal):', err)
  })
  const progress = await getUserProgressSnapshot(supabase, user.id)
  return { profile, progress }
}

export async function importLocalProgress(
  supabase: DBClient,
  user: Parameters<typeof ensureProfileForUser>[1],
  progress: UserProgress
) {
  const profile = await ensureProfileForUser(supabase, user)
  if (profile.localImportedAt) {
    return {
      profile,
      progress: await getUserProgressSnapshot(supabase, user.id),
    }
  }

  await replaceRemoteProgress(supabase, user.id, progress)
  await markProfileSocialState(supabase, user.id, {
    stats_reconciled_at: null,
    social_seeded_at: null,
  })

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('profiles')
    .update({ local_imported_at: now, email_verified: Boolean(user.email_confirmed_at) })
    .eq('id', user.id)
    .select('*')
    .single()

  if (error) throw error

  ensureUserSocialBackfill(supabase, user.id).catch((err) => {
    console.error('[importLocalProgress] social backfill failed (non-fatal):', err)
  })

  return {
    profile: mapProfileRow(data),
    progress: await getUserProgressSnapshot(supabase, user.id),
  }
}

export async function replaceRemoteProgress(supabase: DBClient, userId: string, progress: UserProgress) {
  const aggregate = buildProgressAggregate(userId, progress)
  const languageRows = buildLanguageRows(userId, progress)
  const sessionRows = buildImportedSessionRows(userId, progress.history)

  try {
    const deleteLanguages = await supabase.from('user_language_progress').delete().eq('user_id', userId)
    if (deleteLanguages.error && !isMissingTable(deleteLanguages.error)) throw deleteLanguages.error

    const deleteSessions = await supabase.from('typing_sessions').delete().eq('user_id', userId)
    if (deleteSessions.error && !isMissingTable(deleteSessions.error)) throw deleteSessions.error

    const progressUpsert = await supabase.from('user_progress').upsert(aggregate, { onConflict: 'user_id' })
    if (progressUpsert.error && !isMissingTable(progressUpsert.error)) throw progressUpsert.error

    if (languageRows.length > 0) {
      const languageInsert = await supabase.from('user_language_progress').insert(languageRows)
      if (languageInsert.error && !isMissingTable(languageInsert.error)) throw languageInsert.error
    }

    if (sessionRows.length > 0) {
      const sessionInsert = await supabase.from('typing_sessions').insert(sessionRows)
      if (sessionInsert.error && !isMissingTable(sessionInsert.error)) throw sessionInsert.error
    }
  } catch (err) {
    if (isMissingTable(err)) return
    throw err
  }
}

export async function saveRemoteSession(
  supabase: DBClient,
  userId: string,
  input: SessionInput
): Promise<{ progress: UserProgress; output: SessionOutput }> {
  ensureUserSocialBackfill(supabase, userId).catch((err) => {
    console.error('[saveRemoteSession] social backfill failed (non-fatal):', err)
  })
  const current = await getUserProgressSnapshot(supabase, userId)
  const { progress, output } = applySessionToProgress(current, input)

  const currentLanguage = progress.languages[input.languageId]
  const aggregate = buildProgressAggregate(userId, progress)
  const now = new Date().toISOString()

  const [progressUpsert, languageUpsert, sessionInsert] = await Promise.all([
    supabase.from('user_progress').upsert(aggregate, { onConflict: 'user_id' }),
    supabase.from('user_language_progress').upsert(
      {
        user_id: userId,
        language_id: input.languageId,
        completed_snippet_ids: currentLanguage.completedSnippetIds,
        best_wpm: currentLanguage.bestWPM,
        best_accuracy: currentLanguage.bestAccuracy,
        total_sessions: currentLanguage.totalSessions,
      },
      { onConflict: 'user_id,language_id' }
    ),
    supabase.from('typing_sessions').insert({
      user_id: userId,
      ...buildInsertedSession(input, output, now),
    }),
  ])

  if (progressUpsert.error && !isMissingTable(progressUpsert.error)) throw progressUpsert.error
  if (languageUpsert.error && !isMissingTable(languageUpsert.error)) throw languageUpsert.error
  if (sessionInsert.error && !isMissingTable(sessionInsert.error)) throw sessionInsert.error

  // Hooks: achievements + feed events. Falhas aqui nao quebram a sessao.
  try {
    const newlyUnlocked = await checkUnlocks(supabase, userId, progress)
    output.newlyUnlocked = newlyUnlocked

    // Registra eventos no feed (best-effort)
    await recordFeedEvent(supabase, userId, 'session', {
      languageId: input.languageId,
      wpm: input.wpm,
      accuracy: input.accuracy,
      xpEarned: output.xpEarned,
    })
    if (output.leveledUp) {
      await recordFeedEvent(supabase, userId, 'level_up', { level: output.newLevel })
    }
  } catch {
    // Achievements/feed sao secundarios — ignora falha silenciosamente
  }

  return { progress, output }
}

export async function resetRemoteProgress(supabase: DBClient, userId: string) {
  try {
    const deleteLanguages = await supabase.from('user_language_progress').delete().eq('user_id', userId)
    if (deleteLanguages.error && !isMissingTable(deleteLanguages.error)) throw deleteLanguages.error

    const deleteSessions = await supabase.from('typing_sessions').delete().eq('user_id', userId)
    if (deleteSessions.error && !isMissingTable(deleteSessions.error)) throw deleteSessions.error

    const deleteProgress = await supabase.from('user_progress').delete().eq('user_id', userId)
    if (deleteProgress.error && !isMissingTable(deleteProgress.error)) throw deleteProgress.error
  } catch (err) {
    if (isMissingTable(err)) return
    throw err
  }
}

export async function listLeaderboard(supabase: DBClient): Promise<LeaderboardEntry[]> {
  // Tenta usar a view nova com score combinado. Se nao existir (migration 003 ausente),
  // cai pra global_leaderboard ordenado por total_xp.
  const withScore = await supabase
    .from('leaderboard_with_score')
    .select('*')
    .order('score', { ascending: false })
    .order('total_xp', { ascending: false })
    .order('current_streak', { ascending: false })
    .limit(1000)

  if (!withScore.error && withScore.data) {
    return (withScore.data as any[])
      .filter(entry => entry.total_sessions > 0 || entry.total_xp > 0)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        totalXP: entry.total_xp,
        bestWPM: entry.best_wpm,
        avgWPM: entry.avg_wpm ?? 0,
        currentStreak: entry.current_streak,
        totalSessions: entry.total_sessions,
        level: entry.level ?? getLevel(entry.total_xp).level,
        score: entry.score ?? 0,
      }))
  }

  // Fallback: view antiga
  const { data, error } = await supabase
    .from('global_leaderboard')
    .select('*')
    .order('total_xp', { ascending: false })
    .order('best_wpm', { ascending: false })
    .order('current_streak', { ascending: false })
    .limit(1000)

  if (error) throw error

  return (data ?? [])
    .filter(entry => entry.total_sessions > 0 || entry.total_xp > 0)
    .map((entry, index) => {
      const level = getLevel(entry.total_xp).level
      const avgWPM = computeAverageWPM([entry.best_wpm], 1)
      return {
        rank: index + 1,
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        totalXP: entry.total_xp,
        bestWPM: entry.best_wpm,
        avgWPM,
        currentStreak: entry.current_streak,
        totalSessions: entry.total_sessions,
        level,
        score: computeScore(avgWPM, level),
      }
    })
}