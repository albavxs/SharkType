import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthProfile, LeaderboardEntry } from '@/lib/auth-types'
import {
  applySessionToProgress,
  calculateRankedPoints,
  computeRankedAggregate,
  createDefaultProgress,
  deriveStreakFromActivityTimestamps,
  deriveProgressSummary,
  getLevel,
  isRankedEligibleLanguage,
  reconcileStreakOnLogin,
  type SessionInput,
  type SessionOutput,
  type SessionRecord,
  type StreakNotification,
  type UserProgress,
} from '@/lib/gamification'
import type { Database } from '@/lib/supabase/database'
import { ensureProfileForUser, getOwnProfile } from './auth-profile'
import { collectProgressUnlocks, reconcileHistoricalUnlocks } from './achievements'
import { recordFeedEvent } from './feed-store'

type DBClient = SupabaseClient<Database>
type TypingSessionRow = Database['public']['Tables']['typing_sessions']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export interface ProfileProgressPayload {
  profile: AuthProfile
  progress: UserProgress
  streakNotification: StreakNotification | null
}

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
    rawWpm: row.raw_wpm,
    accuracy: row.accuracy,
    errors: row.errors,
    duration: row.duration,
    difficulty: row.difficulty as SessionRecord['difficulty'],
    xpEarned: row.xp_earned,
    rankedEligible: row.ranked_eligible,
    rankedPoints: row.ranked_points,
  }
}

