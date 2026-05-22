import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProgress } from '@/lib/gamification'

type DBClient = SupabaseClient<any>

export interface AchievementRow {
  id: string
  category: 'sessions' | 'streak' | 'xp' | 'language' | 'ranking'
  threshold: number | null
  icon: string
  name: { pt: string; en: string }
  description: { pt: string; en: string }
}

interface UnlockContext {
  totalSessions: number
  streak: number
  totalXP: number
  /** Numero de linguagens com pelo menos 1 snippet completo */
  completedLanguagesCount: number
  /** Rank no leaderboard (1-indexed). null se nao estiver no top 100. */
  leaderboardRank: number | null
}

/**
 * Verifica quais achievements o usuario acabou de desbloquear.
 * Compara unlocks ja registrados vs estado atual do progress.
 * Retorna apenas os NOVOS (e ja insere user_achievements).
 *
 * Se a tabela achievements nao existir (migration 004 ausente), retorna [].
 */
export async function checkUnlocks(
  supabase: DBClient,
  userId: string,
  progress: UserProgress,
  leaderboardRank: number | null = null,
): Promise<AchievementRow[]> {
  // 1. Carrega catalogo
  const catalogRes = await supabase.from('achievements').select('*')
  if (catalogRes.error) {
    if (isMissingTable(catalogRes.error)) return []
    return []
  }
  const catalog = (catalogRes.data ?? []) as Array<{
    id: string
    category: AchievementRow['category']
    threshold: number | null
    icon: string
    name_pt: string
    name_en: string
    description_pt: string
    description_en: string
  }>
  if (catalog.length === 0) return []

  // 2. Carrega ja desbloqueados
  const alreadyRes = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)
  if (alreadyRes.error && !isMissingTable(alreadyRes.error)) {
    return []
  }
  const alreadyIds = new Set<string>((alreadyRes.data ?? []).map((r: any) => r.achievement_id))

  // 3. Calcula contexto
  const ctx: UnlockContext = {
    totalSessions: progress.history.length,
    streak: progress.streak.current,
    totalXP: progress.totalXP,
    completedLanguagesCount: Object.values(progress.languages).filter(l => l.completedSnippetIds.length > 0).length,
    leaderboardRank,
  }

  // 4. Filtra novos unlocks
  const newlyUnlocked: typeof catalog = []
  for (const item of catalog) {
    if (alreadyIds.has(item.id)) continue
    if (matchesUnlock(item.category, item.threshold ?? 0, ctx)) {
      newlyUnlocked.push(item)
    }
  }

  if (newlyUnlocked.length === 0) return []

  // 5. Persiste
  const insertRows = newlyUnlocked.map(a => ({ user_id: userId, achievement_id: a.id }))
  await supabase.from('user_achievements').insert(insertRows)

  return newlyUnlocked.map(row => ({
    id: row.id,
    category: row.category,
    threshold: row.threshold,
    icon: row.icon,
    name: { pt: row.name_pt, en: row.name_en },
    description: { pt: row.description_pt, en: row.description_en },
  }))
}

function matchesUnlock(category: AchievementRow['category'], threshold: number, ctx: UnlockContext): boolean {
  switch (category) {
    case 'sessions': return ctx.totalSessions >= threshold
    case 'streak':   return ctx.streak >= threshold
    case 'xp':       return ctx.totalXP >= threshold
    case 'language': return ctx.completedLanguagesCount >= threshold
    case 'ranking':  return ctx.leaderboardRank !== null && ctx.leaderboardRank <= threshold
    default: return false
  }
}

function isMissingTable(error: any): boolean {
  return error?.code === '42P01' || String(error?.message ?? '').includes('does not exist')
}
