import { NextResponse } from 'next/server'
import {
  listTrackBaseSummary,
  listTrackLanguageBadges,
  listTrackMasterySummary,
} from '@/lib/server/track-store'

export async function GET() {
  return NextResponse.json({
    trackLanguageBadges: await listTrackLanguageBadges(),
    trackBaseSummary: listTrackBaseSummary(),
    trackMasterySummary: listTrackMasterySummary(),
  })
}
