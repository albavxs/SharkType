import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { listLeaderboard } from '@/lib/server/progress-store'

export async function GET() {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json({ entries: [] })
  }

  try {
    // The leaderboard views run with the caller's privileges, and user_progress
    // is no longer readable by anon (privacy hardening). Read the ranking with
    // the service role on the server; listLeaderboard only returns public
    // fields (name, avatar, XP, WPM, streak, score).
    const supabase = createAdminClient()
    const entries = await listLeaderboard(supabase)
    return NextResponse.json(
      { entries },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
    )
  } catch (leaderboardError) {
    console.error('[leaderboard] load failed:', leaderboardError)
    return NextResponse.json({ error: 'Could not load leaderboard.' }, { status: 500 })
  }
}
