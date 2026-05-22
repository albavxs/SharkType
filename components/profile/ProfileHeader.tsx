'use client'

import { getTierByLevel } from '@/lib/tiers'
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
}

export default function ProfileHeader({ profile, locale, isOwn, viewerAuthenticated, onFollowChange }: ProfileHeaderProps) {
  const tier = getTierByLevel(profile.level)

  return (
    <div className="relative overflow-hidden rounded-[2rem] border" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)' }}>
      {/* Banner */}
      <div className="h-24 sm:h-32" style={{ background: tier.gradient }} />

      {/* Conteudo */}
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-7 sm:py-6" style={{ backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Avatar — sobreposto ao banner */}
            <span
              className="-mt-16 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 text-3xl font-semibold sm:-mt-20 sm:h-28 sm:w-28"
              style={{
                borderColor: tier.color,
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
              <h1 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                {profile.displayName || profile.username}
              </h1>
              <p className="text-sm" style={{ color: 'var(--sub)' }}>@{profile.username}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full px-3 py-0.5 text-xs font-semibold" style={{ backgroundColor: tier.color, color: 'var(--bg)' }}>
                  {tier.name[locale]}
                </span>
                <span className="text-xs" style={{ color: 'var(--sub)' }}>Level {profile.level}</span>
                <StreakBadge streak={profile.currentStreak} locale={locale} size="sm" />
              </div>
            </div>
          </div>

          {/* Follow + counts */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <FollowerCounts followers={profile.followerCount} following={profile.followingCount} locale={locale} />
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
