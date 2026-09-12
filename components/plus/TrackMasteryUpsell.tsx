'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useUserAccess } from '@/hooks/useUserAccess'
import type { Locale } from '@/lib/i18n'

type TrackMasterySummary = {
  eligible: boolean
  available: boolean
  challengeCount: number
  totalStars: number
}

interface TrackMasteryUpsellProps {
  locale: Locale
}

export default function TrackMasteryUpsell({ locale }: TrackMasteryUpsellProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isPlus } = useUserAccess()
  const [summary, setSummary] = useState<TrackMasterySummary | null>(null)

  const match = pathname.match(/^\/tracks\/([^/]+)$/)
  const trackId = match ? decodeURIComponent(match[1]) : null

  useEffect(() => {
    if (!trackId) return

    let active = true
    void fetch('/api/tracks/catalog', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load Mastery catalog.')
        return response.json() as Promise<{ trackMasterySummary?: Record<string, TrackMasterySummary> }>
      })
      .then((payload) => {
        if (!active) return
        setSummary(payload.trackMasterySummary?.[trackId] ?? null)
      })
      .catch(() => {
        if (active) setSummary(null)
      })

    return () => {
      active = false
    }
  }, [trackId])

  if (!trackId || !user || !summary?.eligible || !summary.available || summary.challengeCount <= 0) {
    return null
  }

  const href = isPlus ? `/tracks/${encodeURIComponent(trackId)}/mastery` : '/plus'

  return (
    <section
      className="mb-6 rounded-2xl border px-4 py-4 sm:px-5"
      style={{
        borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--main) 10%, transparent), transparent 52%), var(--sub-alt)',
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--main)' }}>
            ✦ SharkType Plus Mastery
          </p>
          <h3 className="mt-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {locale === 'pt' ? 'Terminou a trilha base? Continue no Mastery.' : 'Finished the base track? Continue in Mastery.'}
          </h3>
          <p className="mt-1 text-xs leading-5" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? `${summary.challengeCount} desafios avançados · ${summary.totalStars} estrelas possíveis.`
              : `${summary.challengeCount} advanced challenges · ${summary.totalStars} possible stars.`}
          </p>
        </div>

        <Link
          href={href}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2"
          style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
        >
          {isPlus
            ? locale === 'pt' ? 'Começar Mastery' : 'Start Mastery'
            : locale === 'pt' ? 'Desbloquear com Plus' : 'Unlock with Plus'}
        </Link>
      </div>
    </section>
  )
}
