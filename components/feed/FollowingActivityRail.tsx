'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLanguageMetaById } from '@/data/metadata'
import { useAuth } from '@/hooks/useAuth'
import { t, type Locale } from '@/lib/i18n'
import type { FeedEvent, ManualPostCategory } from '@/lib/server/feed-store'

interface FollowingActivityRailProps {
  locale: Locale
}

function timeAgo(iso: string, locale: Locale): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return locale === 'pt' ? 'agora' : 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

function describeEvent(event: FeedEvent, locale: Locale): string {
  switch (event.eventType) {
    case 'session': {
      const language = getLanguageMetaById(event.payload.languageId)
      const label = language?.label ?? event.payload.languageId
      return `${label} • ${event.payload.wpm} WPM`
    }
    case 'track_completed':
      return `${t('feedTrackCompletedTitle', locale)} • ${event.payload.name[locale] || event.payload.trackId}`
    case 'achievement':
      return `${t('feedAchievementTitle', locale)} • ${event.payload.name[locale] || event.payload.achievementId}`
    case 'level_up':
      return `${t('feedLevelUpTitle', locale)} ${event.payload.level}`
    case 'manual_post': {
      const label = getManualCategoryLabel(event.payload.category, locale)
      const title = event.payload.title[locale] || event.payload.title.en || event.payload.title.pt
      return `${label} • ${title}`
    }
    default:
      return ''
  }
}

function getManualCategoryLabel(category: ManualPostCategory, locale: Locale): string {
  if (category === 'ranked_tip') return t('feedCategoryRankedTip', locale)
  if (category === 'language_fact') return t('feedCategoryLanguageFact', locale)
  return t('feedCategoryAnnouncement', locale)
}

export default function FollowingActivityRail({ locale }: FollowingActivityRailProps) {
  const { user } = useAuth()
  const [events, setEvents] = useState<FeedEvent[]>([])

  useEffect(() => {
    if (!user) {
      const frameId = requestAnimationFrame(() => setEvents([]))
      return () => cancelAnimationFrame(frameId)
    }

    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/feed?scope=following', { cache: 'no-store' })
        const payload = (await response.json()) as { events?: FeedEvent[] }
        if (!cancelled && response.ok) {
          setEvents(payload.events ?? [])
        }
      } catch {
        if (!cancelled) {
          setEvents([])
        }
      }
    }

    void load()
    const intervalId = window.setInterval(() => {
      void load()
    }, 30000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [user])

  const allowedTypes = new Set<FeedEvent['eventType']>(['session', 'track_completed', 'achievement', 'level_up', 'manual_post'])
  const seenUsers = new Set<string>()
  const groupedEvents: FeedEvent[] = []

  for (const event of events) {
    if (!allowedTypes.has(event.eventType)) continue
    if (seenUsers.has(event.userId)) continue
    seenUsers.add(event.userId)
    groupedEvents.push(event)
    if (groupedEvents.length >= 8) break
  }

  return (
    <aside
      className="hidden lg:block lg:w-[320px]"
      aria-label={t('feedFollowingRailTitle', locale)}
    >
      <div
        className="sticky top-6 space-y-4 rounded-[2rem] border p-5"
        style={{
          borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)',
        }}
      >
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
            {t('feedFollowingRailTitle', locale)}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>
            {user ? t('feedFollowingRailHint', locale) : t('feedFollowingRailLogin', locale)}
          </p>
        </div>

        {!user ? (
          <Link href="/login" className="text-sm font-medium hover:opacity-80" style={{ color: 'var(--main)' }}>
            {t('authSignIn', locale)}
          </Link>
        ) : groupedEvents.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--sub)' }}>
            {t('feedFollowingRailEmpty', locale)}
          </p>
        ) : (
          <div className="space-y-3">
            {groupedEvents.map((event) => (
              <Link
                key={event.id}
                href={`/profile/${event.username}`}
                className="flex items-start gap-3 rounded-2xl px-3 py-3 transition-all hover:brightness-110"
                style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)' }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
                >
                  {event.avatarUrl ? (
                    <img src={event.avatarUrl} alt={event.username} className="h-full w-full object-cover" />
                  ) : (
                    event.username.slice(0, 1).toUpperCase()
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {event.displayName || event.username}
                    </span>
                    <span className="text-xs tabular-nums" style={{ color: 'var(--sub)' }}>
                      {timeAgo(event.createdAt, locale)}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed" style={{ color: 'var(--sub)' }}>
                    {describeEvent(event, locale)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
