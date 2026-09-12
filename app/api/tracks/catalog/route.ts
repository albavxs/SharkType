import { NextResponse } from 'next/server'
import {
  listTrackAccessSummary,
  listTrackLanguageBadges,
  listTrackMasterySummary,
} from '@/lib/server/track-store'

export async function GET() {
  return NextResponse.json({
    trackLanguageBadges: await listTrackLanguageBadges(),
    trackAccessSummary: listTrackAccessSummary(),
    trackMasterySummary: listTrackMasterySummary(),
  })
}
