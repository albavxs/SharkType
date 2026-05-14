'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, FlameIcon, TrophyIcon, UserIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import { getLevel } from '@/lib/gamification'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

export default function ProfilePage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { user, profile, updateProfile, isLoading } = useAuth()
  const { progress, source } = useProgress()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
      setDisplayName(profile.displayName ?? '')
      setAvatarUrl(profile.avatarUrl ?? '')
    }
  }, [profile])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  if (!user || !profile) return null

  const levelInfo = getLevel(progress.totalXP)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsSaving(true)

    const result = await updateProfile({
      username,
      displayName,
      avatarUrl: avatarUrl || null,
    })

    setIsSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setMessage(locale === 'pt' ? 'Perfil salvo com sucesso.' : 'Profile saved successfully.')
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="px-3 sm:px-6 py-4">
        <Link href="/" className="relative z-20 inline-flex w-fit items-center gap-1.5 text-sm transition-opacity duration-150 hover:opacity-80 pointer-events-auto cursor-pointer" style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={14} />
          {t('back', locale)}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
        <div className="w-full max-w-3xl space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-5 rounded-[2rem] border p-5 sm:p-7" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>
            {!profile.onboardingCompleted && (
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
                {locale === 'pt' ? 'Escolha seu username público para aparecer no ranking global de jogadores.' : 'Choose your public username to appear on the global player leaderboard.'}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold"
                style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
                ) : (
                  profile.username.slice(0, 1).toUpperCase()
                )}
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                  {profile.displayName || profile.username}
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--sub)' }}>
                  {user.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full px-3 py-1" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
                    {profile.provider === 'github' ? 'GitHub' : 'Email'}
                  </span>
                  <span className="rounded-full px-3 py-1" style={{ backgroundColor: 'color-mix(in srgb, var(--sub) 16%, transparent)', color: 'var(--text)' }}>
                    {source === 'supabase' ? (locale === 'pt' ? 'Sincronizado' : 'Synced') : 'Guest'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: 'XP', value: progress.totalXP, accent: 'var(--main)' },
                { label: 'Level', value: levelInfo.level, accent: 'var(--text)' },
                { label: 'Best WPM', value: Object.values(progress.languages).reduce((best, item) => Math.max(best, item.bestWPM), 0), accent: 'var(--text)' },
                { label: 'Streak', value: `${progress.streak.current}d`, accent: 'var(--main)' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl px-4 py-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)' }}>
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--sub)' }}>{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: item.accent }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-4 rounded-[2rem] border p-5 sm:p-7" onSubmit={handleSubmit} style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>
            <div className="flex items-center gap-2">
              <UserIcon size={18} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                {locale === 'pt' ? 'Identidade pública' : 'Public identity'}
              </h2>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
                {t('authUsername', locale)}
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
              />
              <p className="text-xs leading-6" style={{ color: 'var(--sub)' }}>
                {t('authUsernameHint', locale)}
              </p>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
                {locale === 'pt' ? 'Nome exibido' : 'Display name'}
              </span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
                {locale === 'pt' ? 'URL da Foto de Perfil' : 'Profile Picture URL'}
              </span>
              <input
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://exemplo.com/foto.png"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
              />
            </label>

            {error ? <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>{error}</div> : null}
            {message ? <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>{message}</div> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
              >
                {isSaving ? t('authWorking', locale) : (locale === 'pt' ? 'Salvar perfil' : 'Save profile')}
              </button>
              <Link href="/leaderboard" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all hover:brightness-110" style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}>
                <TrophyIcon size={16} />
                {locale === 'pt' ? 'Ver ranking de jogadores' : 'View player leaderboard'}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
