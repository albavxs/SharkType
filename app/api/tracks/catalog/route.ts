import { NextResponse } from 'next/server'
import { listTrackAccessSummary, listTrackLanguageBadges } from '@/lib/server/track-store'

export async function GET() {
  return NextResponse.json({
    trackLanguageBadges: await listTrackLanguageBadges(),
    trackAccessSummary: listTrackAccessSummary(),
  })
}
