'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import SceneWrapper from '@/components/three/SceneWrapper'

export default function ProfilePage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { user, profile, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (profile) {
      router.replace(`/profile/${profile.username}`)
      return
    }

    router.replace('/')
  }, [isLoading, user, profile, router])

  return (
    <main className="flex-1 flex min-h-screen items-center justify-center relative" style={{ backgroundColor: 'var(--bg)' }}>
      <SceneWrapper />
      <div className="relative z-10 text-sm" style={{ color: 'var(--sub)' }}>
        {t('loading', locale)}
      </div>
    </main>
  )
}