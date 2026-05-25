'use client'

import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import LikeButton from './LikeButton'
import type { AchievementFeedEvent, TrackCompletedFeedEvent } from '@/lib/server/feed-store'

interface AchievementFeedCardProps {
  event: AchievementFeedEvent | TrackCompletedFeedEvent
  locale: Locale
  currentUserId: string | null
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

export default function AchievementFeedCard({
  event,
  locale,
  currentUserId,
}: AchievementFeedCardProps) {
  const username = event.username
  const displayName = event.displayName ?? event.username
  const time = timeAgo(event.createdAt, locale)
  const fallbackId = event.eventType === 'track_completed' ? event.payload.trackId : event.payload.achievementId
  const achievementName = event.payload.name[locale] || fallbackId
  const xp = event.payload.xp ?? 0

  return (
    <div
      className="flex items-start gap-3 rounded-2xl border p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--sub-alt) 60%, transparent)',
      }}
    >
      {/* Avatar */}
      <Link
        href={`/profile/${username}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
        style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
      >
        {event.avatarUrl ? (
          <img src={event.avatarUrl} alt={username} className="h-full w-full object-cover" />
        ) : (
          username.slice(0, 1).toUpperCase()
        )}
      </Link>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Header: username, time */}
        <div className="flex items-baseline gap-2">
          <Link
            href={`/profile/${username}`}
            className="text-sm font-semibold hover:underline"
            style={{ color: 'var(--text)' }}
          >
            {displayName}
          </Link>
          <span className="text-xs" style={{ color: 'var(--sub)' }}>
            @{username}
          </span>
          <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--sub)' }}>
            {time}
          </span>
        </div>

        {/* Achievement badge and info */}
        <div className="mt-2 rounded-lg p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{event.eventType === 'track_completed' ? '🗺️' : '🏆'}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {achievementName}
              </p>
              {xp > 0 && (
                <p className="text-xs" style={{ color: 'var(--main)' }}>
                  +{xp} XP
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Like button */}
        <LikeButton feedEventId={event.id} currentUserId={currentUserId} />
      </div>
    </div>
  )
}
