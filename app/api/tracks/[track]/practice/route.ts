import { NextResponse } from 'next/server'
import { getTrackPracticePayload } from '@/lib/server/track-store'
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
    const payload = await getTrackPracticePayload(track, requestedLanguageId, access)

    if (!payload) {
      return NextResponse.json({ error: 'Track not found.' }, { status: 404, headers: responseHeaders })
    }

    if (access.isSuperAdmin) {
      console.info(JSON.stringify({
        event: 'tracks.practice_superadmin_probe',
        request_id: requestId,
        track_id: track,
        requested_language_id: requestedLanguageId,
        selected_language_id: payload.selectedLanguage?.id ?? null,
        is_plus: access.isPlus,
        is_super_admin: access.isSuperAdmin,
        snippet_count: payload.snippets.length,
        premium_count: payload.wall.premiumCount,
        locked_count: payload.wall.lockedCount,
        has_plus_access: payload.wall.hasPlusAccess,
      }))
    }

    return NextResponse.json(payload, { headers: responseHeaders })
  } catch (error) {
    const premiumUnavailable = error instanceof PremiumContentUnavailableError
    const status = premiumUnavailable ? 503 : 500

    logStructuredError(
      premiumUnavailable ? 'tracks.practice_premium_unavailable' : 'tracks.practice_error',
      {
        request_id: requestId,
        route: '/api/tracks/[track]/practice',
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
        ? { error: 'Plus content is temporarily unavailable.', code: 'PREMIUM_CONTENT_UNAVAILABLE' }
        : { error: 'Internal server error.' },
      { status, headers: responseHeaders },
    )
  }
}
