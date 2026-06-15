'use client'

import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { languages, textLanguages } from '@/data'
import { getTrackById, type Track } from '@/data/tracks'
import { getLanguageMetaById } from '@/data/metadata'
import { sanitizeSnippetForTyping } from '@/lib/utils'
import { Snippet, Language, LanguageMeta, Difficulty } from '@/lib/types'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useFontScale } from '@/hooks/useFontScale'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, applySessionToProgress, getLevel } from '@/lib/gamification'
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

interface SnippetResult { wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number; wpmSamples: number[]; rawWpmSamples: number[]; errorSamples: number[] }

function getTrackTimerDuration(difficulty: Difficulty | 'all', snippetCount: number): number {
  if (difficulty === 'easy') return 60 + snippetCount * 5
  if (difficulty === 'medium') return 45 + snippetCount * 4
  if (difficulty === 'hard') return 30 + snippetCount * 3
  return 0
}

function getAvailableTrackLanguages(track: Track | null | undefined): Language[] {
  if (!track) return []
  if (track.textLanguages) {
    if (track.snippetIds.length > 0) return textLanguages.filter(l => l.id === 'text-typing')
    return textLanguages.filter(l => l.id !== 'text-typing')
  }

  if (track.slots && track.slots.length > 0) {
    return languages.filter(lang =>
      lang.snippets.some(s => s.slot && track.slots!.includes(s.slot))
    )
  }

  const seen = new Set<string>()
  const result: Language[] = []
  for (const sid of track.snippetIds) {
    for (const lang of languages) {
      if (!seen.has(lang.id) && lang.snippets.find(s => s.id === sid)) {
        seen.add(lang.id)
        result.push(lang)
      }
    }
  }
  return result
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
  const [finalStats, setFinalStats] = useState<SnippetResult | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isResultSyncing, setIsResultSyncing] = useState(false)
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

  // Pending advance flag — set by handleFinish or handleTimerEnd, consumed by useEffect
  const pendingAdvanceRef = useRef(false)
  const timerDurationRef = useRef(timerDuration)

  useEffect(() => {
    timerDurationRef.current = timerDuration
  }, [timerDuration])

  const handleTimerEnd = useCallback(() => {
    playComplete()
    pendingAdvanceRef.current = true
  }, [])

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
    pendingAdvanceRef.current = true
  }, [stopTimer])

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

  // Process snippet completion after engine finishes
  useEffect(() => {
    if (!pendingAdvanceRef.current) return
    if (engine.state.status !== 'finished') return
    pendingAdvanceRef.current = false

    let active = true

    void (async () => {
      const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
      const stats: SnippetResult = {
        wpm: engine.wpm, rawWpm: engine.rawWpm, accuracy: engine.accuracy,
        errors: engine.state.errors, duration: dur,
        wpmSamples: [...engine.wpmSamples], rawWpmSamples: [...engine.rawWpmSamples], errorSamples: [...engine.errorSamples],
      }

      const input = selectedLang && snippet ? {
        languageId: selectedLang.id,
        snippetId: snippet.id,
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        duration: dur,
        difficulty: snippet.difficulty,
        lenient,
      } : null

      const next = [...accumulated, stats]
      if (!active) return

      setAccumulated(next)

      if (seqIndex >= trackSnippets.length - 1) {
        let optimisticOutput: SessionOutput | null = null
        let optimisticXpEarned = 0

        if (input) {
          optimisticOutput = applySessionToProgress(progress, input).output
          optimisticXpEarned = optimisticOutput.xpEarned
          setSessionResult(optimisticOutput)
          setTrackXpEarned((current) => current + optimisticXpEarned)
          setIsResultSyncing(true)
        }

        const avgWpm = Math.round(next.reduce((s, r) => s + r.wpm, 0) / next.length)
        const avgRawWpm = Math.round(next.reduce((s, r) => s + r.rawWpm, 0) / next.length)
        const avgAcc = Math.round(next.reduce((s, r) => s + r.accuracy, 0) / next.length)
        const totalErrors = next.reduce((s, r) => s + r.errors, 0)
        const totalDur = next.reduce((s, r) => s + r.duration, 0)
        setFinalStats({
          wpm: avgWpm,
          rawWpm: avgRawWpm,
          accuracy: avgAcc,
          errors: totalErrors,
          duration: totalDur,
          wpmSamples: next.flatMap(r => r.wpmSamples),
          rawWpmSamples: next.flatMap(r => r.rawWpmSamples),
          errorSamples: next.flatMap(r => r.errorSamples),
        })
        setShowResult(true)

        if (input) {
          void (async () => {
            const output = await recordSession(input)
            if (!active) return
            setSessionResult(output)
            setTrackXpEarned((current) => current - optimisticXpEarned + output.xpEarned)
            setIsResultSyncing(false)
          })()
        }

        // Marcar trilha como concluída no backend
        void fetch('/api/me/progress/track-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackId }),
        }).catch(err => console.error('Failed to record track completion:', err))
      } else {
        if (input) {
          const output = await recordSession(input)
          if (!active) return
          setSessionResult(output)
          setTrackXpEarned((current) => current + output.xpEarned)
        }
        setSeqIndex(i => i + 1)
        resetTimer(timerDurationRef.current)
      }
    })()

    return () => {
      active = false
    }
  }, [accumulated, engine.accuracy, engine.errorSamples, engine.rawWpm, engine.rawWpmSamples, engine.state.errors, engine.state.startTime, engine.state.status, engine.wpm, engine.wpmSamples, lenient, progress, recordSession, resetTimer, selectedLang, seqIndex, snippet, trackId, trackSnippets.length])

  const prevErrors = useRef(0)
  const isTyping = engine.state.status === 'running'

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
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    setTrackXpEarned(0)
    setIsResultSyncing(false)
    resetEngine()
    resetTimer(timerDuration)
  }, [resetEngine, resetTimer, timerDuration])

  const handleRestart = useCallback(() => { resetEngine(); resetTimer(timerDuration) }, [resetEngine, resetTimer, timerDuration])
  const handleNext = useCallback(() => { if (seqIndex < trackSnippets.length - 1) { setSeqIndex(i => i + 1); setIsResultSyncing(false); resetEngine(); resetTimer(timerDuration) } }, [resetEngine, resetTimer, seqIndex, timerDuration, trackSnippets.length])
  const handlePrev = useCallback(() => { if (seqIndex > 0) { setSeqIndex(i => i - 1); setIsResultSyncing(false); resetEngine(); resetTimer(timerDuration) } }, [resetEngine, resetTimer, seqIndex, timerDuration])

  function handleLangChange(lang: LanguageMeta) {
    setIsTrackDataLoading(true)
    setSeqIndex(0)
    setSelectedLang(lang)
    setRequestedLanguageId(lang.id)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    setTrackXpEarned(0)
    setIsResultSyncing(false)
    resetEngine()
    resetTimer(timerDuration)
  }

  function handleDifficultyChange(d: Difficulty | 'all') {
    setDifficulty(d)
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    setTrackXpEarned(0)
    setIsResultSyncing(false)
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
            <ResultScreen wpm={finalStats.wpm} rawWpm={finalStats.rawWpm} accuracy={finalStats.accuracy} errors={finalStats.errors}
              duration={finalStats.duration} snippet={snippet} languageLabel={selectedLang?.label ?? ''} wpmSamples={finalStats.wpmSamples}
              rawWpmSamples={finalStats.rawWpmSamples} errorSamples={finalStats.errorSamples} languageId={selectedLang?.id ?? ''}
              xpEarned={trackXpEarned} rankedPointsEarned={sessionResult?.rankedPointsEarned ?? 0} newLevel={sessionResult?.newLevel ?? levelInfo.level} leveledUp={sessionResult?.leveledUp ?? false}
              levelPercent={sessionResult?.levelPercent ?? getLevel(progress.totalXP).percent} streak={progress.streak.current}
              onNext={handleRestartTrack} isSyncing={isResultSyncing} locale={locale} />
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
