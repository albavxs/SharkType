'use client'

import Link from 'next/link'
import { t, type Locale } from '@/lib/i18n'
import { getLanguageById } from '@/data'
import LikeButton from './LikeButton'
import type { FeedEvent } from '@/lib/server/feed-store'

interface FeedItemProps {
  event: FeedEvent
  locale: Locale
  currentUserId?: string | null
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

export default function FeedItem({ event, locale, currentUserId = null }: FeedItemProps) {
  const username = event.username
  const displayName = event.displayName ?? event.username
  const time = timeAgo(event.createdAt, locale)

  return (
    <div className="flex items-start gap-3 rounded-2xl border p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--sub-alt) 60%, transparent)',
      }}
    >
      <Link href={`/profile/${username}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
        style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
      >
        {event.avatarUrl ? (
          <img src={event.avatarUrl} alt={username} className="h-full w-full object-cover" />
        ) : (
          username.slice(0, 1).toUpperCase()
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <Link href={`/profile/${username}`} className="text-sm font-semibold hover:underline" style={{ color: 'var(--text)' }}>
            {displayName}
          </Link>
          <span className="text-xs" style={{ color: 'var(--sub)' }}>@{username}</span>
          <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--sub)' }}>{time}</span>
        </div>

        {event.eventType === 'session' && (
          <FeedSessionBody payload={event.payload} locale={locale} />
        )}
        {event.eventType === 'achievement' && (
          <FeedAchievementBody payload={event.payload} locale={locale} />
        )}
        {event.eventType === 'level_up' && (
          <FeedLevelUpBody payload={event.payload} locale={locale} />
        )}
        <LikeButton feedEventId={event.id} currentUserId={currentUserId} />
      </div>
    </div>
  )
}

function FeedSessionBody({ payload, locale }: { payload: any; locale: Locale }) {
  const lang = getLanguageById(String(payload.languageId ?? ''))
  return (
    <div className="mt-1 text-sm" style={{ color: 'var(--sub)' }}>
      {t('feedSessionTitle', locale)}
      {' • '}
      <span style={{ color: lang?.color ?? 'var(--text)' }} className="font-semibold">{lang?.label ?? payload.languageId}</span>
      {' • '}
      <span className="tabular-nums" style={{ color: 'var(--main)' }}>{payload.wpm} wpm</span>
      {' • '}
      <span className="tabular-nums">{payload.accuracy}%</span>
    </div>
  )
}

function FeedAchievementBody({ payload, locale }: { payload: any; locale: Locale }) {
  const name = payload.name?.[locale] ?? payload.achievementId
  return (
    <div className="mt-1 text-sm" style={{ color: 'var(--sub)' }}>
      🏆 {t('feedAchievementTitle', locale)}
      {' • '}
      <span className="font-semibold" style={{ color: 'var(--main)' }}>{name}</span>
    </div>
  )
}

function FeedLevelUpBody({ payload, locale }: { payload: any; locale: Locale }) {
  return (
    <div className="mt-1 text-sm" style={{ color: 'var(--sub)' }}>
      ⬆️ {t('feedLevelUpTitle', locale)}{' '}
      <span className="font-semibold tabular-nums" style={{ color: 'var(--main)' }}>{payload.level}</span>
    </div>
  )
}
