import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createPublicClient } from '@/lib/supabase/public'
import { listLeaderboard } from '@/lib/server/progress-store'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ entries: [] })
  }

  try {
    const supabase = createPublicClient()
    const entries = await listLeaderboard(supabase)
    return NextResponse.json({ entries })
  } catch (leaderboardError) {
    return NextResponse.json(
      { error: leaderboardError instanceof Error ? leaderboardError.message : 'Could not load leaderboard.' },
      { status: 500 }
    )
  }
}
