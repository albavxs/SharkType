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
import { playKey, playError, playComplete } from '@/lib/sounds'
import Toolbar from '@/components/typing/Toolbar'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import KeyboardHints from '@/components/typing/KeyboardHints'
import ResultScreen from '@/components/typing/ResultScreen'
import SceneWrapper from '@/components/three/SceneWrapper'
import { FlameIcon, ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'

export default function Home() {
  const [language, setLanguage] = useState<Language>(
    () => getLanguageById(DEFAULT_LANGUAGE)!
  )
  const [mode, setMode] = useState<Mode>('snippet')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [sequence, setSequence] = useState<Snippet[]>([])
  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const [lastKeyTime, setLastKeyTime] = useState(0)
  const [lastErrorTime, setLastErrorTime] = useState(0)
  const [clientProgress, setClientProgress] = useState<UserProgress | null>(null)
  const isMobile = useIsMobile()

  const { recordSession } = useProgress()

  // Hydration-safe: load progress only on client
  useEffect(() => {
    setClientProgress(loadProgress())
  }, [showResult]) // refresh after session too

  // Generate sequence when language or difficulty changes
  useEffect(() => {
    const filtered = difficulty === 'all'
      ? language.snippets
      : language.snippets.filter(s => s.difficulty === difficulty)
    const pool = filtered.length > 0 ? filtered : language.snippets
    setSequence(generateChallengeSequence(pool))
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
  }, [language, difficulty])

  const snippet = sequence[seqIndex] || language.snippets[0]

  const timerDuration = mode === 'timed_30' ? 30 : mode === 'timed_60' ? 60 : 0
  const isCountdown = mode !== 'snippet'

  const handleFinish = useCallback(() => {
    setShowResult(true)
    playComplete()
    timer.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTimerEnd = useCallback(() => {
    setShowResult(true)
    playComplete()
  }, [])

  const engine = useTypingEngine(snippet?.code ?? '', handleFinish)
  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)

  useEffect(() => {
    if (engine.state.status === 'running' && !timer.isRunning) {
      timer.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.state.status])

  useEffect(() => {
    if (showResult && snippet && !sessionResult) {
      const dur = engine.state.startTime
        ? Math.floor((Date.now() - engine.state.startTime) / 1000)
        : 0
      const result = recordSession({
        languageId: language.id,
        snippetId: snippet.id,
        wpm: engine.wpm,
        accuracy: engine.accuracy,
        errors: engine.state.errors,
        duration: dur,
        difficulty: snippet.difficulty,
      })
      setSessionResult(result)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult])

  function handleRestart() {
    engine.reset()
    timer.reset(timerDuration)
    setShowResult(false)
    setSessionResult(null)
  }

  function handleNext() {
    setSeqIndex(i => (i + 1) % sequence.length)
    setShowResult(false)
    setSessionResult(null)
    timer.reset(timerDuration)
  }

  function handlePrev() {
    setSeqIndex(i => i > 0 ? i - 1 : sequence.length - 1)
    setShowResult(false)
    setSessionResult(null)
    timer.reset(timerDuration)
  }

  function handleLanguageChange(lang: Language) {
    setLanguage(lang)
    engine.reset()
    timer.reset(timerDuration)
    setShowResult(false)
    setSessionResult(null)
  }

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    engine.reset()
    timer.reset(newMode === 'timed_30' ? 30 : newMode === 'timed_60' ? 60 : 0)
    setShowResult(false)
    setSessionResult(null)
  }

  function handleHomeClick() {
    handleRestart()
  }

  useKeyboardShortcuts(
    useMemo(() => ({
      Tab: showResult ? handleNext : handleRestart,
    }), [showResult]),
    true
  )

  // Sound + Three.js tracking
  const prevErrors = useMemo(() => ({ current: 0 }), [])
  const wrappedHandleKey = useCallback((key: string) => {
    setLastKeyTime(Date.now())
    playKey()
    engine.handleKey(key)
  }, [engine])

  useEffect(() => {
    if (engine.state.errors > prevErrors.current) {
      setLastErrorTime(Date.now())
      playError()
    }
    prevErrors.current = engine.state.errors
  }, [engine.state.errors, prevErrors])

  const duration = engine.state.startTime
    ? Math.floor((Date.now() - engine.state.startTime) / 1000)
    : 0

  const displaySeconds = isCountdown
    ? timer.seconds
    : engine.state.startTime
      ? Math.floor((Date.now() - engine.state.startTime) / 1000)
      : 0

  const levelInfo = clientProgress ? getLevel(clientProgress.totalXP) : null

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && (
        <SceneWrapper wpm={engine.wpm} lastKeyTime={lastKeyTime} lastErrorTime={lastErrorTime} />
      )}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={language}
          mode={mode}
          difficulty={difficulty}
          seconds={displaySeconds}
          isTimerRunning={timer.isRunning}
          onLanguageChange={handleLanguageChange}
          onModeChange={handleModeChange}
          onDifficultyChange={setDifficulty}
          onHomeClick={handleHomeClick}
        />

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {showResult && sessionResult ? (
            <ResultScreen
              wpm={engine.wpm}
              rawWpm={engine.rawWpm}
              accuracy={engine.accuracy}
              errors={engine.state.errors}
              duration={duration}
              snippet={snippet}
              languageLabel={language.label}
              wpmSamples={engine.wpmSamples}
              rawWpmSamples={engine.rawWpmSamples}
              xpEarned={sessionResult.xpEarned}
              newLevel={sessionResult.newLevel}
              leveledUp={sessionResult.leveledUp}
              levelPercent={sessionResult.levelPercent}
              streak={sessionResult.streak}
            />
          ) : (
            <>
              <div className="w-full max-w-3xl mb-6">
                <SnippetInfo
                  snippet={snippet}
                  languageLabel={language.label}
                  languageColor={language.color}
                  current={seqIndex + 1}
                  total={sequence.length}
                />
              </div>

              <TypingArea
                code={snippet.code}
                charStatuses={engine.state.charStatuses}
                currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey}
                disabled={showResult}
                languageId={language.id}
                isTyping={engine.state.status === 'running'}
              />

              <div className="w-full max-w-3xl mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={handlePrev} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#4a4d52] text-[#646669] hover:text-[#d1d0c5] hover:border-[#646669] transition-colors">
                    <ArrowLeftIcon size={12} /> Anterior
                  </button>
                  <button onClick={handleRestart} className="p-1.5 rounded border border-[#4a4d52] text-[#646669] hover:text-[#d1d0c5] hover:border-[#646669] transition-colors" aria-label="Reiniciar">
                    <RefreshIcon size={12} />
                  </button>
                  <button onClick={handleNext} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#4a4d52] text-[#646669] hover:text-[#d1d0c5] hover:border-[#646669] transition-colors">
                    Proximo <ArrowRightIcon size={12} />
                  </button>
                </div>

                {engine.state.status === 'running' && (
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#646669] tabular-nums">{engine.wpm}</span>
                    <span className="text-xs text-[#4a4d52] ml-1">wpm</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 text-xs text-[#646669]">
            {clientProgress && clientProgress.totalXP > 0 && levelInfo && (
              <>
                <span>Lv {levelInfo.level}</span>
                <span>{clientProgress.totalXP} XP</span>
                {clientProgress.streak.current > 0 && (
                  <span className="flex items-center gap-1 text-[#a78bfa]">
                    <FlameIcon size={10} />
                    {clientProgress.streak.current}d
                  </span>
                )}
              </>
            )}
          </div>
          <KeyboardHints />
        </div>
      </div>
    </main>
  )
}
