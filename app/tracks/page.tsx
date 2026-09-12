'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tracks, Track } from '@/data/tracks'
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
import { LanguageMeta, Difficulty } from '@/lib/types'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'
import { LockIcon } from '@/components/icons'
import { isMasteryEligible, toMasteryTrack, type TrackMasterySummary, type TrackCategory } from '@/lib/mastery'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const conceptTracks = tracks.filter(t => t.section === 'concept')
const focusedTracks = tracks.filter(t => t.section === 'focused')
const cyberdevopsTracks = tracks.filter(t => t.section === 'cyberdevops')
const codeTracks = [...conceptTracks, ...focusedTracks, ...cyberdevopsTracks]
const idiomTracks = tracks.filter(t => t.textLanguages)

type UserAccessPayload = {
  access?: {
    isPlus?: boolean
  }
}

function buildCategory(input: {
  id: string
  title: TrackCategory['title']
  description: TrackCategory['description']
  tracks: Track[]
  masteryMap: Map<string, TrackMasterySummary>
  isPlus: boolean
}): TrackCategory {
  const masteryTracks = input.tracks
    .filter((track) => isMasteryEligible(input.masteryMap.get(track.id)))
    .map((track, index) => toMasteryTrack({
      track,
      categoryId: input.id,
      masterySummary: input.masteryMap.get(track.id),
      isPlus: input.isPlus,
      level: (index % 4) + 1,
    }))

  return {
    id: input.id,
    title: input.title,
    description: input.description,
    tracks: input.tracks,
    mastery: masteryTracks.length > 0
      ? {
          eligible: true,
          tracks: masteryTracks,
          totalChallenges: masteryTracks.reduce((sum, track) => sum + track.challengeCount, 0),
          totalStars: masteryTracks.reduce((sum, track) => sum + (track.totalStars ?? 0), 0),
        }
      : undefined,
  }
}

