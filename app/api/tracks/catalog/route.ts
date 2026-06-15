import { NextResponse } from 'next/server'
import { listTrackLanguageBadges } from '@/lib/server/track-store'

export async function GET() {
  return NextResponse.json({
    trackLanguageBadges: listTrackLanguageBadges(),
  })
}
