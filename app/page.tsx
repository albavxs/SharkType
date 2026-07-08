'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { getLanguageMetaById } from '@/data/metadata'
import { getBundledLanguageById, loadLanguageById } from '@/data/loaders'
import { generateChallengeSequence, sanitizeSnippetForTyping } from '@/lib/utils'
import { Language, LanguageMeta, Snippet, Difficulty } from '@/lib/types'
import { DEFAULT_LANGUAGE } from '@/lib/constants'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useFontScale } from '@/hooks/useFontScale'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, applySessionToProgress, getLevel, isRankedSession } from '@/lib/gamification'
import { DEFAULT_THEME, getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { playKey, playSpace, playError, playComplete } from '@/lib/sounds'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Toolbar from '@/components/typing/Toolbar'
import AchievementToast from '@/components/gamification/AchievementToast'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import ResultScreen from '@/components/typing/ResultScreen'
import Footer from '@/components/typing/Footer'
import { RefreshIcon } from '@/components/icons'
import CapsLockWarning, { useCapsLock } from '@/components/typing/CapsLockWarning'
import PracticeNavButtons from '@/components/typing/PracticeNavButtons'
import SceneWrapper from '@/components/three/SceneWrapper'
import BrandLogo from '@/components/brand/BrandLogo'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))

const initialBundledLanguage = getBundledLanguageById(DEFAULT_LANGUAGE)