export default function TracksPage() {
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showGuestOverlay, setShowGuestOverlay] = useState(false)
  const [trackLangsMap, setTrackLangsMap] = useState<Map<string, LanguageMeta[]>>(new Map())
  const [trackMasteryMap, setTrackMasteryMap] = useState<Map<string, TrackMasterySummary>>(new Map())
  const [isPlus, setIsPlus] = useState(false)
  const [activeMasterySection, setActiveMasterySection] = useState<string | null>(null)
  const { user } = useAuth()
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const { progress } = useProgress()
  const levelInfo = getLevel(progress.totalXP)
  const completedTrackIds = useMemo(() => new Set(progress.completedTrackIds ?? []), [progress.completedTrackIds])

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
        const payload = (await response.json()) as {
          trackLanguageBadges?: Record<string, LanguageMeta[]>
          trackMasterySummary?: Record<string, TrackMasterySummary>
        }
        if (!active || !response.ok) return
        setTrackLangsMap(new Map(Object.entries(payload.trackLanguageBadges ?? {})))
        setTrackMasteryMap(new Map(Object.entries(payload.trackMasterySummary ?? {})))
      } catch {
        if (active) {
          setTrackLangsMap(new Map())
          setTrackMasteryMap(new Map())
        }
      }
    })()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setIsPlus(false))
      return
    }

    let active = true
    void (async () => {
      try {
        const response = await fetch('/api/me/access', { cache: 'no-store' })
        const payload = (await response.json()) as UserAccessPayload
        if (!active) return
        setIsPlus(response.ok && payload.access?.isPlus === true)
      } catch {
        if (active) setIsPlus(false)
      }
    })()

    return () => {
      active = false
    }
  }, [user])

  function getTrackProgress(snippetIds: string[]): number {
    let completed = 0
    for (const id of snippetIds) {
      for (const lp of Object.values(progress.languages)) {
        if (lp.completedSnippetIds.includes(id)) { completed++; break }
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

  function getSectionStats(sectionTracks: Track[]) {
    let total = 0
    let completed = 0
    for (const track of sectionTracks) {
      const summary = getTrackProgressSummary(track)
      total += summary.total
      completed += summary.completed
    }
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, pct }
  }

  const codeStats = getSectionStats(codeTracks)

  const trackCategories = useMemo(() => [
    buildCategory({
      id: 'idioms',
      title: { pt: t('sectionIdioms', 'pt'), en: t('sectionIdioms', 'en') },
      description: { pt: t('idiomsDesc', 'pt'), en: t('idiomsDesc', 'en') },
      tracks: idiomTracks,
      masteryMap: trackMasteryMap,
      isPlus,
    }),
    buildCategory({
      id: 'concepts',
      title: { pt: t('codeSection', 'pt'), en: t('codeSection', 'en') },
      description: { pt: t('codeTracksDesc', 'pt'), en: t('codeTracksDesc', 'en') },
      tracks: conceptTracks,
      masteryMap: trackMasteryMap,
      isPlus,
    }),
    buildCategory({
      id: 'focused',
      title: { pt: t('focusedSection', 'pt'), en: t('focusedSection', 'en') },
      description: { pt: t('focusedTracksDesc', 'pt'), en: t('focusedTracksDesc', 'en') },
      tracks: focusedTracks,
      masteryMap: trackMasteryMap,
      isPlus,
    }),
    buildCategory({
      id: 'cyberdevops',
      title: { pt: t('cyberdevopsSection', 'pt'), en: t('cyberdevopsSection', 'en') },
      description: { pt: t('cyberdevopsTracksDesc', 'pt'), en: t('cyberdevopsTracksDesc', 'en') },
      tracks: cyberdevopsTracks,
      masteryMap: trackMasteryMap,
      isPlus,
    }),
  ], [trackMasteryMap, isPlus])

  function openTrack(trackId: string) {
    if (!user) {
      setShowGuestOverlay(true)
      return
    }
    router.push(`/tracks/${trackId}`)
  }

  function openMasteryTrack(trackId: string) {
    if (!user) {
      setShowGuestOverlay(true)
      return
    }
    router.push(`/tracks/${trackId}/mastery`)
  }

  function handleMasteryToggle(categoryId: string) {
    setActiveMasterySection((current) => current === categoryId ? null : categoryId)
  }

  function TrackCard({ track, badges }: { track: Track; badges: LanguageMeta[] }) {
    const progressSummary = getTrackProgressSummary(track)

    return (
      <button
        onClick={() => openTrack(track.id)}
        className="block w-full min-w-0 cursor-pointer rounded-xl p-4 text-left transition-all duration-150 hover:brightness-110 hover:scale-[1.02] active:scale-95 sm:p-5"
        style={{ backgroundColor: 'var(--sub-alt)' }}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>{track.name[locale]}</div>
          {progressSummary.isCompleted ? (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
            >
              {t('completed', locale)}
            </span>
          ) : (
            <span
              className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sub) 8%, transparent)',
                borderColor: 'color-mix(in srgb, var(--sub) 22%, transparent)',
                color: 'var(--sub)',
              }}
            >
              {t('trackAccessFree', locale)}
            </span>
          )}
        </div>
        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--sub)' }}>{track.description[locale]}</div>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {badges.map(lang => (
              <span key={lang.id} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: lang.color + '22', color: lang.color, border: `1px solid ${lang.color}44` }}>
                {lang.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-3 text-[11px] font-medium" style={{ color: progressSummary.isCompleted ? 'var(--main)' : 'var(--sub)' }}>
          {progressSummary.total > 1
            ? `${progressSummary.completed}/${progressSummary.total} ${t('completed', locale)}`
            : progressSummary.isCompleted
              ? t('completed', locale)
              : `0/${progressSummary.total} ${t('completed', locale)}`}
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
          showLanguage={false}
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

            {trackCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                locale={locale}
                isPlus={isPlus}
                isMasteryOpen={activeMasterySection === category.id}
                onMasteryToggle={() => handleMasteryToggle(category.id)}
                renderTrackCard={(track) => (
                  <TrackCard key={track.id} track={track} badges={trackLangsMap.get(track.id) ?? []} />
                )}
                onOpenMastery={openMasteryTrack}
                onOpenPlus={() => router.push('/plus')}
                footer={category.id === 'cyberdevops' && codeStats.total > 0 ? (
                  <div className="mt-4 text-xs" style={{ color: 'var(--sub)' }}>
                    {codeStats.completed}/{codeStats.total} {t('completed', locale)} · {codeStats.pct}%
                  </div>
                ) : null}
              />
            ))}
          </div>
        </div>

        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} locale={locale} />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}

      {showGuestOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl sm:p-8"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid color-mix(in srgb, var(--sub) 24%, transparent)' }}
          >
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}
            >
              <LockIcon size={32} />
            </div>
            <h2 className="mb-2 text-xl font-bold" style={{ color: 'var(--text)' }}>
              {t('tracksGuestTitle', locale)}
            </h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>
              {t('tracksGuestDesc', locale)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGuestOverlay(false)}
                className="flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}
              >
                {t('cancel', locale)}
              </button>
              <button
                onClick={() => router.push('/login')}
                className="flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
              >
                {t('tracksGuestButton', locale)}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
