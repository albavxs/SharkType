'use client'

import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { getTrackById } from '@/data/tracks'
import { getLanguageMetaById } from '@/data/metadata'
import { sanitizeSnippetForTyping } from '@/lib/utils'
import { Snippet, LanguageMeta, Difficulty } from '@/lib/types'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useFontScale } from '@/hooks/useFontScale'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, applySessionToProgress, getLevel, isRankedSession } from '@/lib/gamification'
import { DEFAULT_THEME, getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { playKey, playSpace, playError, playComplete } from '@/lib/sounds'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import ResultScreen from '@/components/typing/ResultScreen'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import TrackBreadcrumb from '@/components/typing/TrackBreadcrumb'
import LanguageTabs from '@/components/typing/LanguageTabs'
import PracticeNavButtons from '@/components/typing/PracticeNavButtons'
import CapsLockWarning, { useCapsLock } from '@/components/typing/CapsLockWarning'
const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const AchievementToast = dynamic(() => import('@/components/gamification/AchievementToast'), { ssr: false })

interface SnippetResult { wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number; wpmSamples: number[]; rawWpmSamples: number[]; accuracySamples: number[]; errorSamples: number[] }
type SnippetFinalizationReason = 'completed' | 'timeout'

interface PendingSnippetFinalization {
  runId: number
  seqIndex: number
  reason: SnippetFinalizationReason
}

function getTrackTimerDuration(difficulty: Difficulty | 'all', snippetCount: number): number {
  if (difficulty === 'easy') return 60 + snippetCount * 5
  if (difficulty === 'medium') return 45 + snippetCount * 4
  if (difficulty === 'hard') return 30 + snippetCount * 3
  return 0
}

export default function TrackPracticePage() {
  const params = useParams()
  const router = useRouter()
  const trackId = params.track as string
  const track = getTrackById(trackId)
  const fallbackLanguage = getLanguageMetaById('cpp')!

  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [selectedLang, setSelectedLang] = useState<LanguageMeta | null>(null)
  const [requestedLanguageId, setRequestedLanguageId] = useState<string | null>(null)
  const [availableLanguages, setAvailableLanguages] = useState<LanguageMeta[]>([])
  const [trackSnippets, setTrackSnippets] = useState<Snippet[]>([])
  const [isTrackDataLoading, setIsTrackDataLoading] = useState(true)
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [accumulated, setAccumulated] = useState<SnippetResult[]>([])
  const [trackXpEarned, setTrackXpEarned] = useState(0)
  const [trackRankedPointsEarned, setTrackRankedPointsEarned] = useState(0)
  const [trackLeveledUp, setTrackLeveledUp] = useState(false)
  const [finalStats, setFinalStats] = useState<SnippetResult | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isResultSyncing, setIsResultSyncing] = useState(false)
  const [pendingSnippetFinalization, setPendingSnippetFinalization] = useState<PendingSnippetFinalization | null>(null)
  const { progress, recordSession } = useProgress()
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const capsLock = useCapsLock()

  const levelInfo = getLevel(progress.totalXP)

  const snippet = trackSnippets[seqIndex] ?? null

  // Timer — dynamic per-snippet duration based on difficulty + snippet count
  const snippetCount = trackSnippets.length
  const timerDuration = useMemo(() => getTrackTimerDuration(difficulty, snippetCount), [difficulty, snippetCount])
  const isCountdown = difficulty !== 'all'

  const trackRunIdRef = useRef(0)
  const finalizedSnippetKeyRef = useRef<string | null>(null)
  const sessionSaveQueueRef = useRef<Promise<void>>(Promise.resolve())
  const pendingSaveCountRef = useRef(0)
  const optimisticProgressRef = useRef(progress)
  const timerDurationRef = useRef(timerDuration)

  useEffect(() => {
    timerDurationRef.current = timerDuration
  }, [timerDuration])

  useEffect(() => {
    if (pendingSaveCountRef.current === 0 && accumulated.length === 0 && !showResult) {
      optimisticProgressRef.current = progress
    }
  }, [accumulated.length, progress, showResult])

  const resetTrackRunState = useCallback(() => {
    trackRunIdRef.current += 1
    finalizedSnippetKeyRef.current = null
    setPendingSnippetFinalization(null)
  }, [])

  const requestSnippetFinalization = useCallback((reason: SnippetFinalizationReason) => {
    const snippetId = snippet?.id
    if (!snippetId) return

    const snippetKey = `${trackRunIdRef.current}:${seqIndex}:${snippetId}`
    if (finalizedSnippetKeyRef.current === snippetKey) return

    finalizedSnippetKeyRef.current = snippetKey
    setPendingSnippetFinalization({
      runId: trackRunIdRef.current,
      seqIndex,
      reason,
    })
  }, [seqIndex, snippet?.id])

  const handleTimerEnd = useCallback(() => {
    playComplete()
    requestSnippetFinalization('timeout')
  }, [requestSnippetFinalization])

  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)
  const {
    seconds: timerSeconds,
    isRunning: isTimerRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = timer

  const handleFinish = useCallback(() => {
    playComplete()
    stopTimer()
    requestSnippetFinalization('completed')
  }, [requestSnippetFinalization, stopTimer])

  useEffect(() => {
    if (!track) {
      return
    }

    let active = true

    void (async () => {
      const suffix = requestedLanguageId ? `?languageId=${encodeURIComponent(requestedLanguageId)}` : ''
      const response = await fetch(`/api/tracks/${trackId}/practice${suffix}`, { cache: 'no-store' })
      const payload = (await response.json()) as {
        availableLanguages?: LanguageMeta[]
        selectedLanguage?: LanguageMeta | null
        snippets?: Snippet[]
      }

      if (!active) return

      if (!response.ok) {
        setAvailableLanguages([])
        setSelectedLang(null)
        setTrackSnippets([])
        setIsTrackDataLoading(false)
        return
      }

      setAvailableLanguages(payload.availableLanguages ?? [])
      setSelectedLang(payload.selectedLanguage ?? null)
      setTrackSnippets(payload.snippets ?? [])
      setIsTrackDataLoading(false)
    })()

    return () => {
      active = false
    }
  }, [track, trackId, requestedLanguageId])

  const displayCode = useMemo(() => {
    const raw = snippet?.code ?? ''
    return sanitizeSnippetForTyping(raw, selectedLang?.id ?? '')
  }, [selectedLang?.id, snippet])

  const { enabled: lenient } = useLenientKeyboard()
  useFontScale() // apenas pra setar a CSS var no mount
  const engine = useTypingEngine(displayCode, handleFinish, { lenient })
  const { reset: resetEngine, handleKey: handleEngineKey } = engine

  // Start timer when typing starts
  useEffect(() => {
    if (engine.state.status === 'running' && isCountdown && !isTimerRunning) {
      startTimer()
    }
  }, [engine.state.status, isCountdown, isTimerRunning, startTimer])

  useEffect(() => {
    if (!pendingSnippetFinalization) return
    if (pendingSnippetFinalization.runId !== trackRunIdRef.current) {
      setPendingSnippetFinalization(null)
      return
    }

    if (pendingSnippetFinalization.reason === 'completed' && engine.state.status !== 'finished') {
      return
    }

    const finalizedSnippet = trackSnippets[pendingSnippetFinalization.seqIndex] ?? null
    if (!selectedLang || !finalizedSnippet) {
      setPendingSnippetFinalization(null)
      return
    }

    setPendingSnippetFinalization(null)

    const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
    const stats: SnippetResult = {
      wpm: engine.wpm,
      rawWpm: engine.rawWpm,
      accuracy: engine.accuracy,
      errors: engine.state.errors,
      duration: dur,
      wpmSamples: [...engine.wpmSamples],
      rawWpmSamples: [...engine.rawWpmSamples],
      accuracySamples: [...engine.accuracySamples],
      errorSamples: [...engine.errorSamples],
    }

    const input = {
      languageId: selectedLang.id,
      snippetId: finalizedSnippet.id,
      wpm: stats.wpm,
      rawWpm: stats.rawWpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      duration: dur,
      difficulty: finalizedSnippet.difficulty,
      lenient,
    }

    const optimisticResult = applySessionToProgress(optimisticProgressRef.current, input)
    optimisticProgressRef.current = optimisticResult.progress

    setTrackXpEarned((current) => current + optimisticResult.output.xpEarned)
    setTrackRankedPointsEarned((current) => current + optimisticResult.output.rankedPointsEarned)
    setTrackLeveledUp((current) => current || optimisticResult.output.leveledUp)

    const runId = pendingSnippetFinalization.runId
    const isLastSnippet = pendingSnippetFinalization.seqIndex >= trackSnippets.length - 1

    pendingSaveCountRef.current += 1
    sessionSaveQueueRef.current = sessionSaveQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        const output = await recordSession(input)
        if (runId !== trackRunIdRef.current) return

        if (isLastSnippet) {
          setSessionResult(output)
          setTrackLeveledUp((current) => current || output.leveledUp)
          setIsResultSyncing(false)
          return
        }

        setSessionResult(output)
      })
      .catch((error) => {
        console.error('Failed to persist track session:', error)
        if (runId === trackRunIdRef.current && isLastSnippet) {
          setIsResultSyncing(false)
        }
      })
      .finally(() => {
        pendingSaveCountRef.current = Math.max(0, pendingSaveCountRef.current - 1)
      })

    const nextResults = [...accumulated, stats]
    setAccumulated(nextResults)

    if (isLastSnippet) {
      const avgWpm = Math.round(nextResults.reduce((sum, result) => sum + result.wpm, 0) / nextResults.length)
      const avgRawWpm = Math.round(nextResults.reduce((sum, result) => sum + result.rawWpm, 0) / nextResults.length)
      const avgAcc = Math.round(nextResults.reduce((sum, result) => sum + result.accuracy, 0) / nextResults.length)
      const totalErrors = nextResults.reduce((sum, result) => sum + result.errors, 0)
      const totalDur = nextResults.reduce((sum, result) => sum + result.duration, 0)

      setFinalStats({
        wpm: avgWpm,
        rawWpm: avgRawWpm,
        accuracy: avgAcc,
        errors: totalErrors,
        duration: totalDur,
        wpmSamples: nextResults.flatMap((result) => result.wpmSamples),
        rawWpmSamples: nextResults.flatMap((result) => result.rawWpmSamples),
        accuracySamples: nextResults.flatMap((result) => result.accuracySamples),
        errorSamples: nextResults.flatMap((result) => result.errorSamples),
      })
      setSessionResult(optimisticResult.output)
      setIsResultSyncing(true)
      setShowResult(true)

      // Marcar trilha como concluída no backend
      void fetch('/api/me/progress/track-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId }),
      }).catch(err => console.error('Failed to record track completion:', err))
      return
    }

    setSessionResult(null)
    setElapsedSeconds(0)
    resetEngine()
    setSeqIndex(pendingSnippetFinalization.seqIndex + 1)
    resetTimer(timerDurationRef.current)
  }, [accumulated, engine.accuracy, engine.accuracySamples, engine.errorSamples, engine.rawWpm, engine.rawWpmSamples, engine.state.errors, engine.state.startTime, engine.state.status, engine.wpm, engine.wpmSamples, lenient, recordSession, resetEngine, resetTimer, selectedLang, pendingSnippetFinalization, trackId, trackSnippets])

  const prevErrors = useRef(0)
  const isTyping = engine.state.status === 'running'
  const sessionMode = isRankedSession(selectedLang?.id ?? '', lenient) ? 'ranked' : 'precision'

  useEffect(() => {
    const themeName = getThemePref()
    if (themeName !== currentTheme) {
      queueMicrotask(() => setCurrentTheme(themeName))
    }
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  useEffect(() => { if (engine.state.errors > prevErrors.current) { playError() }; prevErrors.current = engine.state.errors }, [engine.state.errors])

  useEffect(() => {
    if (isCountdown || !engine.state.startTime || showResult) return

    const updateElapsed = () => {
      setElapsedSeconds(Math.floor((Date.now() - engine.state.startTime!) / 1000))
    }

    updateElapsed()
    const intervalId = window.setInterval(updateElapsed, 1000)
    return () => window.clearInterval(intervalId)
  }, [engine.state.startTime, isCountdown, showResult])

  const handleRestartTrack = useCallback(() => {
    resetTrackRunState()
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    setTrackXpEarned(0)
    setTrackRankedPointsEarned(0)
    setTrackLeveledUp(false)
    setIsResultSyncing(false)
    resetEngine()
    resetTimer(timerDuration)
    setElapsedSeconds(0)
  }, [resetEngine, resetTimer, resetTrackRunState, timerDuration])

  const handleRestart = useCallback(() => {
    resetTrackRunState()
    setSessionResult(null)
    setIsResultSyncing(false)
    setElapsedSeconds(0)
    resetEngine()
    resetTimer(timerDuration)
  }, [resetEngine, resetTimer, resetTrackRunState, timerDuration])

  const handleNext = useCallback(() => {
    if (seqIndex < trackSnippets.length - 1) {
      resetTrackRunState()
      setSeqIndex(i => i + 1)
      setSessionResult(null)
      setIsResultSyncing(false)
      setElapsedSeconds(0)
      resetEngine()
      resetTimer(timerDuration)
    }
  }, [resetEngine, resetTimer, resetTrackRunState, seqIndex, timerDuration, trackSnippets.length])

  const handlePrev = useCallback(() => {
    if (seqIndex > 0) {
      resetTrackRunState()
      setSeqIndex(i => i - 1)
      setSessionResult(null)
      setIsResultSyncing(false)
      setElapsedSeconds(0)
      resetEngine()
      resetTimer(timerDuration)
    }
  }, [resetEngine, resetTimer, resetTrackRunState, seqIndex, timerDuration])

  function handleLangChange(lang: LanguageMeta) {
    resetTrackRunState()
    setIsTrackDataLoading(true)
    setSeqIndex(0)
    setSelectedLang(lang)
    setRequestedLanguageId(lang.id)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    setTrackXpEarned(0)
    setTrackRankedPointsEarned(0)
    setTrackLeveledUp(false)
    setIsResultSyncing(false)
    setElapsedSeconds(0)
    resetEngine()
    resetTimer(timerDuration)
  }

  function handleDifficultyChange(d: Difficulty | 'all') {
    resetTrackRunState()
    setDifficulty(d)
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    setTrackXpEarned(0)
    setTrackRankedPointsEarned(0)
    setTrackLeveledUp(false)
    setIsResultSyncing(false)
    setElapsedSeconds(0)
    resetEngine()
    const newDur = getTrackTimerDuration(d, snippetCount)
    resetTimer(newDur)
  }

  useKeyboardShortcuts(useMemo(() => ({ Tab: showResult ? handleRestartTrack : handleRestart, ShiftTab: handleRestart, Escape: () => setShowThemeSelector(false) }), [handleRestart, handleRestartTrack, showResult]), true)

  const wrappedHandleKey = useCallback((key: string) => { if (key === ' ' || key === 'Enter') playSpace(); else playKey(); handleEngineKey(key) }, [handleEngineKey])

  const displaySeconds = isCountdown ? timerSeconds : engine.state.startTime ? elapsedSeconds : 0

  if (!track) {
    return <main className="flex-1 flex items-center justify-center"><p style={{ color: 'var(--sub)' }}>{t('trackNotFound', locale)}</p></main>
  }

  return (
    <main className="flex flex-col h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <Toolbar
          language={selectedLang ?? fallbackLanguage} difficulty={difficulty}
          seconds={displaySeconds} isTimerRunning={isTimerRunning}
          onLanguageChange={() => {}} onDifficultyChange={handleDifficultyChange}
          showControls={!(track.textLanguages && track.snippetIds.length > 0)}
          showLanguage={false}
          onHomeClick={() => router.push('/')} onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level} streak={progress.streak.current}
          locale={locale} onLocaleToggle={toggleLocale}
          isTyping={isTyping}
        />

        <TrackBreadcrumb
          trackName={track.name[locale]}
          current={seqIndex + 1}
          total={trackSnippets.length}
          showProgress={!!snippet}
          locale={locale}
          isTyping={isTyping}
        />

        <LanguageTabs
          languages={availableLanguages}
          selectedId={selectedLang?.id ?? null}
          onSelect={handleLangChange}
          isTyping={isTyping}
        />

        <div className="flex-1 flex flex-col items-center justify-center px-3 pb-3 sm:px-6 sm:pb-0 min-h-0 min-w-0">
          {isTrackDataLoading ? (
            <p style={{ color: 'var(--sub)' }}>{t('loading', locale)}</p>
          ) : !snippet ? (
            <p style={{ color: 'var(--sub)' }}>{t('loading', locale)}</p>
          ) : showResult && finalStats ? (
            <ResultScreen wpm={finalStats.wpm} accuracy={finalStats.accuracy} errors={finalStats.errors}
              duration={finalStats.duration} snippet={snippet} languageLabel={selectedLang?.label ?? ''} sessionMode={sessionMode} wpmSamples={finalStats.wpmSamples}
              rawWpmSamples={finalStats.rawWpmSamples} accuracySamples={finalStats.accuracySamples} errorSamples={finalStats.errorSamples} languageId={selectedLang?.id ?? ''}
              xpEarned={trackXpEarned} rankedPointsEarned={trackRankedPointsEarned} newLevel={sessionResult?.newLevel ?? levelInfo.level} leveledUp={trackLeveledUp}
              levelPercent={sessionResult?.levelPercent ?? getLevel(progress.totalXP).percent} streak={sessionResult?.streak ?? progress.streak.current}
              onNext={handleRestartTrack} onRestart={handleRestartTrack} locale={locale} />
          ) : (
            <>
              {/* Prompt — hide when typing */}
              <div className={`w-full max-w-3xl min-w-0 mb-4 sm:mb-6 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
                <SnippetInfo snippet={snippet} languageLabel={selectedLang?.label ?? ''} languageColor={selectedLang?.color ?? '#888'} current={seqIndex + 1} total={trackSnippets.length} locale={locale} />
              </div>
              {/* Caps Lock warning — desktop: above text */}
              <CapsLockWarning visible={capsLock && !showResult && !isMobile} isMobile={false} locale={locale} />

              <TypingArea key={`${selectedLang?.id ?? 'unknown'}:${snippet.id}`} code={displayCode} charStatuses={engine.state.charStatuses} currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey} disabled={showResult} languageId={selectedLang?.id ?? ''} isTyping={isTyping} locale={locale} />

              {/* Caps Lock warning — mobile: below text */}
              <CapsLockWarning visible={capsLock && !showResult && !!isMobile} isMobile={true} locale={locale} />

              {isTyping && (
                <div className="mt-3 text-center text-[10px] animate-fade-in sm:text-left" style={{ color: 'var(--sub)', opacity: 0.4 }}>
                  {t('hintShiftTab', locale)}
                </div>
              )}
              <PracticeNavButtons onPrev={handlePrev} onRestart={handleRestart} onNext={handleNext} locale={locale} isTyping={isTyping} />
            </>
          )}
        </div>

      </div>

      <div className="relative z-10 shrink-0">
        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} isTyping={isTyping} locale={locale} />
      </div>

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}
      <AchievementToast newlyUnlocked={sessionResult?.newlyUnlocked ?? []} locale={locale} />
    </main>
  )
}
