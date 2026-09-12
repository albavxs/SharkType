'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tracks, type Track } from '@/data/tracks'
import { codeLanguageMetas, getLanguageMetaById } from '@/data/metadata'
import { getLevel } from '@/lib/gamification'
import { DEFAULT_THEME, getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import CategorySection from '@/components/tracks/CategorySection'
import { DEFAULT_LANGUAGE } from '@/lib/constants'
import type { Difficulty, LanguageMeta } from '@/lib/types'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'
import { useUserAccess } from '@/hooks/useUserAccess'
import { LockIcon } from '@/components/icons'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const conceptTracks = tracks.filter((track) => track.section === 'concept')
const focusedTracks = tracks.filter((track) => track.section === 'focused')
const cyberdevopsTracks = tracks.filter((track) => track.section === 'cyberdevops')
const idiomTracks = tracks.filter((track) => track.textLanguages)

type TrackMasterySummary = {
  eligible: boolean
  available: boolean
  challengeCount: number
  totalStars: number
}

export default function TracksPage() {
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showGuestOverlay, setShowGuestOverlay] = useState(false)
  const [openMasterySection, setOpenMasterySection] = useState<string | null>(null)
  const [trackLangsMap, setTrackLangsMap] = useState<Map<string, LanguageMeta[]>>(new Map())
  const [trackMasteryMap, setTrackMasteryMap] = useState<Map<string, TrackMasterySummary>>(new Map())
  const { user } = useAuth()
  const { isPlus } = useUserAccess()
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const { progress } = useProgress()
  const levelInfo = getLevel(progress.totalXP)
  const completedTrackIds = useMemo(() => new Set(progress.completedTrackIds ?? []), [progress.completedTrackIds])

  const dummyLang = getLanguageMetaById(DEFAULT_LANGUAGE) ?? codeLanguageMetas[0]

  useEffect(() => {
    const themeName = getThemePref()
    if (themeName !== currentTheme) queueMicrotask(() => setCurrentTheme(themeName))
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  useEffect(() => {
    let active = true

    void (async () => {
      try {
        const response = await fetch('/api/tracks/catalog', { cache: 'no-store' })
        const payload = (await response.json()) as {
          trackLanguageBadges?: Record<string, LanguageMeta[]>
          trackMasterySummary?: Record<string, TrackMasterySummary>
        }

        if (!active || !response.ok) return
        setTrackLangsMap(new Map(Object.entries(payload.trackLanguageBadges ?? {})))
        setTrackMasteryMap(new Map(Object.entries(payload.trackMasterySummary ?? {})))
      } catch {
        if (!active) return
        setTrackLangsMap(new Map())
        setTrackMasteryMap(new Map())
      }
    })()

    return () => {
      active = false
    }
  }, [])

  function getTrackProgress(snippetIds: string[]): number {
    let completed = 0
    for (const id of snippetIds) {
      for (const languageProgress of Object.values(progress.languages)) {
        if (languageProgress.completedSnippetIds.includes(id)) {
          completed += 1
          break
        }
      }
    }
    return completed
  }

  function getTrackProgressSummary(track: Track) {
    const isCompleted = completedTrackIds.has(track.id)

    if (track.slots && track.slots.length > 0) {
      return {
        completed: isCompleted ? track.slots.length : 0,
        total: track.slots.length,
        isCompleted,
      }
    }

    const snippetTotal = track.snippetIds.length
    const snippetCompleted = snippetTotal > 0 ? getTrackProgress(track.snippetIds) : 0

    if (snippetTotal > 0) {
      return {
        completed: snippetCompleted,
        total: snippetTotal,
        isCompleted,
      }
    }

    return {
      completed: isCompleted ? 1 : 0,
      total: 1,
      isCompleted,
    }
  }

  function openTrack(track: Track) {
    if (!user) {
      setShowGuestOverlay(true)
      return
    }
    router.push(`/tracks/${track.id}`)
  }

  function openMastery(track: Track) {
    if (!user) {
      setShowGuestOverlay(true)
      return
    }
    router.push(isPlus ? `/tracks/${track.id}/mastery` : '/plus')
  }

  function toggleMastery(sectionId: string) {
    setOpenMasterySection((current) => current === sectionId ? null : sectionId)
  }

  return (
    <main className="relative flex min-h-screen flex-1 flex-col">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <Toolbar
          language={dummyLang}
          difficulty={'all' as Difficulty | 'all'}
          seconds={0}
          isTimerRunning={false}
          onLanguageChange={() => {}}
          onDifficultyChange={() => {}}
          showControls={false}
          showLanguage={false}
          onHomeClick={() => router.push('/')}
          onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level}
          streak={progress.streak.current}
          locale={locale}
          onLocaleToggle={toggleLocale}
        />

        <div className="flex flex-1 flex-col items-center px-3 py-4 sm:px-6 sm:py-8">
          <div className="w-full max-w-5xl">
            <h1 className="mb-2 text-2xl font-bold font-[family-name:var(--font-geist-mono)] sm:text-3xl" style={{ color: 'var(--text)' }}>
              {t('pageTracks', locale)}
            </h1>
            <p className="mb-4 text-xs sm:mb-8 sm:text-sm" style={{ color: 'var(--sub)' }}>{t('tracksSubtitle', locale)}</p>

            <CategorySection
              id="idioms"
              title={t('sectionIdioms', locale)}
              description={t('idiomsDesc', locale)}
              tracks={idiomTracks}
              locale={locale}
              isPlus={isPlus}
              isOpen={openMasterySection === 'idioms'}
              masteryMap={trackMasteryMap}
              badgesMap={trackLangsMap}
              getProgress={getTrackProgressSummary}
              onTrackClick={openTrack}
              onMasteryClick={openMastery}
              onToggle={() => toggleMastery('idioms')}
            />

            <CategorySection
              id="concepts"
              title={t('codeSection', locale)}
              description={t('codeTracksDesc', locale)}
              tracks={conceptTracks}
              locale={locale}
              isPlus={isPlus}
              isOpen={openMasterySection === 'concepts'}
              masteryMap={trackMasteryMap}
              badgesMap={trackLangsMap}
              getProgress={getTrackProgressSummary}
              onTrackClick={openTrack}
              onMasteryClick={openMastery}
              onToggle={() => toggleMastery('concepts')}
            />

            <CategorySection
              id="focused"
              title={t('focusedSection', locale)}
              description={t('focusedTracksDesc', locale)}
              tracks={focusedTracks}
              locale={locale}
              isPlus={isPlus}
              isOpen={openMasterySection === 'focused'}
              masteryMap={trackMasteryMap}
              badgesMap={trackLangsMap}
              getProgress={getTrackProgressSummary}
              onTrackClick={openTrack}
              onMasteryClick={openMastery}
              onToggle={() => toggleMastery('focused')}
            />

            <CategorySection
              id="cyberdevops"
              title={t('cyberdevopsSection', locale)}
              description={t('cyberdevopsTracksDesc', locale)}
              tracks={cyberdevopsTracks}
              locale={locale}
              isPlus={isPlus}
              isOpen={openMasterySection === 'cyberdevops'}
              masteryMap={trackMasteryMap}
              badgesMap={trackLangsMap}
              getProgress={getTrackProgressSummary}
              onTrackClick={openTrack}
              onMasteryClick={openMastery}
              onToggle={() => toggleMastery('cyberdevops')}
            />
          </div>
        </div>

        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} locale={locale} />
      </div>

      {showHelp ? <HelpModal onClose={() => setShowHelp(false)} locale={locale} /> : null}
      {showThemeSelector ? <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} /> : null}

      {showGuestOverlay ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl sm:p-8" style={{ backgroundColor: 'var(--bg)', border: '1px solid color-mix(in srgb, var(--sub) 24%, transparent)' }}>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
              <LockIcon size={32} />
            </div>
            <h2 className="mb-2 text-xl font-bold" style={{ color: 'var(--text)' }}>{t('tracksGuestTitle', locale)}</h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>{t('tracksGuestDesc', locale)}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowGuestOverlay(false)} className="flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}>
                {t('cancel', locale)}
              </button>
              <button type="button" onClick={() => router.push('/login')} className="flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
                {t('authSignIn', locale)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
