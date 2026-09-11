import { NextResponse } from 'next/server'
import { getLanguagePracticePayload } from '@/lib/server/track-store'
import { anonymousAccess, getUserAccess } from '@/lib/server/access-control'
import { getSafeErrorDetails, logStructuredError } from '@/lib/server/safe-logging'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv } from '@/lib/supabase/env'

interface RouteContext {
  params: Promise<{
    language: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  const requestId = crypto.randomUUID()
  const startedAt = performance.now()
  const responseHeaders = { 'x-request-id': requestId }

  try {
    const { language } = await context.params
    const env = getSupabaseEnv()
    let access = anonymousAccess

    if (env.configured) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      access = await getUserAccess(supabase, user)
    }

    const payload = await getLanguagePracticePayload(language, access)
    if (!payload) {
      return NextResponse.json({ error: 'Language not found.' }, { status: 404, headers: responseHeaders })
    }

    return NextResponse.json(payload, { headers: responseHeaders })
  } catch (error) {
    logStructuredError('languages.practice_error', {
      request_id: requestId,
      route: '/api/languages/[language]/practice',
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
