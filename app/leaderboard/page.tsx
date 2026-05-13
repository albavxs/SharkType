'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LeaderboardEntry } from '@/lib/auth-types'
import { getLevel } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import ThemeSelector from '@/components/typing/ThemeSelector'
import SceneWrapper from '@/components/three/SceneWrapper'
import { codeLanguages } from '@/data'
import { Language, Difficulty } from '@/lib/types'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'

export default function LeaderboardPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState('dracula')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const { progress } = useProgress()
  const { profile } = useAuth()

  useEffect(() => {
    const themeName = getThemePref()
    setCurrentTheme(themeName)
    applyTheme(getTheme(themeName))
  }, [])

  useEffect(() => {
    let active = true

    void (async () => {
      try {
        const response = await fetch('/api/leaderboard', { cache: 'no-store' })
        const payload = (await response.json()) as { entries?: LeaderboardEntry[]; error?: string }
        if (!active) return

        if (!response.ok) {
          setError(payload.error ?? 'Could not load leaderboard.')
          setEntries([])
        } else {
          setEntries(payload.entries ?? [])
          setError(null)
        }
      } catch {
        if (!active) return
        setError('Could not load leaderboard.')
        setEntries([])
      } finally {
        if (active) setIsLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const levelInfo = getLevel(progress.totalXP)

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={codeLanguages[0]} difficulty={'all' as Difficulty | 'all'}
          seconds={0} isTimerRunning={false}
          onLanguageChange={() => {}} onDifficultyChange={() => {}}
          showControls={false}
          onHomeClick={() => router.push('/')} onHelpClick={() => {}}
          level={levelInfo.level} streak={progress.streak.current}
          locale={locale} onLocaleToggle={toggleLocale}
        />

        <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                {t('pageRanking', locale)}
              </h1>
              <p className="mt-2 text-xs sm:text-sm" style={{ color: 'var(--sub)' }}>
                {t('globalPlayers', locale)}
              </p>
              {!profile ? (
                <p className="mt-2 text-xs" style={{ color: 'var(--main)' }}>
                  {t('rankingGuestHint', locale)}
                </p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="py-16 text-center text-sm" style={{ color: 'var(--sub)' }}>
                {t('loading', locale)}
              </div>
            ) : entries.length === 0 ? (
              <div className="py-16 text-center" style={{ color: 'var(--sub)' }}>
                <p className="text-sm">{t('noPlayers', locale)}</p>
                <p className="mt-1 text-xs">{t('noPlayersHint', locale)}</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="min-w-[34rem] overflow-hidden rounded-2xl border" style={{ borderColor: 'color-mix(in srgb, var(--sub) 20%, transparent)' }}>
                  <div
                    className="grid px-4 py-3 text-[10px] uppercase tracking-[0.24em]"
                    style={{
                      gridTemplateColumns: '3rem 1.4fr 5rem 4.5rem 4rem 5rem',
                      backgroundColor: 'var(--sub-alt)',
                      color: 'var(--sub)',
                    }}
                  >
                    <span>#</span>
                    <span>{t('authUsername', locale)}</span>
                    <span className="text-right">{t('colXP', locale)}</span>
                    <span className="text-right">wpm</span>
                    <span className="text-right">{t('colStreak', locale)}</span>
                    <span className="text-right">{t('sessions', locale)}</span>
                  </div>

                  {entries.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className="grid items-center px-4 py-3 text-sm"
                      style={{
                        gridTemplateColumns: '3rem 1.4fr 5rem 4.5rem 4rem 5rem',
                        borderTop: index > 0 ? '1px solid color-mix(in srgb, var(--sub) 10%, transparent)' : 'none',
                        backgroundColor: profile?.id === entry.userId ? 'color-mix(in srgb, var(--main) 7%, transparent)' : 'transparent',
                      }}
                    >
                      <span className="font-mono text-xs" style={{ color: index < 3 ? 'var(--main)' : 'var(--sub)' }}>
                        {entry.rank}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
                        >
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={entry.username} className="h-full w-full object-cover" />
                          ) : (
                            entry.username.slice(0, 1).toUpperCase()
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-medium" style={{ color: 'var(--text)' }}>
                            {entry.username}
                          </div>
                          {entry.displayName && entry.displayName !== entry.username ? (
                            <div className="truncate text-xs" style={{ color: 'var(--sub)' }}>
                              {entry.displayName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <span className="text-right font-semibold tabular-nums" style={{ color: 'var(--main)' }}>
                        {entry.totalXP}
                      </span>
                      <span className="text-right tabular-nums" style={{ color: 'var(--text)' }}>
                        {entry.bestWPM}
                      </span>
                      <span className="text-right tabular-nums" style={{ color: entry.currentStreak > 0 ? 'var(--main)' : 'var(--sub)' }}>
                        {entry.currentStreak}d
                      </span>
                      <span className="text-right tabular-nums" style={{ color: 'var(--sub)' }}>
                        {entry.totalSessions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer onHelpClick={() => {}} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} locale={locale} />
      </div>

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
    </main>
  )
}
