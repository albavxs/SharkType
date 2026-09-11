import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess, requireSuperAdmin } from '@/lib/server/access-control'
import { getPremiumContentHealth, PremiumContentUnavailableError } from '@/lib/server/premium-content'
import { getTrackPracticePayload } from '@/lib/server/track-store'

const diagnosticTracks = [
  { trackId: 'react', expectedTotal: 12 },
  { trackId: 'git', expectedTotal: 20 },
] as const

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let access
  try {
    access = await requireSuperAdmin(supabase, user)
  } catch {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  try {
    const packageHealth = await getPremiumContentHealth(['react', 'git'])
    const tracks = Object.fromEntries(
      await Promise.all(
        diagnosticTracks.map(async ({ trackId, expectedTotal }) => {
          const payload = await getTrackPracticePayload(trackId, null, access)
          return [
            trackId,
            {
              expectedTotal,
              resolvedTotal: payload?.snippets.length ?? 0,
              selectedLanguageId: payload?.selectedLanguage?.id ?? null,
              premiumCount: payload?.wall.premiumCount ?? 0,
              hasPlusAccess: payload?.wall.hasPlusAccess ?? false,
              complete: (payload?.snippets.length ?? 0) >= expectedTotal,
            },
          ] as const
        }),
      ),
    )

    return NextResponse.json({
      access: {
        plan: access.plan,
        role: access.role,
        isPlus: access.isPlus,
        isSuperAdmin: access.isSuperAdmin,
      },
      package: packageHealth,
      tracks,
    })
  } catch (error) {
    const premiumUnavailable = error instanceof PremiumContentUnavailableError
    console.error('[admin-premium-health] failed:', error instanceof Error ? error.message : error)

    return NextResponse.json(
      {
        error: premiumUnavailable
          ? 'Plus content is temporarily unavailable.'
          : 'Could not verify premium runtime health.',
        code: premiumUnavailable ? 'PREMIUM_CONTENT_UNAVAILABLE' : 'PREMIUM_HEALTH_FAILED',
      },
      { status: premiumUnavailable ? 503 : 500 },
    )
  }
}
