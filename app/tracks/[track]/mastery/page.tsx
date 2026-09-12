'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import Toolbar from '@/components/typing/Toolbar'
import TrackBreadcrumb from '@/components/typing/TrackBreadcrumb'
import LanguageTabs from '@/components/typing/LanguageTabs'
import PracticeNavButtons from '@/components/typing/PracticeNavButtons'
import HelpModal from '@/components/typing/HelpModal'
import BrandLogo from '@/components/brand/BrandLogo'
import SceneWrapper from '@/components/three/SceneWrapper'
import { getTrackById } from '@/data/tracks'
import { getLanguageMetaById } from '@/data/metadata'
import { getLevel } from '@/lib/gamification'
import { sanitizeSnippetForTyping } from '@/lib/utils'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useLocale } from '@/hooks/useLocale'
import { useProgress } from '@/hooks/useProgress'
import { useIsMobile } from '@/hooks/useMediaQuery'
import type { LanguageMeta, Snippet } from '@/lib/types'

type MasteryPayload = {
  availableLanguages: LanguageMeta[]
  selectedLanguage: LanguageMeta | null
  snippets: Snippet[]
  mastery: {
    eligible: boolean
    available: boolean
    challengeCount: number
    totalStars: number
  }
  error?: string
  code?: string
}

