'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileStats from '@/components/profile/ProfileStats'
import BadgeGrid from '@/components/gamification/BadgeGrid'
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

  // Redireciona pro perfil proprio editavel se for o dono
  useEffect(() => {
    if (profile && ownProfile && profile.username === ownProfile.username) {
      // Mantem na pagina publica — diferenciacao de "isOwn" eh visual
    }
  }, [profile, ownProfile])

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <p style={{ color: 'var(--sub)' }}>{t('loading', locale)}</p>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <p style={{ color: 'var(--sub)' }}>{error ?? t('profileNotFound', locale)}</p>
        <Link href="/leaderboard" className="text-sm hover:opacity-80" style={{ color: 'var(--main)' }}>
          {t('back', locale)}
        </Link>
      </main>
    )
  }

  const isOwn = Boolean(ownProfile && ownProfile.username === profile.username)

  return (
    <main className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
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
          />
          <ProfileStats profile={profile} locale={locale} />
          <BadgeGrid unlockedIds={profile.achievementIds} locale={locale} />
          {isOwn && (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:brightness-110"
              style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
            >
              {t('editProfile', locale)}
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
