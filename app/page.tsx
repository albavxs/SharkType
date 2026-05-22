'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { getLanguageById } from '@/data'
import { generateChallengeSequence, stripCodeComments } from '@/lib/utils'
import { Language, Snippet, Difficulty } from '@/lib/types'
import { DEFAULT_LANGUAGE } from '@/lib/constants'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useFontScale } from '@/hooks/useFontScale'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, getLevel } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { playKey, playSpace, playError, playComplete } from '@/lib/sounds'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Toolbar from '@/components/typing/Toolbar'

import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import ResultScreen from '@/components/typing/ResultScreen'
import Footer from '@/components/typing/Footer'
import StreakToast from '@/components/gamification/StreakToast'
import AchievementToast from '@/components/gamification/AchievementToast'
import ThemeSelector from '@/components/typing/ThemeSelector'
import HelpModal from '@/components/typing/HelpModal'
import SceneWrapper from '@/components/three/SceneWrapper'
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon, XIcon } from '@/components/icons'
import CapsLockWarning, { useCapsLock } from '@/components/typing/CapsLockWarning'

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => getLanguageById(DEFAULT_LANGUAGE)!)
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [sequence, setSequence] = useState<Snippet[]>([])
  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const { locale, toggleLocale } = useLocale()
  const [currentTheme, setCurrentTheme] = useState('dracula')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const isMobile = useIsMobile()
  const capsLock = useCapsLock()
  const { progress, recordSession } = useProgress()

  // Init theme + progress on client
  useEffect(() => {
    const themeName = getThemePref()
    setCurrentTheme(themeName)
    applyTheme(getTheme(themeName))
  }, [])

  const timerDuration = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 45 : difficulty === 'easy' ? 60 : 0
  const isCountdown = difficulty !== 'all'

  useEffect(() => {
    const pool = language.snippets
    setSequence(generateChallengeSequence(pool))
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
  }, [language, difficulty])

  const snippet = sequence[seqIndex] || language.snippets[0]
  const displayCode = useMemo(() => {
    const raw = snippet?.code ?? ''
    return difficulty === 'all' ? raw : stripCodeComments(raw)
  }, [snippet, difficulty])

  const handleFinish = useCallback(() => { setShowResult(true); playComplete(); timer.stop() }, [])
  const handleTimerEnd = useCallback(() => { setShowResult(true); playComplete() }, [])

  const { enabled: lenient } = useLenientKeyboard()
  useFontScale() // setta CSS var no mount
  const engine = useTypingEngine(displayCode, handleFinish, { lenient })
  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)

  // Reset timer + engine when difficulty changes
  useEffect(() => { engine.reset(); timer.reset(timerDuration) }, [difficulty])

  useEffect(() => { if (engine.state.status === 'running' && !timer.isRunning) timer.start() }, [engine.state.status])

  const [finalStats, setFinalStats] = useState<{ wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number; wpmSamples: number[]; rawWpmSamples: number[] } | null>(null)

  useEffect(() => {
    if (showResult && snippet && !sessionResult) {
      let active = true

      const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
      const stats = { wpm: engine.wpm, rawWpm: engine.rawWpm, accuracy: engine.accuracy, errors: engine.state.errors, duration: dur, wpmSamples: [...engine.wpmSamples], rawWpmSamples: [...engine.rawWpmSamples] }
      setFinalStats(stats)

      void (async () => {
        const output = await recordSession({ languageId: language.id, snippetId: snippet.id, wpm: stats.wpm, accuracy: stats.accuracy, errors: stats.errors, duration: dur, difficulty: snippet.difficulty })
        if (active) setSessionResult(output)
      })()

      return () => {
        active = false
      }
    }
  }, [showResult])

  function handleRestart() { engine.reset(); timer.reset(timerDuration); setShowResult(false); setSessionResult(null); setFinalStats(null) }
  function handleNext() { setSeqIndex(i => (i + 1) % sequence.length); setShowResult(false); setSessionResult(null); setFinalStats(null); timer.reset(timerDuration) }
  function handlePrev() { setSeqIndex(i => i > 0 ? i - 1 : sequence.length - 1); setShowResult(false); setSessionResult(null); setFinalStats(null); timer.reset(timerDuration) }
  function handleLanguageChange(lang: Language) { setLanguage(lang); engine.reset(); timer.reset(timerDuration); setShowResult(false); setSessionResult(null); setFinalStats(null) }

  useKeyboardShortcuts(useMemo(() => ({ Tab: showResult ? handleNext : handleRestart, ShiftTab: handleRestart, Escape: () => { setShowThemeSelector(false); setShowHelp(false) } }), [showResult]), true)

  const prevErrors = useMemo(() => ({ current: 0 }), [])
  const wrappedHandleKey = useCallback((key: string) => { if (key === ' ' || key === 'Enter') playSpace(); else playKey(); engine.handleKey(key) }, [engine])
  useEffect(() => { if (engine.state.errors > prevErrors.current) { playError() }; prevErrors.current = engine.state.errors }, [engine.state.errors])

  const displaySeconds = isCountdown ? timer.seconds : engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
  const levelInfo = getLevel(progress.totalXP)
  const isTextMode = language.id.startsWith('text-')

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Toolbar language={language} difficulty={difficulty} seconds={displaySeconds}
          isTimerRunning={timer.isRunning} onLanguageChange={handleLanguageChange}
          onDifficultyChange={setDifficulty} onHomeClick={handleRestart} onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level} streak={progress.streak.current}
          locale={locale} onLocaleToggle={toggleLocale} isTyping={engine.state.status === 'running'} />

        {/* Main */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6">
          {showResult && sessionResult && finalStats ? (
            <ResultScreen wpm={finalStats.wpm} rawWpm={finalStats.rawWpm} accuracy={finalStats.accuracy} errors={finalStats.errors}
              duration={finalStats.duration} snippet={snippet} languageLabel={language.label} wpmSamples={finalStats.wpmSamples}
              rawWpmSamples={finalStats.rawWpmSamples} xpEarned={sessionResult.xpEarned} newLevel={sessionResult.newLevel}
              leveledUp={sessionResult.leveledUp} levelPercent={sessionResult.levelPercent} streak={sessionResult.streak}
              onNext={handleNext} locale={locale} />
          ) : (
            <>
              {!isTextMode && (
                <div className={`w-full max-w-3xl mb-6 transition-all duration-300 ${engine.state.status === 'running' ? 'opacity-0 pointer-events-none' : ''}`}>
                  <SnippetInfo snippet={snippet} languageLabel={language.label} languageColor={language.color}
                    current={seqIndex + 1} total={sequence.length} locale={locale} />
                </div>
              )}

              {/* Mobile: logo + reset above code while typing */}
              {engine.state.status === 'running' && isMobile && (
                <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
                  <button onClick={handleRestart}
                    className="text-base font-bold font-[family-name:var(--font-geist-mono)] active:scale-95 transition-all duration-150"
                    style={{ color: 'var(--text)' }}>
                    Shark<span style={{ color: 'var(--main)' }}>Type</span>
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

              <TypingArea code={displayCode} charStatuses={engine.state.charStatuses} currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey} disabled={showResult} languageId={language.id} isTyping={engine.state.status === 'running'} locale={locale} />

              {/* Caps Lock warning — mobile: below text */}
              <CapsLockWarning visible={capsLock && !showResult && !!isMobile} isMobile={true} locale={locale} />

              {engine.state.status === 'running' && (
                <div className="mt-3 text-[10px] animate-fade-in" style={{ color: 'var(--sub)', opacity: 0.4 }}>
                  <span className="hidden sm:inline">{t('hintShiftTab', locale)}</span>
                </div>
              )}

              <div className={`w-full max-w-3xl mt-6 flex justify-center transition-all duration-300 ${engine.state.status === 'running' ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-4">
                  <button onClick={handlePrev} className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
                    style={{ color: 'var(--sub)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
                    aria-label={t('prev', locale)} title={t('prev', locale)}>
                    <ArrowLeftIcon size={18} />
                  </button>
                  <button onClick={handleRestart} className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
                    style={{ color: 'var(--sub)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
                    aria-label={t('restart', locale)} title={t('restart', locale)}>
                    <RefreshIcon size={18} />
                  </button>
                  <button onClick={handleNext} className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
                    style={{ color: 'var(--sub)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
                    aria-label={t('next', locale)} title={t('next', locale)}>
                    <ArrowRightIcon size={18} />
                  </button>
                </div>
              </div>
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
      <StreakToast streak={progress.streak.current} locale={locale} />
      <AchievementToast newlyUnlocked={sessionResult?.newlyUnlocked ?? []} locale={locale} />
    </main>
  )
}
