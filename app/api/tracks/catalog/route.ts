import { NextResponse } from 'next/server'
import {
  listTrackLanguageBadges,
  listTrackMasterySummary,
} from '@/lib/server/track-store'

export async function GET() {
  return NextResponse.json({
    trackLanguageBadges: await listTrackLanguageBadges(),
    trackMasterySummary: listTrackMasterySummary(),
  })
}
