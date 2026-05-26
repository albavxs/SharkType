'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { t } from '@/lib/i18n'
import FeedItem from '@/components/feed/FeedItem'
import FollowingActivityRail from '@/components/feed/FollowingActivityRail'
import SceneWrapper from '@/components/three/SceneWrapper'
import type { FeedEvent } from '@/lib/server/feed-store'

export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <FeedPageInner />
    </Suspense>
  )
}

function FeedPageInner() {
  const { user, isLoading } = useAuth()
  const { locale } = useLocale()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const initialScope = searchParams.get('scope') === 'following' ? 'following' : 'global'
  const [scope, setScope] = useState<'global' | 'following'>(initialScope)
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/feed?scope=${scope}`)
      .then(async res => {
        const data = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setError(data.error ?? 'Failed to load feed')
          setEvents([])
          return
        }
        setEvents(data.events ?? [])
      })
      .catch(e => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [scope])

  return (
    <main className="flex-1 flex flex-col min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
      <SceneWrapper />
      <div className="relative z-10 flex-1 flex flex-col">
      <div className="px-3 sm:px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80" style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={14} />
          {t('back', locale)}
        </Link>
      </div>

      <div className="flex-1 px-3 sm:px-6 py-4 sm:py-8">
        <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="w-full max-w-2xl space-y-5 lg:max-w-none">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                {t('navFeed', locale)}
              </h1>

              <div className="flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: 'var(--sub-alt)' }}>
                {(['global', 'following'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    disabled={s === 'following' && !isLoading && !user}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: scope === s ? 'var(--main)' : 'transparent',
                      color: scope === s ? 'var(--bg)' : 'var(--text)',
                    }}
                  >
                    {t(s === 'global' ? 'feedGlobal' : 'feedFollowing', locale)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm" style={{ color: 'var(--sub)' }}>{t('loading', locale)}</p>
            ) : error ? (
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
                {error}
              </div>
            ) : events.length === 0 ? (
              <p className="py-10 text-center text-sm" style={{ color: 'var(--sub)' }}>
                {scope === 'following' ? t('feedEmptyFollowing', locale) : t('feedEmpty', locale)}
              </p>
            ) : (
              <div className="space-y-2">
                {events.map(e => (
  <FeedItem key={e.id} event={e} locale={locale} currentUserId={user?.id ?? null} />
                ))}
              </div>
            )}
          </div>

          {!isMobile ? <FollowingActivityRail locale={locale} /> : null}
        </div>
      </div>
      </div>
    </main>
  )
}
