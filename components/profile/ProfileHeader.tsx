'use client'

import { t, type Locale } from '@/lib/i18n'
import StreakBadge from './StreakBadge'
import FollowerCounts from './FollowerCounts'
import FollowButton from '@/components/feed/FollowButton'
import type { PublicProfile } from '@/lib/server/profile-store'

interface ProfileHeaderProps {
  profile: PublicProfile
  locale: Locale
  isOwn: boolean
  viewerAuthenticated: boolean
  onFollowChange?: (isFollowing: boolean) => void
  isEditing?: boolean
  onEditToggle?: () => void
}

export default function ProfileHeader({
  profile,
  locale,
  isOwn,
  viewerAuthenticated,
  onFollowChange,
  isEditing = false,
  onEditToggle,
}: ProfileHeaderProps) {
  const rank = profile.rank
  return (
    <div className="relative overflow-hidden rounded-[2rem] border" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)' }}>
      {/* Banner */}
      <div className="h-28 sm:h-36" style={{ background: rank.gradient }} />

      {/* Conteudo */}
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-7 sm:py-6" style={{ backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Avatar — sobreposto ao banner */}
            <span
              className="-mt-16 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 text-3xl font-semibold sm:-mt-20 sm:h-28 sm:w-28"
              style={{
                borderColor: rank.color,
                backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)',
                color: 'var(--main)',
              }}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
              ) : (
                profile.username.slice(0, 1).toUpperCase()
              )}
            </span>

            <div>
              <h1 className="break-words text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                {profile.displayName || profile.username}
              </h1>
              <p className="break-all text-sm" style={{ color: 'var(--sub)' }}>@{profile.username}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full px-3 py-0.5 text-xs font-semibold" style={{ backgroundColor: rank.color, color: 'var(--bg)' }}>
                  {rank.label[locale]}
                </span>
                <span className="text-xs" style={{ color: 'var(--sub)' }}>Level {profile.level}</span>
                <span className="text-xs" style={{ color: 'var(--sub)' }}>{t('rankScore', locale)} {profile.score}</span>
                <StreakBadge streak={profile.currentStreak} locale={locale} size="sm" />
              </div>
              {profile.bio ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  {profile.bio}
                </p>
              ) : null}
              <div className="mt-3 max-w-sm">
                <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
                  <span>{t('rankProgress', locale)}</span>
                  <span className="tabular-nums">
                    {rank.maxScore !== null ? `${rank.score} / ${rank.maxScore}` : `${rank.score}+`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)' }}>
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${rank.progressPercent}%`, backgroundColor: rank.color }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Follow + counts */}
          <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:items-end">
            <FollowerCounts followers={profile.followerCount} following={profile.followingCount} locale={locale} />
            {isOwn && onEditToggle ? (
              <button
                type="button"
                onClick={onEditToggle}
                className="w-full rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95 sm:w-auto"
                style={{ backgroundColor: isEditing ? 'var(--main)' : 'var(--sub-alt)', color: isEditing ? 'var(--bg)' : 'var(--text)' }}
              >
                {isEditing ? t('profileDoneEditing', locale) : t('profileEditing', locale)}
              </button>
            ) : null}
            {!isOwn && viewerAuthenticated && (
              <FollowButton
                username={profile.username}
                initiallyFollowing={profile.isFollowedByMe}
                locale={locale}
                onChange={onFollowChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