export default function Home() {
  const initialLanguageMeta = getLanguageMetaById(DEFAULT_LANGUAGE)!
  const [selectedLanguageId, setSelectedLanguageId] = useState(DEFAULT_LANGUAGE)
  const [language, setLanguage] = useState<Language | null>(initialBundledLanguage)
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [sequence, setSequence] = useState<Snippet[]>(initialBundledLanguage?.snippets ?? [])
  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const { locale, toggleLocale } = useLocale()
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isLanguageLoading, setIsLanguageLoading] = useState(!initialBundledLanguage)
  const [languageLoadError, setLanguageLoadError] = useState<string | null>(null)
  const [languageReloadKey, setLanguageReloadKey] = useState(0)
  const isMobile = useIsMobile()
  const capsLock = useCapsLock()
  const { progress, recordSession } = useProgress()

  // Init theme + progress on client
  useEffect(() => {
    const themeName = getThemePref()
    if (themeName !== currentTheme) {
      queueMicrotask(() => setCurrentTheme(themeName))
    }
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  const timerDuration = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 45 : difficulty === 'easy' ? 60 : 0
  const isCountdown = difficulty !== 'all'

  const snippet = sequence[seqIndex] || language?.snippets[0] || null
  const displayCode = useMemo(() => {
    const raw = snippet?.code ?? ''
    return sanitizeSnippetForTyping(raw, language?.id ?? selectedLanguageId)
  }, [language?.id, selectedLanguageId, snippet])
  const handleTimerEnd = useCallback(() => { setShowResult(true); playComplete() }, [])

  const { enabled: lenient } = useLenientKeyboard()
  useFontScale() // setta CSS var no mount
  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)
  const {
    seconds: timerSeconds,
    isRunning: isTimerRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = timer
  const handleFinish = useCallback(() => { setShowResult(true); playComplete(); stopTimer() }, [stopTimer])
  const engine = useTypingEngine(displayCode, handleFinish, { lenient })
  const { reset: resetEngine, handleKey: handleEngineKey } = engine

  // Reset timer + engine when difficulty changes
  useEffect(() => { resetEngine(); resetTimer(timerDuration) }, [difficulty, resetEngine, resetTimer, timerDuration])

  useEffect(() => { if (engine.state.status === 'running' && !isTimerRunning) startTimer() }, [engine.state.status, isTimerRunning, startTimer])

  const [finalStats, setFinalStats] = useState<{ wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number; wpmSamples: number[]; rawWpmSamples: number[]; accuracySamples: number[]; errorSamples: number[] } | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isResultSyncing, setIsResultSyncing] = useState(false)

  useEffect(() => {
    let active = true
    const bundledLanguage = getBundledLanguageById(selectedLanguageId)

    if (bundledLanguage) {
      setLanguage(bundledLanguage)
      setSequence((current) => {
        if (
          selectedLanguageId === DEFAULT_LANGUAGE &&
          languageReloadKey === 0 &&
          current.length > 0
        ) {
          return current
        }

        return generateChallengeSequence(bundledLanguage.snippets)
      })
      setSeqIndex(0)
      setIsLanguageLoading(false)
      setLanguageLoadError(null)
      return () => {
        active = false
      }
    }

    void (async () => {
      try {
        const loadedLanguage = await loadLanguageById(selectedLanguageId)
        if (!active) return
        if (!loadedLanguage) {
          setLanguageLoadError(t('loadingSnippetError', locale))
          setIsLanguageLoading(false)
          return
        }
        setLanguage(loadedLanguage)
        setSequence(generateChallengeSequence(loadedLanguage.snippets))
        setSeqIndex(0)
        setIsLanguageLoading(false)
        setLanguageLoadError(null)
      } catch {
        if (!active) return
        setLanguageLoadError(t('loadingSnippetError', locale))
        setIsLanguageLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [locale, selectedLanguageId, languageReloadKey])

  useEffect(() => {
    if (!showResult || !snippet || !language || sessionResult) return

    let active = true

    void (async () => {
      await Promise.resolve()
      if (!active) return

      const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
      const stats = {
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
        languageId: language.id,
        snippetId: snippet.id,
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        duration: dur,
        difficulty: snippet.difficulty,
        lenient,
        rankedMode: difficulty !== 'all',
      }
      const optimisticOutput = applySessionToProgress(progress, input).output

      setFinalStats(stats)
      setSessionResult(optimisticOutput)
      setIsResultSyncing(true)

      const output = await recordSession(input)
      if (active) {
        setSessionResult(output)
        setIsResultSyncing(false)
      }
    })()

    return () => {
      active = false
    }
  }, [engine.accuracy, engine.accuracySamples, engine.errorSamples, engine.rawWpm, engine.rawWpmSamples, engine.state.errors, engine.state.startTime, engine.wpm, engine.wpmSamples, language, lenient, progress, recordSession, sessionResult, showResult, snippet])

  const handleRestart = useCallback(() => { resetEngine(); resetTimer(timerDuration); setShowResult(false); setSessionResult(null); setFinalStats(null); setIsResultSyncing(false) }, [resetEngine, resetTimer, timerDuration])
  const handleNext = useCallback(() => { setSeqIndex(i => (i + 1) % sequence.length); setShowResult(false); setSessionResult(null); setFinalStats(null); setIsResultSyncing(false); resetTimer(timerDuration) }, [sequence.length, resetTimer, timerDuration])
  function handlePrev() { setSeqIndex(i => i > 0 ? i - 1 : sequence.length - 1); setShowResult(false); setSessionResult(null); setFinalStats(null); setIsResultSyncing(false); resetTimer(timerDuration) }
  function handleLanguageChange(lang: LanguageMeta) {
    setIsLanguageLoading(true)
    setLanguageLoadError(null)
    setSelectedLanguageId(lang.id)
    setSeqIndex(0)
    resetEngine()
    resetTimer(timerDuration)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setIsResultSyncing(false)
  }
  function handleDifficultyChange(nextDifficulty: Difficulty | 'all') {
    setDifficulty(nextDifficulty)
    setSequence(generateChallengeSequence(language?.snippets ?? []))
    setSeqIndex(0)
    resetEngine()
    resetTimer(nextDifficulty === 'hard' ? 30 : nextDifficulty === 'medium' ? 45 : nextDifficulty === 'easy' ? 60 : 0)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setIsResultSyncing(false)
  }

  useKeyboardShortcuts(useMemo(() => ({ Tab: showResult ? handleNext : handleRestart, ShiftTab: handleRestart, Escape: () => { setShowThemeSelector(false); setShowHelp(false) } }), [handleNext, handleRestart, showResult]), true)

  const prevErrors = useRef(0)
  const wrappedHandleKey = useCallback((key: string) => { if (key === ' ' || key === 'Enter') playSpace(); else playKey(); handleEngineKey(key) }, [handleEngineKey])
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

  const displaySeconds = isCountdown ? timerSeconds : engine.state.startTime ? elapsedSeconds : 0
  const levelInfo = getLevel(progress.totalXP)
  const sessionMode = isRankedSession(
    language?.id ?? selectedLanguageId,
    lenient,
    difficulty !== 'all'
  ) ? 'ranked' : 'precision'

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Toolbar language={language ?? initialLanguageMeta} difficulty={difficulty} seconds={displaySeconds}
          isTimerRunning={isTimerRunning} onLanguageChange={handleLanguageChange}
          onDifficultyChange={handleDifficultyChange} onHomeClick={handleRestart} onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level} streak={progress.streak.current}
          locale={locale} onLocaleToggle={toggleLocale} isTyping={engine.state.status === 'running'} />

        {/* Main */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 pb-3 sm:px-6 sm:pb-0 min-w-0">
          {languageLoadError ? (
            <div className="w-full max-w-lg rounded-2xl border px-4 py-4 text-center" style={{ borderColor: 'color-mix(in srgb, var(--error) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--error) 10%, transparent)' }}>
              <p className="text-sm" style={{ color: 'var(--error)' }}>
                {languageLoadError}
              </p>
              <button
                onClick={() => {
                  setIsLanguageLoading(true)
                  setLanguageLoadError(null)
                  setLanguageReloadKey((value) => value + 1)
                }}
                className="mt-4 rounded-xl px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
              >
                {t('retry', locale)}
              </button>
            </div>
          ) : isLanguageLoading || !language || !snippet ? (
            <div className="text-sm" style={{ color: 'var(--sub)' }}>
              {t('loading', locale)}
            </div>
          ) : showResult && sessionResult && finalStats ? (
            <ResultScreen wpm={finalStats.wpm} accuracy={finalStats.accuracy} errors={finalStats.errors}
              duration={finalStats.duration} snippet={snippet} languageLabel={language.label} sessionMode={sessionMode} wpmSamples={finalStats.wpmSamples}
              rawWpmSamples={finalStats.rawWpmSamples} accuracySamples={finalStats.accuracySamples} errorSamples={finalStats.errorSamples} languageId={language.id}
              xpEarned={sessionResult.xpEarned} rankedPointsEarned={sessionResult.rankedPointsEarned} newLevel={sessionResult.newLevel}
              leveledUp={sessionResult.leveledUp} levelPercent={sessionResult.levelPercent} streak={sessionResult.streak}
              onNext={handleNext} onRestart={handleRestart} locale={locale} />
          ) : (
            <>
              <div className={`w-full max-w-3xl min-w-0 mb-4 sm:mb-6 transition-all duration-300 ${engine.state.status === 'running' ? 'opacity-0 pointer-events-none' : ''}`}>
                <SnippetInfo snippet={snippet} languageLabel={language.label} languageColor={language.color}
                  current={seqIndex + 1} total={sequence.length} locale={locale} />
              </div>

              {/* Mobile: logo + reset above code while typing */}
              {engine.state.status === 'running' && isMobile && (
                <div className="mb-4 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
                  <button onClick={handleRestart}
                    className="active:scale-95 transition-all duration-150"
                  >
                    <BrandLogo size={24} textSizeClassName="text-base" />
                  </button>
                  <button onClick={handleRestart}
                    className="p-1.5 rounded-full active:scale-90 transition-all duration-150"
                    style={{ color: 'var(--sub)' }}>
                    <RefreshIcon size={14} />
                  </button>
                </div>
              )}

              {/* Caps Lock warning — desktop: above text */}
              <CapsLockWarning visible={capsLock && !showResult && !isMobile} isMobile={false} locale={locale} />

              <TypingArea key={`${language.id}:${snippet.id}`} code={displayCode} charStatuses={engine.state.charStatuses} currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey} disabled={showResult} languageId={language.id} isTyping={engine.state.status === 'running'} locale={locale} />

              {/* Caps Lock warning — mobile: below text */}
              <CapsLockWarning visible={capsLock && !showResult && !!isMobile} isMobile={true} locale={locale} />

              {engine.state.status === 'running' && (
                <div className="mt-3 text-center text-[10px] animate-fade-in sm:text-left" style={{ color: 'var(--sub)', opacity: 0.4 }}>
                  <span>{t('hintShiftTab', locale)}</span>
                </div>
              )}

              <PracticeNavButtons onPrev={handlePrev} onRestart={handleRestart} onNext={handleNext} locale={locale} isTyping={engine.state.status === 'running'} />
            </>
          )}
        </div>

        {/* Footer */}
        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} isTyping={engine.state.status === 'running'} locale={locale} />
      </div>

      {/* Modals */}
      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}
      <AchievementToast newlyUnlocked={sessionResult?.newlyUnlocked ?? []} locale={locale} />
    </main>
  )
}
