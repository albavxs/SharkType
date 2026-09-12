import { NextResponse } from 'next/server'
import { getTrackMasteryPayload } from '@/lib/server/track-store'
import { PremiumContentUnavailableError } from '@/lib/server/premium-content'
import { getSafeErrorDetails, logStructuredError } from '@/lib/server/safe-logging'
import { getUserAccess } from '@/lib/server/access-control'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'

interface RouteContext {
  params: Promise<{
    track: string
  }>
}

export async function GET(request: Request, context: RouteContext) {
  const requestId = crypto.randomUUID()
  const startedAt = performance.now()
  const responseHeaders = { 'x-request-id': requestId }
  let trackId = 'unknown'
  let requestedLanguageId: string | null = null

  try {
    const { track } = await context.params
    trackId = track
    const { searchParams } = new URL(request.url)
    requestedLanguageId = searchParams.get('languageId')

    const env = getSupabaseEnv()
    if (!env.configured) {
      return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503, headers: responseHeaders })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401, headers: responseHeaders })
    }

    const access = await getUserAccess(supabase, user)
    if (!access.isPlus) {
      return NextResponse.json(
        { error: 'SharkType Plus required.', code: 'PLUS_REQUIRED' },
        { status: 403, headers: responseHeaders },
      )
    }

    const payload = await getTrackMasteryPayload(track, requestedLanguageId, access)
    if (!payload) {
      return NextResponse.json(
        { error: 'Mastery is not available for this track.', code: 'MASTERY_NOT_AVAILABLE' },
        { status: 404, headers: responseHeaders },
      )
    }

    return NextResponse.json(payload, { headers: responseHeaders })
  } catch (error) {
    const premiumUnavailable = error instanceof PremiumContentUnavailableError
    const status = premiumUnavailable ? 503 : 500

    logStructuredError(
      premiumUnavailable ? 'tracks.mastery_premium_unavailable' : 'tracks.mastery_error',
      {
        request_id: requestId,
        route: '/api/tracks/[track]/mastery',
        track_id: trackId,
        requested_language_id: requestedLanguageId,
        status,
        duration_ms: Math.round(performance.now() - startedAt),
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? 'unknown',
        ...getSafeErrorDetails(error),
      },
    )

    return NextResponse.json(
      premiumUnavailable
        ? { error: 'Mastery content is temporarily unavailable.', code: 'PREMIUM_CONTENT_UNAVAILABLE' }
        : { error: 'Internal server error.' },
      { status, headers: responseHeaders },
    )
  }
}
