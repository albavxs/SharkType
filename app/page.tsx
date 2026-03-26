'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { getLanguageById } from '@/data'
import { generateChallengeSequence } from '@/lib/utils'
import { Mode, Language, Snippet, Difficulty } from '@/lib/types'
import { DEFAULT_LANGUAGE } from '@/lib/constants'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, UserProgress, loadProgress, getLevel } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { playKey, playError, playComplete } from '@/lib/sounds'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Toolbar from '@/components/typing/Toolbar'
import ModePill from '@/components/typing/ModePill'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import ResultScreen from '@/components/typing/ResultScreen'
import Footer from '@/components/typing/Footer'
import ThemeSelector from '@/components/typing/ThemeSelector'
import HelpModal from '@/components/typing/HelpModal'
import SceneWrapper from '@/components/three/SceneWrapper'
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => getLanguageById(DEFAULT_LANGUAGE)!)
  const [mode, setMode] = useState<Mode>('snippet')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [sequence, setSequence] = useState<Snippet[]>([])
  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const [clientProgress, setClientProgress] = useState<UserProgress | null>(null)
  const { locale, toggleLocale } = useLocale()
  const [currentTheme, setCurrentTheme] = useState('serika dark')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const isMobile = useIsMobile()
  const { recordSession } = useProgress()

  // Init theme + progress on client
  useEffect(() => {
    const themeName = getThemePref()
    setCurrentTheme(themeName)
    applyTheme(getTheme(themeName))
    setClientProgress(loadProgress())
  }, [])

  // Refresh progress after result
  useEffect(() => { if (showResult) setClientProgress(loadProgress()) }, [showResult])

  useEffect(() => {
    const filtered = difficulty === 'all' ? language.snippets : language.snippets.filter(s => s.difficulty === difficulty)
    const pool = filtered.length > 0 ? filtered : language.snippets
    setSequence(generateChallengeSequence(pool))
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
  }, [language, difficulty])

  const snippet = sequence[seqIndex] || language.snippets[0]
  const timerDuration = mode === 'timed_30' ? 30 : mode === 'timed_60' ? 60 : 0
  const isCountdown = mode !== 'snippet'

  const handleFinish = useCallback(() => { setShowResult(true); playComplete(); timer.stop() }, [])
  const handleTimerEnd = useCallback(() => { setShowResult(true); playComplete() }, [])

  const engine = useTypingEngine(snippet?.code ?? '', handleFinish)
  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)

  useEffect(() => { if (engine.state.status === 'running' && !timer.isRunning) timer.start() }, [engine.state.status])

  useEffect(() => {
    if (showResult && snippet && !sessionResult) {
      const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
      setSessionResult(recordSession({ languageId: language.id, snippetId: snippet.id, wpm: engine.wpm, accuracy: engine.accuracy, errors: engine.state.errors, duration: dur, difficulty: snippet.difficulty }))
    }
  }, [showResult])

  function handleRestart() { engine.reset(); timer.reset(timerDuration); setShowResult(false); setSessionResult(null) }
  function handleNext() { setSeqIndex(i => (i + 1) % sequence.length); setShowResult(false); setSessionResult(null); timer.reset(timerDuration) }
  function handlePrev() { setSeqIndex(i => i > 0 ? i - 1 : sequence.length - 1); setShowResult(false); setSessionResult(null); timer.reset(timerDuration) }
  function handleLanguageChange(lang: Language) { setLanguage(lang); engine.reset(); timer.reset(timerDuration); setShowResult(false); setSessionResult(null) }
  function handleModeChange(m: Mode) { setMode(m); engine.reset(); timer.reset(m === 'timed_30' ? 30 : m === 'timed_60' ? 60 : 0); setShowResult(false); setSessionResult(null) }

  useKeyboardShortcuts(useMemo(() => ({ Tab: showResult ? handleNext : handleRestart, Escape: () => { setShowThemeSelector(false); setShowHelp(false) } }), [showResult]), true)

  const prevErrors = useMemo(() => ({ current: 0 }), [])
  const wrappedHandleKey = useCallback((key: string) => { playKey(); engine.handleKey(key) }, [engine])
  useEffect(() => { if (engine.state.errors > prevErrors.current) { playError() }; prevErrors.current = engine.state.errors }, [engine.state.errors])

  const displaySeconds = isCountdown ? timer.seconds : engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
  const duration = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
  const levelInfo = clientProgress ? getLevel(clientProgress.totalXP) : null
  const isTextMode = language.id.startsWith('text-')

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Toolbar language={language} mode={mode} difficulty={difficulty} seconds={displaySeconds}
          isTimerRunning={timer.isRunning} onLanguageChange={handleLanguageChange} onModeChange={handleModeChange}
          onDifficultyChange={setDifficulty} onHomeClick={handleRestart} onHelpClick={() => setShowHelp(true)}
          level={levelInfo?.level ?? null} streak={clientProgress?.streak.current ?? 0}
          locale={locale} onLocaleToggle={toggleLocale} />

        {/* Mode pill */}
        <div className="flex justify-center mb-4">
          <ModePill language={language} mode={mode} difficulty={difficulty} seconds={displaySeconds}
            isTimerRunning={timer.isRunning} onLanguageChange={handleLanguageChange} onModeChange={handleModeChange}
            onDifficultyChange={setDifficulty} locale={locale} />
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {showResult && sessionResult ? (
            <ResultScreen wpm={engine.wpm} rawWpm={engine.rawWpm} accuracy={engine.accuracy} errors={engine.state.errors}
              duration={duration} snippet={snippet} languageLabel={language.label} wpmSamples={engine.wpmSamples}
              rawWpmSamples={engine.rawWpmSamples} xpEarned={sessionResult.xpEarned} newLevel={sessionResult.newLevel}
              leveledUp={sessionResult.leveledUp} levelPercent={sessionResult.levelPercent} streak={sessionResult.streak}
              onNext={handleNext} locale={locale} />
          ) : (
            <>
              {!isTextMode && (
                <div className="w-full max-w-3xl mb-6">
                  <SnippetInfo snippet={snippet} languageLabel={language.label} languageColor={language.color}
                    current={seqIndex + 1} total={sequence.length} />
                </div>
              )}

              <TypingArea code={snippet.code} charStatuses={engine.state.charStatuses} currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey} disabled={showResult} languageId={language.id} isTyping={engine.state.status === 'running'} locale={locale} />

              <div className="w-full max-w-3xl mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={handlePrev} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-opacity hover:opacity-80"
                    style={{ border: '1px solid var(--sub)', color: 'var(--sub)' }}>
                    <ArrowLeftIcon size={12} /> {t('prev', locale)}
                  </button>
                  <button onClick={handleRestart} className="p-1.5 rounded transition-opacity hover:opacity-80"
                    style={{ border: '1px solid var(--sub)', color: 'var(--sub)' }} aria-label={t('restart', locale)}>
                    <RefreshIcon size={12} />
                  </button>
                  <button onClick={handleNext} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-opacity hover:opacity-80"
                    style={{ border: '1px solid var(--sub)', color: 'var(--sub)' }}>
                    {t('next', locale)} <ArrowRightIcon size={12} />
                  </button>
                </div>
                {engine.state.status === 'running' && (
                  <div className="text-right">
                    <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--sub)' }}>{engine.wpm}</span>
                    <span className="text-xs ml-1" style={{ color: 'var(--sub)', opacity: 0.5 }}>wpm</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} />
      </div>

      {/* Modals */}
      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </main>
  )
}
