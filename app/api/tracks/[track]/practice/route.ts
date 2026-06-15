import { NextResponse } from 'next/server'
import { getTrackPracticePayload } from '@/lib/server/track-store'

interface RouteContext {
  params: Promise<{
    track: string
  }>
}

export async function GET(request: Request, context: RouteContext) {
  const { track } = await context.params
  const { searchParams } = new URL(request.url)
  const languageId = searchParams.get('languageId')
  const payload = getTrackPracticePayload(track, languageId)

  if (!payload) {
    return NextResponse.json({ error: 'Track not found.' }, { status: 404 })
  }

  return NextResponse.json(payload)
}
