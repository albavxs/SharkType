import { NextResponse } from 'next/server'
import { getTrackPracticePayload } from '@/lib/server/track-store'
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

  try {
    const { track } = await context.params
    const { searchParams } = new URL(request.url)
    const languageId = searchParams.get('languageId')
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
    const payload = await getTrackPracticePayload(track, languageId, access)

    if (!payload) {
      return NextResponse.json({ error: 'Track not found.' }, { status: 404, headers: responseHeaders })
    }

    return NextResponse.json(payload, { headers: responseHeaders })
  } catch (error) {
    logStructuredError('tracks.practice_error', {
      request_id: requestId,
      route: '/api/tracks/[track]/practice',
      status: 500,
      duration_ms: Math.round(performance.now() - startedAt),
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? 'unknown',
      ...getSafeErrorDetails(error),
    })

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500, headers: responseHeaders },
    )
  }
}
