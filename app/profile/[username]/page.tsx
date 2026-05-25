'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileEditorCard from '@/components/profile/ProfileEditorCard'
import ProfileStats from '@/components/profile/ProfileStats'
import BadgeGrid from '@/components/gamification/BadgeGrid'
import SceneWrapper from '@/components/three/SceneWrapper'
import type { PublicProfile } from '@/lib/server/profile-store'

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { locale } = useLocale()
  const { user, profile: ownProfile } = useAuth()
  const username = (params.username as string) ?? ''

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/profile/${encodeURIComponent(username)}`)
      .then(async res => {
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}))
          throw new Error(payload.error ?? `HTTP ${res.status}`)
        }
        return res.json() as Promise<{ profile: PublicProfile }>
      })
      .then(data => {
        if (cancelled) return
        setProfile(data.profile)
      })
      .catch(e => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Could not load profile')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [username])

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
        <SceneWrapper />
        <div className="relative z-10">
          <p style={{ color: 'var(--sub)' }}>{t('loading', locale)}</p>
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
        <SceneWrapper />
        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <p style={{ color: 'var(--sub)' }}>{error ?? t('profileNotFound', locale)}</p>
          <Link href="/leaderboard" className="text-sm hover:opacity-80" style={{ color: 'var(--main)' }}>
            {t('back', locale)}
          </Link>
        </div>
      </main>
    )
  }

  const isOwn = Boolean(ownProfile && ownProfile.username === profile.username)

  return (
    <main className="flex-1 flex flex-col min-h-screen relative" style={{ backgroundColor: 'var(--bg)' }}>
      <SceneWrapper />
      <div className="relative z-10 flex-1 flex flex-col">
      <div className="px-3 sm:px-6 py-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm transition-opacity duration-150 hover:opacity-80 cursor-pointer"
          style={{ color: 'var(--sub)' }}
        >
          <ArrowLeftIcon size={14} />
          {t('back', locale)}
        </button>
      </div>

      <div className="flex-1 px-3 sm:px-6 py-4 sm:py-8">
        <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
          <ProfileHeader
            profile={profile}
            locale={locale}
            isOwn={isOwn}
            viewerAuthenticated={Boolean(user)}
            isEditing={isEditing}
            onEditToggle={isOwn ? () => setIsEditing((current) => !current) : undefined}
          />
          {isOwn && isEditing ? (
            <ProfileEditorCard
              profile={profile}
              locale={locale}
              onAvatarUpdated={(avatarUrl) => {
                setProfile((current) => current ? { ...current, avatarUrl } : current)
              }}
              onSaved={(payload) => {
                setProfile((current) => current ? {
                  ...current,
                  username: payload.username,
                  displayName: payload.displayName,
                  avatarUrl: payload.avatarUrl,
                  bio: payload.bio,
                } : current)
                setIsEditing(false)
                if (payload.username !== username) {
                  router.replace(`/profile/${payload.username}`)
                }
              }}
            />
          ) : null}
          <ProfileStats profile={profile} locale={locale} />
          <BadgeGrid unlockedIds={profile.achievementIds} locale={locale} />
        </div>
      </div>
      </div>
    </main>
  )
}
