import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProgress } from '@/lib/gamification'
import type { Database } from '@/lib/supabase/database'
import { recordFeedEvent } from './feed-store'

type DBClient = SupabaseClient<Database>

export interface AchievementRow {
  id: string
  category: 'sessions' | 'streak' | 'xp' | 'language' | 'ranking' | 'track'
  threshold: number | null
  icon: string
  name: { pt: string; en: string }
  description: { pt: string; en: string }
}

interface CatalogRow {
  id: string
  category: AchievementRow['category']
  threshold: number | null
  icon: string
  name_pt: string
  name_en: string
  description_pt: string
  description_en: string
}

interface UnlockContext {
  totalSessions: number
  streak: number
  totalXP: number
  completedLanguagesCount: number
  leaderboardRank: number | null
  completedTrackIds: string[]
}

function mapAchievementRow(row: CatalogRow): AchievementRow {
  return {
    id: row.id,
    category: row.category,
    threshold: row.threshold,
    icon: row.icon,
    name: { pt: row.name_pt, en: row.name_en },
    description: { pt: row.description_pt, en: row.description_en },
  }
}

async function loadCatalog(supabase: DBClient): Promise<CatalogRow[]> {
  const catalogRes = await supabase.from('achievements').select('*')
  if (catalogRes.error) {
    if (isMissingTable(catalogRes.error)) return []
    return []
  }

  return (catalogRes.data ?? []) as CatalogRow[]
}

async function loadAlreadyUnlockedIds(supabase: DBClient, userId: string): Promise<Set<string>> {
  const alreadyRes = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)

  if (alreadyRes.error && !isMissingTable(alreadyRes.error)) {
    return new Set()
  }

  return new Set<string>((alreadyRes.data ?? []).map((row) => row.achievement_id))
}

function buildUnlockContext(progress: UserProgress, leaderboardRank: number | null = null): UnlockContext {
  return {
    totalSessions: progress.history.length,
    streak: progress.streak.current,
    totalXP: progress.totalXP,
    completedLanguagesCount: Object.values(progress.languages).filter((entry) => entry.completedSnippetIds.length > 0).length,
    leaderboardRank,
    completedTrackIds: progress.completedTrackIds || [],
  }
}

function getEligibleAchievementIds(
  catalog: CatalogRow[],
  progress: UserProgress,
  leaderboardRank: number | null = null
): Set<string> {
  const ctx = buildUnlockContext(progress, leaderboardRank)
  const matched = new Set<string>()

  for (const item of catalog) {
    if (matchesUnlock(item.category, item.threshold ?? 0, ctx)) {
      matched.add(item.id)
    }
  }

  return matched
}

async function persistUnlocks(
  supabase: DBClient,
  userId: string,
  achievements: CatalogRow[],
  recordFeed: boolean
): Promise<AchievementRow[]> {
  if (achievements.length === 0) return []

  const rows = achievements.map((achievement) => ({
    user_id: userId,
    achievement_id: achievement.id,
  }))

  await supabase
    .from('user_achievements')
    .upsert(rows, { onConflict: 'user_id,achievement_id', ignoreDuplicates: true })

  if (recordFeed) {
    await Promise.all(
      achievements.map((achievement) =>
        recordFeedEvent(supabase, userId, 'achievement', {
          achievementId: achievement.id,
          name: {
            pt: achievement.name_pt,
            en: achievement.name_en,
          },
        })
      )
    )
  }

  return achievements.map(mapAchievementRow)
}

export async function reconcileHistoricalUnlocks(
  supabase: DBClient,
  userId: string,
  progress: UserProgress,
  leaderboardRank: number | null = null,
): Promise<void> {
  const [catalog, alreadyIds] = await Promise.all([
    loadCatalog(supabase),
    loadAlreadyUnlockedIds(supabase, userId),
  ])

  if (catalog.length === 0) return

  const eligibleIds = getEligibleAchievementIds(catalog, progress, leaderboardRank)
  const missingUnlocks = catalog.filter((item) => eligibleIds.has(item.id) && !alreadyIds.has(item.id))

  await persistUnlocks(supabase, userId, missingUnlocks, false)
}

export async function collectProgressUnlocks(
  supabase: DBClient,
  userId: string,
  before: UserProgress,
  after: UserProgress,
  leaderboardRank: number | null = null,
): Promise<AchievementRow[]> {
  const [catalog, alreadyIds] = await Promise.all([
    loadCatalog(supabase),
    loadAlreadyUnlockedIds(supabase, userId),
  ])

  if (catalog.length === 0) return []

  const beforeEligibleIds = getEligibleAchievementIds(catalog, before, leaderboardRank)
  const afterEligibleIds = getEligibleAchievementIds(catalog, after, leaderboardRank)
  const crossedUnlocks = catalog.filter(
    (item) =>
      afterEligibleIds.has(item.id) &&
      !beforeEligibleIds.has(item.id) &&
      !alreadyIds.has(item.id)
  )

  return persistUnlocks(supabase, userId, crossedUnlocks, true)
}

function matchesUnlock(category: AchievementRow['category'], threshold: number, ctx: UnlockContext): boolean {
  switch (category) {
    case 'sessions': return ctx.totalSessions >= threshold
    case 'streak': return ctx.streak >= threshold
    case 'xp': return ctx.totalXP >= threshold
    case 'language': return ctx.completedLanguagesCount >= threshold
    case 'ranking': return ctx.leaderboardRank !== null && ctx.leaderboardRank <= threshold
    case 'track': return ctx.completedTrackIds.length >= threshold
    default: return false
  }
}

function isMissingTable(error: unknown): boolean {
  const candidate = error as { code?: string; message?: string } | null
  return candidate?.code === '42P01' || String(candidate?.message ?? '').includes('does not exist')
}
