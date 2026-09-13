import { NextResponse } from 'next/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import { createPublicClient } from '@/lib/supabase/public'
import { listLeaderboard } from '@/lib/server/progress-store'

export async function GET() {
  const env = getSupabaseEnv()

  if (!env.configured) {
    return NextResponse.json({ entries: [] })
  }

  try {
    const supabase = createPublicClient()
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