export default function TrackMasteryPage() {
  const params = useParams<{ track: string }>()
  const router = useRouter()
  const { locale, toggleLocale } = useLocale()
  const { progress: userProgress } = useProgress()
  const { enabled: lenient } = useLenientKeyboard()
  const isMobile = useIsMobile()
  const trackId = decodeURIComponent(params.track ?? '')
  const track = getTrackById(trackId)
  const fallbackLanguage = getLanguageMetaById('cpp')!

  const [payload, setPayload] = useState<MasteryPayload | null>(null)
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [showChromeWhileTyping, setShowChromeWhileTyping] = useState(false)

  const currentSnippet = payload?.snippets[currentIndex] ?? null
  const selectedLanguage = payload?.selectedLanguage ?? null
  const languageOptions = useMemo(() => payload?.availableLanguages ?? [], [payload?.availableLanguages])
  const displayCode = useMemo(
    () => sanitizeSnippetForTyping(currentSnippet?.code ?? '', selectedLanguage?.id ?? ''),
    [currentSnippet?.code, selectedLanguage?.id],
  )

  const handleFinish = useCallback(() => {
    if (!currentSnippet) return
    setCompleted((previous) => {
      const next = new Set(previous)
      next.add(currentSnippet.id)
      return next
    })
  }, [currentSnippet])

  const engine = useTypingEngine(displayCode, handleFinish, { lenient })
  const resetEngine = engine.reset
  const isTyping = engine.state.status === 'running'
  const isFocusMode = isTyping && !showChromeWhileTyping

  const loadMastery = useCallback(async (languageId?: string | null) => {
    setLoading(true)
    setError(null)

    const query = languageId ? `?languageId=${encodeURIComponent(languageId)}` : ''
    try {
      const response = await fetch(`/api/tracks/${encodeURIComponent(trackId)}/mastery${query}`, { cache: 'no-store' })
      const data = (await response.json()) as MasteryPayload

      if (!response.ok) {
        if (response.status === 403) {
          router.replace('/plus')
          return
        }
        throw new Error(data.error ?? 'Could not load Mastery.')
      }

      setPayload(data)
      setSelectedLanguageId(data.selectedLanguage?.id ?? null)
      setCurrentIndex(0)
      setShowChromeWhileTyping(false)
      resetEngine()
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load Mastery.')
    } finally {
      setLoading(false)
    }
  }, [resetEngine, router, trackId])

  useEffect(() => {
    void loadMastery()
  }, [loadMastery])

  useEffect(() => {
    if (!isTyping) setShowChromeWhileTyping(false)
  }, [isTyping])

  useEffect(() => {
    if (!isTyping) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      setShowChromeWhileTyping((visible) => !visible)
    }

    window.addEventListener('keydown', handleEscape, true)
    return () => window.removeEventListener('keydown', handleEscape, true)
  }, [isTyping])

  const earnedStars = completed.size * 3
  const totalStars = payload?.mastery.totalStars ?? 0
  const challengeTotal = payload?.snippets.length ?? 0
  const masteryProgress = challengeTotal ? Math.round((completed.size / challengeTotal) * 100) : 0
  const levelInfo = getLevel(userProgress.totalXP)
  const trackName = track?.name[locale] ?? trackId

  function selectChallenge(index: number) {
    if (!payload?.snippets[index]) return
    setCurrentIndex(index)
    setShowChromeWhileTyping(false)
    resetEngine()
  }

  function handlePrev() {
    if (currentIndex <= 0) return
    selectChallenge(currentIndex - 1)
  }

  function handleNext() {
    if (!payload || currentIndex >= payload.snippets.length - 1) return
    selectChallenge(currentIndex + 1)
  }

  function handleRestart() {
    setShowChromeWhileTyping(false)
    resetEngine()
  }

  async function selectLanguage(languageId: string) {
    if (!languageId || languageId === selectedLanguageId) return
    setSelectedLanguageId(languageId)
    setCompleted(new Set())
    setShowChromeWhileTyping(false)
    await loadMastery(languageId)
  }

  return (
    <main className="relative flex h-screen flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <Toolbar
          language={selectedLanguage ?? fallbackLanguage}
          difficulty={currentSnippet?.difficulty ?? 'all'}
          seconds={0}
          isTimerRunning={false}
          onLanguageChange={() => {}}
          onDifficultyChange={() => {}}
          showControls={false}
          showLanguage={false}
          showCommunityBanner={false}
          onHomeClick={() => router.push('/')}
          onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level}
          streak={userProgress.streak.current}
          locale={locale}
          onLocaleToggle={toggleLocale}
          isTyping={isFocusMode}
        />

        {isFocusMode ? (
          <button
            type="button"
            onClick={() => router.push('/')}
            className="absolute left-3 top-3 z-30 cursor-pointer sm:hidden"
            aria-label="SharkType"
          >
            <BrandLogo size={30} textSizeClassName="text-lg" />
          </button>
        ) : null}

        {!isFocusMode ? (
          <>
            <TrackBreadcrumb
              trackName={trackName}
              current={currentIndex + 1}
              total={challengeTotal}
              showProgress={Boolean(currentSnippet)}
              locale={locale}
              isTyping={false}
            />

            <LanguageTabs
              languages={languageOptions}
              selectedId={selectedLanguageId}
              onSelect={(language) => void selectLanguage(language.id)}
              isTyping={false}
            />

            <div className="px-3 pb-3 sm:px-6">
              <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border px-3 py-2.5 text-xs sm:px-4" style={{ borderColor: 'color-mix(in srgb, var(--main) 22%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 78%, transparent)' }}>
                <span className="rounded-full px-2.5 py-1 font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)' }}>
                  ✦ Mastery
                </span>
                <span className="font-medium" style={{ color: 'var(--text)' }}>
                  {locale === 'pt' ? 'Prática avançada' : 'Advanced practice'}
                </span>
                <span className="hidden sm:inline" style={{ color: 'var(--sub)', opacity: 0.45 }}>·</span>
                <span style={{ color: 'var(--sub)' }}>{masteryProgress}%</span>
                <span style={{ color: 'var(--sub)', opacity: 0.45 }}>·</span>
                <span style={{ color: 'var(--main)' }}>{earnedStars}/{totalStars} ★</span>
                <span style={{ color: 'var(--sub)', opacity: 0.45 }}>·</span>
                <span style={{ color: 'var(--sub)' }}>{completed.size}/{challengeTotal} {locale === 'pt' ? 'desafios' : 'challenges'}</span>
                <span className="ml-auto hidden text-[10px] sm:inline" style={{ color: 'var(--sub)', opacity: 0.65 }}>
                  {locale === 'pt' ? 'Comece a digitar para entrar no modo foco' : 'Start typing to enter focus mode'}
                </span>
              </div>
            </div>
          </>
        ) : null}

        <div className={`flex min-h-0 flex-1 flex-col px-3 sm:px-6 ${isFocusMode ? 'pb-3' : 'pb-4'}`}>
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm" style={{ color: 'var(--sub)' }}>
              {locale === 'pt' ? 'Carregando Mastery...' : 'Loading Mastery...'}
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-lg rounded-2xl border p-5 text-center text-sm" style={{ borderColor: 'color-mix(in srgb, var(--error) 28%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 90%, transparent)', color: 'var(--error)' }}>
                {error}
              </div>
            </div>
          ) : currentSnippet && selectedLanguage && payload ? (
            <div className={`mx-auto min-h-0 w-full flex-1 ${isFocusMode ? 'flex max-w-6xl items-center justify-center' : 'grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_272px]'}`}>
              <section className={`min-w-0 ${isFocusMode ? 'w-full' : 'flex min-h-0 flex-col justify-center'}`}>
                {!isFocusMode ? (
                  <div className="mb-4 w-full max-w-3xl min-w-0 sm:mb-6">
                    <SnippetInfo
                      snippet={currentSnippet}
                      languageLabel={selectedLanguage.label}
                      languageColor={selectedLanguage.color}
                      current={currentIndex + 1}
                      total={payload.snippets.length}
                      locale={locale}
                    />
                  </div>
                ) : null}

                <TypingArea
                  key={`${selectedLanguage.id}:${currentSnippet.id}`}
                  code={displayCode}
                  charStatuses={engine.state.charStatuses}
                  currentIndex={engine.state.currentIndex}
                  onKey={engine.handleKey}
                  languageId={selectedLanguage.id}
                  isTyping={isTyping}
                  locale={locale}
                />

                {!isFocusMode ? (
                  <>
                    <div className="mt-3 w-full max-w-3xl text-xs" style={{ color: 'var(--sub)' }}>
                      {engine.wpm} WPM · {engine.accuracy}% · {engine.state.errors} {locale === 'pt' ? 'erros' : 'errors'}
                    </div>
                    <PracticeNavButtons
                      onPrev={handlePrev}
                      onRestart={handleRestart}
                      onNext={handleNext}
                      locale={locale}
                      isTyping={false}
                    />
                  </>
                ) : null}
              </section>

              {!isFocusMode ? (
                <aside className="order-first min-w-0 xl:order-none xl:min-h-0">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--sub)' }}>
                      {locale === 'pt' ? 'Guia Mastery' : 'Mastery guide'}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--sub)' }}>{currentIndex + 1}/{payload.snippets.length}</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 xl:max-h-[calc(100vh-13rem)] xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1">
                    {payload.snippets.map((snippet, index) => {
                      const isCurrent = index === currentIndex
                      const isDone = completed.has(snippet.id)
                      return (
                        <button
                          key={snippet.id}
                          type="button"
                          onClick={() => selectChallenge(index)}
                          className="min-w-[190px] cursor-pointer rounded-xl border p-3 text-left transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 xl:min-w-0 xl:w-full"
                          style={{
                            borderColor: isCurrent ? 'var(--main)' : 'color-mix(in srgb, var(--sub) 16%, transparent)',
                            backgroundColor: isCurrent ? 'color-mix(in srgb, var(--main) 8%, var(--sub-alt))' : 'color-mix(in srgb, var(--sub-alt) 88%, transparent)',
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="min-w-0 text-xs font-semibold leading-5">{index + 1}. {snippet.concept[locale]}</span>
                            <span className="shrink-0 text-xs" style={{ color: isDone ? 'var(--main)' : 'var(--sub)' }}>{isDone ? '★★★' : '☆☆☆'}</span>
                          </div>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--sub)' }}>{snippet.difficulty}</p>
                        </button>
                      )
                    })}
                  </div>
                </aside>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm" style={{ color: 'var(--sub)' }}>
              {locale === 'pt' ? 'Nenhum desafio Mastery disponível.' : 'No Mastery challenges available.'}
            </div>
          )}
        </div>
      </div>

      {showHelp ? <HelpModal onClose={() => setShowHelp(false)} locale={locale} /> : null}
    </main>
  )
}
