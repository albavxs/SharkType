'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tracks, Track } from '@/data/tracks'
import { codeLanguageMetas, getLanguageMetaById, textLanguageMetas } from '@/data/metadata'
import { getLevel } from '@/lib/gamification'
import { DEFAULT_THEME, getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import { DEFAULT_LANGUAGE } from '@/lib/constants'
import { LanguageMeta, Difficulty } from '@/lib/types'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'
import { LockIcon } from '@/components/icons'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const conceptTracks = tracks.filter(t => t.section === 'concept')
const focusedTracks = tracks.filter(t => t.section === 'focused')
const cyberdevopsTracks = tracks.filter(t => t.section === 'cyberdevops')
const codeTracks = [...conceptTracks, ...focusedTracks, ...cyberdevopsTracks]
const idiomTracks = tracks.filter(t => t.textLanguages)
const idiomBadges = textLanguageMetas.filter((language) => language.id !== 'text-typing')

export default function TracksPage() {
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showGuestOverlay, setShowGuestOverlay] = useState(false)
  const [trackLangsMap, setTrackLangsMap] = useState<Map<string, LanguageMeta[]>>(new Map())
  const { user } = useAuth()
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const { progress } = useProgress()
  const levelInfo = getLevel(progress.totalXP)

  const dummyLang = getLanguageMetaById(DEFAULT_LANGUAGE) ?? codeLanguageMetas[0]

  useEffect(() => {
    const themeName = getThemePref()
    if (themeName !== currentTheme) {
      queueMicrotask(() => setCurrentTheme(themeName))
    }
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  useEffect(() => {
    let active = true

    void (async () => {
      try {
        const response = await fetch('/api/tracks/catalog', { cache: 'no-store' })
        const payload = (await response.json()) as { trackLanguageBadges?: Record<string, LanguageMeta[]> }
        if (!active || !response.ok) return
        setTrackLangsMap(new Map(Object.entries(payload.trackLanguageBadges ?? {})))
      } catch {
        if (active) {
          setTrackLangsMap(new Map())
        }
      }
    })()

    return () => {
      active = false
    }
  }, [])

  function getTrackProgress(snippetIds: string[]): number {
    let completed = 0
    for (const id of snippetIds) {
      for (const lp of Object.values(progress.languages)) {
        if (lp.completedSnippetIds.includes(id)) { completed++; break }
      }
    }
    return completed
  }

  function getSectionStats(sectionTracks: Track[]) {
    let total = 0
    let completed = 0
    for (const track of sectionTracks) {
      total += track.snippetIds.length
      completed += getTrackProgress(track.snippetIds)
    }
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, pct }
  }

  const codeStats = getSectionStats(codeTracks)

  function TrackCard({ track, badges }: { track: Track; badges: LanguageMeta[] }) {
    return (
      <button 
        onClick={() => {
          if (!user) {
            setShowGuestOverlay(true)
            return
          }
          router.push(`/tracks/${track.id}`)
        }}
        className="block w-full min-w-0 rounded-xl p-4 text-left transition-all duration-150 hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer sm:p-5"
        style={{ backgroundColor: 'var(--sub-alt)' }}>
        <div className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>{track.name[locale]}</div>
        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--sub)' }}>{track.description[locale]}</div>
        <div className="flex flex-wrap gap-1">
          {badges.map(lang => (
            <span key={lang.id} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: lang.color + '22', color: lang.color, border: `1px solid ${lang.color}44` }}>
              {lang.label}
            </span>
          ))}
        </div>
      </button>
    )
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={dummyLang} difficulty={'all' as Difficulty | 'all'}
          seconds={0} isTimerRunning={false}
          onLanguageChange={() => {}} onDifficultyChange={() => {}}
          showControls={false}
          onHomeClick={() => router.push('/')} onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level} streak={progress.streak.current}
          locale={locale} onLocaleToggle={toggleLocale}
        />

        <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-5xl">
            <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-geist-mono)] mb-2" style={{ color: 'var(--text)' }}>
              {t('pageTracks', locale)}
            </h1>
            <p className="text-xs sm:text-sm mb-4 sm:mb-8" style={{ color: 'var(--sub)' }}>
              {t('tracksSubtitle', locale)}
            </p>

            {/* Idiomas section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)] mb-0.5" style={{ color: 'var(--text)' }}>{t('sectionIdioms', locale)}</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>{t('idiomsDesc', locale)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {idiomTracks.map(track => (
                  <TrackCard key={track.id} track={track} badges={track.snippetIds.length > 0 ? [] : idiomBadges} />
                ))}
              </div>
            </div>

            {/* Conceitos section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)] mb-0.5" style={{ color: 'var(--text)' }}>{t('codeSection', locale)}</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>{t('codeTracksDesc', locale)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {conceptTracks.map(track => (
                  <TrackCard key={track.id} track={track} badges={trackLangsMap.get(track.id) ?? []} />
                ))}
              </div>
            </div>

            {/* Foco por Área section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)] mb-0.5" style={{ color: 'var(--text)' }}>{t('focusedSection', locale)}</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>{t('focusedTracksDesc', locale)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {focusedTracks.map(track => (
                  <TrackCard key={track.id} track={track} badges={trackLangsMap.get(track.id) ?? []} />
                ))}
              </div>
            </div>

            {/* Cybersecurity & DevOps section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)] mb-0.5" style={{ color: 'var(--text)' }}>{t('cyberdevopsSection', locale)}</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>{t('cyberdevopsTracksDesc', locale)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {cyberdevopsTracks.map(track => (
                  <TrackCard key={track.id} track={track} badges={trackLangsMap.get(track.id) ?? []} />
                ))}
              </div>
              {codeStats.total > 0 && (
                <div className="mt-4 text-xs" style={{ color: 'var(--sub)' }}>
                  {codeStats.completed}/{codeStats.total} {t('completed', locale)} · {codeStats.pct}%
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} locale={locale} />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}

      {showGuestOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300 sm:p-8" style={{ backgroundColor: 'var(--bg)', border: '1px solid color-mix(in srgb, var(--sub) 24%, transparent)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
                <LockIcon size={32} />
              </div>
              <h2 className="mb-2 text-xl font-bold" style={{ color: 'var(--text)' }}>
                {t('tracksGuestTitle', locale)}
              </h2>
              <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>
                {t('tracksGuestDesc', locale)}
              </p>
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:brightness-110"
                  style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                >
                  {t('tracksGuestButton', locale)}
                </button>
                <button
                  onClick={() => setShowGuestOverlay(false)}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all hover:opacity-80"
                  style={{ color: 'var(--sub)' }}
                >
                  {t('back', locale)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
