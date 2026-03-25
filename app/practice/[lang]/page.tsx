'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useRef } from 'react'
import { getLanguageById } from '@/data'
import { getRandomSnippet } from '@/lib/utils'
import { Mode, Snippet } from '@/lib/types'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { SessionOutput } from '@/lib/gamification'
import ThemeToggle from '@/components/ThemeToggle'
import TypingArea from '@/components/TypingArea'
import StatsBar from '@/components/StatsBar'
import ProgressBar from '@/components/ProgressBar'
import ResultCard from '@/components/ResultCard'
import WPMGraph from '@/components/WPMGraph'
import { ArrowLeftIcon, RefreshIcon, ArrowRightIcon } from '@/components/icons'

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const langId = params.lang as string
  const language = getLanguageById(langId)

  const [mode, setMode] = useState<Mode>('snippet')
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const [wpmHistory, setWpmHistory] = useState<number[]>([])
  const wpmHistoryRef = useRef<number[]>([])
  const wpmSampleRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { recordSession } = useProgress()

  // Initialize snippet
  useEffect(() => {
    if (language && !snippet) {
      setSnippet(getRandomSnippet(language.snippets))
    }
  }, [language, snippet])

  const timerDuration = mode === 'timed_30' ? 30 : mode === 'timed_60' ? 60 : 0
  const isCountdown = mode !== 'snippet'

  const handleFinish = useCallback(() => {
    setShowResult(true)
    timer.stop()
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTimerEnd = useCallback(() => {
    setShowResult(true)
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current)
  }, [])

  const engine = useTypingEngine(snippet?.code ?? '', handleFinish)
  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)

  // Start timer + WPM sampling on first keypress
  useEffect(() => {
    if (engine.state.status === 'running' && !timer.isRunning) {
      timer.start()
      // Start WPM sampling
      wpmHistoryRef.current = [engine.wpm]
      setWpmHistory([engine.wpm])
      wpmSampleRef.current = setInterval(() => {
        wpmHistoryRef.current = [...wpmHistoryRef.current, engine.wpm]
        setWpmHistory([...wpmHistoryRef.current])
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.state.status])

  // Record session when showing result
  useEffect(() => {
    if (showResult && snippet && language && !sessionResult) {
      const duration = engine.state.startTime
        ? Math.floor((Date.now() - engine.state.startTime) / 1000)
        : 0
      const result = recordSession({
        languageId: langId,
        snippetId: snippet.id,
        wpm: engine.wpm,
        accuracy: engine.accuracy,
        errors: engine.state.errors,
        duration,
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
    setWpmHistory([])
    wpmHistoryRef.current = []
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current)
  }

  function handleNext() {
    if (!language || !snippet) return
    const next = getRandomSnippet(language.snippets, snippet.id)
    setSnippet(next)
    setShowResult(false)
    setSessionResult(null)
    setWpmHistory([])
    wpmHistoryRef.current = []
    timer.reset(timerDuration)
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current)
  }

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    engine.reset()
    const dur = newMode === 'timed_30' ? 30 : newMode === 'timed_60' ? 60 : 0
    timer.reset(dur)
    setShowResult(false)
    setSessionResult(null)
    setWpmHistory([])
    wpmHistoryRef.current = []
    if (wpmSampleRef.current) clearInterval(wpmSampleRef.current)
  }

  if (!language) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Linguagem nao encontrada.</p>
      </main>
    )
  }

  if (!snippet) return null

  const displaySeconds = isCountdown
    ? timer.seconds
    : engine.state.startTime
      ? Math.floor((Date.now() - engine.state.startTime) / 1000)
      : 0

  const duration = engine.state.startTime
    ? Math.floor((Date.now() - engine.state.startTime) / 1000)
    : 0

  return (
    <main className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-neutral-500 light:text-neutral-400 transition-colors duration-150 hover:text-white light:hover:text-black"
          >
            <ArrowLeftIcon size={14} />
            Voltar
          </button>
          <span className="text-sm text-neutral-500 light:text-neutral-400">
            {language.label}
          </span>
          <ThemeToggle />
        </div>

        {/* Progress */}
        <ProgressBar current={engine.state.currentIndex} total={snippet.code.length} />

        {/* Stats */}
        <StatsBar
          wpm={engine.wpm}
          accuracy={engine.accuracy}
          seconds={displaySeconds}
          isRunning={engine.state.status === 'running'}
        />

        {/* WPM Graph */}
        <WPMGraph history={wpmHistory} />

        {/* Typing area */}
        <TypingArea
          code={snippet.code}
          charStatuses={engine.state.charStatuses}
          currentIndex={engine.state.currentIndex}
          onKey={engine.handleKey}
          disabled={showResult}
          languageId={langId}
          concept={snippet.concept}
          difficulty={snippet.difficulty}
          languageColor={language.color}
        />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['timed_30', 'timed_60', 'snippet'] as Mode[]).map((m) => {
              const label = m === 'timed_30' ? '30s' : m === 'timed_60' ? '60s' : 'Livre'
              return (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors duration-150 ${
                    mode === m
                      ? 'border-white light:border-black text-white light:text-black'
                      : 'border-neutral-800 light:border-neutral-200 text-neutral-500 light:text-neutral-400 hover:border-neutral-600 light:hover:border-neutral-400'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="p-2 rounded-md border border-neutral-800 light:border-neutral-200 text-neutral-500 light:text-neutral-400 transition-colors duration-150 hover:border-neutral-600 light:hover:border-neutral-400 hover:text-white light:hover:text-black"
              aria-label="Reiniciar"
            >
              <RefreshIcon size={14} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-md border border-neutral-800 light:border-neutral-200 text-neutral-500 light:text-neutral-400 transition-colors duration-150 hover:border-neutral-600 light:hover:border-neutral-400 hover:text-white light:hover:text-black"
              aria-label="Proximo snippet"
            >
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="flex gap-4 justify-center text-[10px] text-neutral-700 light:text-neutral-300">
          <span>Tab = indentacao</span>
          <span>Enter = nova linha</span>
          <span>Backspace = apagar</span>
        </div>
      </div>

      {/* Result modal */}
      {showResult && sessionResult && (
        <ResultCard
          wpm={engine.wpm}
          accuracy={engine.accuracy}
          errors={engine.state.errors}
          duration={duration}
          snippet={snippet}
          language={language.label}
          onRestart={handleRestart}
          onNext={handleNext}
          xpEarned={sessionResult.xpEarned}
          newLevel={sessionResult.newLevel}
          leveledUp={sessionResult.leveledUp}
          levelPercent={sessionResult.levelPercent}
          streak={sessionResult.streak}
        />
      )}
    </main>
  )
}