function buildInsertedSession(input: SessionInput, output: SessionOutput, createdAt: string) {
  return {
    language_id: input.languageId,
    snippet_id: input.snippetId,
    wpm: input.wpm,
    raw_wpm: input.rawWpm,
    accuracy: input.accuracy,
    errors: input.errors,
    duration: input.duration,
    difficulty: input.difficulty,
    xp_earned: output.xpEarned,
    ranked_points: output.rankedPointsEarned,
    ranked_eligible: output.rankedEligible,
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
    last_activity_at: progress.streak.lastActivityAt || null,
    last_streak_at: progress.streak.lastStreakAt || null,
    best_wpm: summary.bestWPM,
    best_accuracy: summary.bestAccuracy,
    total_sessions: summary.totalSessions,
    ranked_score: progress.rankedScore,
    ranked_sessions: progress.rankedSessions,
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
  return history.map((record, index) => {
    const difficulty = record.difficulty ?? 'easy'

    return {
      user_id: userId,
      language_id: record.languageId,
      snippet_id: record.snippetId,
      wpm: record.wpm,
      raw_wpm: record.rawWpm ?? record.wpm,
      accuracy: record.accuracy,
      errors: record.errors,
      duration: record.duration,
      difficulty,
      xp_earned: record.xpEarned,
      ranked_eligible: record.rankedEligible ?? isRankedEligibleLanguage(record.languageId),
      ranked_points: record.rankedPoints ?? calculateRankedPoints({
        languageId: record.languageId,
        wpm: record.wpm,
        rawWpm: record.rawWpm ?? record.wpm,
        errors: record.errors,
        difficulty,
      }),
      created_at: `${record.date}T12:${String(index % 60).padStart(2, '0')}:00.000Z`,
    }
  })
}

function buildProgressFromSessionRows(
  rows: TypingSessionRow[],
  completedTrackIds: string[]
): UserProgress {
  const progress = createDefaultProgress()
  progress.completedTrackIds = completedTrackIds
  progress.history = rows.map(mapSessionRow)
  progress.streak = deriveStreakFromActivityTimestamps(rows.map((row) => row.created_at))

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

  const rankedAggregate = computeRankedAggregate(progress.history)
  progress.rankedScore = rankedAggregate.rankedScore
  progress.rankedSessions = rankedAggregate.rankedSessions
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

async function persistProgressAggregate(supabase: DBClient, userId: string, progress: UserProgress) {
  const aggregate = buildProgressAggregate(userId, progress)
  const progressUpsert = await supabase.from('user_progress').upsert(aggregate, { onConflict: 'user_id' })
  if (progressUpsert.error && !isMissingTable(progressUpsert.error)) throw progressUpsert.error
}

async function reconcileSnapshotStreak(
  supabase: DBClient,
  userId: string,
  progress: UserProgress
): Promise<{ progress: UserProgress; streakNotification: StreakNotification | null }> {
  const { streak, notification } = reconcileStreakOnLogin(progress.streak)

  if (
    streak.current === progress.streak.current &&
    streak.lastActivityAt === progress.streak.lastActivityAt &&
    streak.lastStreakAt === progress.streak.lastStreakAt &&
    streak.lastPracticeDate === progress.streak.lastPracticeDate
  ) {
    return { progress, streakNotification: notification }
  }

  const nextProgress: UserProgress = {
    ...progress,
    streak,
  }

  await persistProgressAggregate(supabase, userId, nextProgress)
  return { progress: nextProgress, streakNotification: notification }
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

function isMissingTable(error: unknown): boolean {
  const candidate = error as { code?: string; message?: string } | null
  return candidate?.code === '42P01' || String(candidate?.message ?? '').includes('does not exist')
}

function isMissingColumn(error: unknown, columnName: string): boolean {
  const candidate = error as { code?: string; message?: string } | null
  return candidate?.code === 'PGRST204' && String(candidate?.message ?? '').includes(`'${columnName}'`)
}

async function insertTypingSessionCompat(
  supabase: DBClient,
  row: Database['public']['Tables']['typing_sessions']['Insert']
) {
  const attempt = await supabase.from('typing_sessions').insert(row)
  if (!attempt.error || !isMissingColumn(attempt.error, 'raw_wpm')) {
    return attempt
  }

  const legacyRow: Record<string, unknown> = { ...row }
  delete legacyRow.raw_wpm
  return supabase.from('typing_sessions').insert(legacyRow as Database['public']['Tables']['typing_sessions']['Insert'])
}

async function insertTypingSessionsCompat(
  supabase: DBClient,
  rows: Database['public']['Tables']['typing_sessions']['Insert'][]
) {
  const attempt = await supabase.from('typing_sessions').insert(rows)
  if (!attempt.error || !isMissingColumn(attempt.error, 'raw_wpm')) {
    return attempt
  }

  const legacyRows = rows.map((row) => {
    const legacyRow: Record<string, unknown> = { ...row }
    delete legacyRow.raw_wpm
    return legacyRow as Database['public']['Tables']['typing_sessions']['Insert']
  })
  return supabase.from('typing_sessions').insert(legacyRows)
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
      await reconcileHistoricalUnlocks(supabase, userId, progress)
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
      lastActivityAt: progressResult.data.last_activity_at ?? '',
      lastStreakAt: progressResult.data.last_streak_at ?? '',
    }
    progress.rankedScore = progressResult.data.ranked_score ?? 0
    progress.rankedSessions = progressResult.data.ranked_sessions ?? 0
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

  const sessionRows = sessionsResult.data ?? []
  progress.history = sessionRows.map(mapSessionRow)
  if (sessionRows.length > 0 || !progressResult.data) {
    progress.totalXP = progress.history.reduce((sum, session) => sum + session.xpEarned, 0)
    const rankedAggregate = computeRankedAggregate(progress.history)
    progress.rankedScore = rankedAggregate.rankedScore
    progress.rankedSessions = rankedAggregate.rankedSessions
  }

  if (!progressResult.data || !progress.streak.lastActivityAt) {
    progress.streak = deriveStreakFromActivityTimestamps(sessionRows.map((row) => row.created_at))
  }

  progress.level = getLevel(progress.totalXP).level

  return progress
}

export async function getProfileAndProgress(supabase: DBClient, user: { id: string }): Promise<ProfileProgressPayload> {
  await ensureUserSocialBackfill(supabase, user.id)
  const profile = await getOwnProfile(supabase, user.id)
  if (!profile) {
    throw new Error('Profile not found for authenticated user.')
  }

  const snapshot = await getUserProgressSnapshot(supabase, user.id)
  await reconcileHistoricalUnlocks(supabase, user.id, snapshot)
  const { progress, streakNotification } = await reconcileSnapshotStreak(supabase, user.id, snapshot)
  return { profile, progress, streakNotification }
}

export async function bootstrapProfileAndProgress(
  supabase: DBClient,
  user: Parameters<typeof ensureProfileForUser>[1]
): Promise<ProfileProgressPayload> {
  const profile = await ensureProfileForUser(supabase, user)
  await ensureUserSocialBackfill(supabase, user.id)
  const snapshot = await getUserProgressSnapshot(supabase, user.id)
  await reconcileHistoricalUnlocks(supabase, user.id, snapshot)
  const { progress, streakNotification } = await reconcileSnapshotStreak(supabase, user.id, snapshot)
  return { profile, progress, streakNotification }
}

export async function importLocalProgress(
  supabase: DBClient,
  user: Parameters<typeof ensureProfileForUser>[1],
  progress: UserProgress
) {
  const profile = await ensureProfileForUser(supabase, user)
  if (profile.localImportedAt) {
    const snapshot = await getUserProgressSnapshot(supabase, user.id)
    await reconcileHistoricalUnlocks(supabase, user.id, snapshot)
    const { progress: reconciledProgress, streakNotification } = await reconcileSnapshotStreak(supabase, user.id, snapshot)
    return {
      profile,
      progress: reconciledProgress,
      streakNotification,
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

  const snapshot = await getUserProgressSnapshot(supabase, user.id)
  await reconcileHistoricalUnlocks(supabase, user.id, snapshot)
  const { progress: reconciledProgress, streakNotification } = await reconcileSnapshotStreak(supabase, user.id, snapshot)

  return {
    profile: mapProfileRow(data),
    progress: reconciledProgress,
    streakNotification,
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
      const sessionInsert = await insertTypingSessionsCompat(supabase, sessionRows)
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
    insertTypingSessionCompat(supabase, {
      user_id: userId,
      ...buildInsertedSession(input, output, now),
    }),
  ])

  if (progressUpsert.error && !isMissingTable(progressUpsert.error)) throw progressUpsert.error
  if (languageUpsert.error && !isMissingTable(languageUpsert.error)) throw languageUpsert.error
  if (sessionInsert.error && !isMissingTable(sessionInsert.error)) throw sessionInsert.error

  // Hooks: achievements + feed events. Falhas aqui nao quebram a sessao.
  try {
    const newlyUnlocked = await collectProgressUnlocks(supabase, userId, current, progress)
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
  // Tenta usar a view ranked. Se nao existir, cai no fallback legado.
  const withScore = await supabase
    .from('leaderboard_with_score')
    .select('*')
    .order('score', { ascending: false })
    .order('best_wpm', { ascending: false })
    .order('current_streak', { ascending: false })
    .order('total_sessions', { ascending: false })
    .limit(1000)

  if (!withScore.error && withScore.data) {
    return withScore.data
      .filter(entry => (entry.score ?? 0) > 0 || (entry.ranked_sessions ?? 0) > 0)
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
        rankedSessions: entry.ranked_sessions ?? 0,
        level: entry.level ?? getLevel(entry.total_xp).level,
        score: entry.score ?? 0,
      }))
  }

  // Fallback: view antiga
  const { data, error } = await supabase
    .from('global_leaderboard')
    .select('*')
    .order('ranked_score', { ascending: false })
    .order('best_wpm', { ascending: false })
    .order('current_streak', { ascending: false })
    .order('total_sessions', { ascending: false })
    .limit(1000)

  if (error) throw error

  return (data ?? [])
    .filter(entry => (entry.ranked_score ?? 0) > 0 || (entry.ranked_sessions ?? 0) > 0)
    .map((entry, index) => {
      const level = getLevel(entry.total_xp).level
      return {
        rank: index + 1,
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        totalXP: entry.total_xp,
        bestWPM: entry.best_wpm,
        avgWPM: entry.best_wpm,
        currentStreak: entry.current_streak,
        totalSessions: entry.total_sessions,
        rankedSessions: entry.ranked_sessions ?? 0,
        level,
        score: entry.ranked_score ?? 0,
      }
    })
}