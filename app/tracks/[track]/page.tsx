'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { getTrackById } from '@/data/tracks'
import { textLanguages, languages } from '@/data'
import { Snippet, Language, Difficulty } from '@/lib/types'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useTimer } from '@/hooks/useTimer'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, UserProgress, loadProgress, getLevel } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { playKey, playSpace, playError, playComplete } from '@/lib/sounds'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import ResultScreen from '@/components/typing/ResultScreen'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import ThemeSelector from '@/components/typing/ThemeSelector'
import SceneWrapper from '@/components/three/SceneWrapper'
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'
import CapsLockWarning, { useCapsLock } from '@/components/typing/CapsLockWarning'
import Link from 'next/link'

interface SnippetResult { wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number; wpmSamples: number[]; rawWpmSamples: number[] }

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

  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const [currentTheme, setCurrentTheme] = useState('dracula')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [clientProgress, setClientProgress] = useState<UserProgress | null>(null)
  const [selectedLang, setSelectedLang] = useState<Language | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [accumulated, setAccumulated] = useState<SnippetResult[]>([])
  const [finalStats, setFinalStats] = useState<SnippetResult | null>(null)
  const { recordSession } = useProgress()
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const capsLock = useCapsLock()

  const levelInfo = clientProgress ? getLevel(clientProgress.totalXP) : null

  // Available languages for this track
  const availableLanguages = useMemo(() => {
    if (!track) return []
    if (track.textLanguages) {
      if (track.snippetIds.length > 0) return textLanguages.filter(l => l.id === 'text-typing')
      return textLanguages.filter(l => l.id !== 'text-typing')
    }
    // Slot-based tracks: find languages that have at least one snippet matching any slot
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
  }, [track])

  // Snippets for selected language, filtered by difficulty
  const trackSnippets = useMemo((): Snippet[] => {
    if (!track || !selectedLang) return []
    let snippets: Snippet[]
    // Slot-based tracks: find one snippet per slot in order
    if (track.slots && track.slots.length > 0) {
      snippets = track.slots
        .map(slot => selectedLang.snippets.find(s => s.slot === slot))
        .filter((s): s is Snippet => Boolean(s))
    } else if (track.textLanguages) {
      if (track.snippetIds.length > 0) {
        snippets = track.snippetIds
          .map(sid => selectedLang.snippets.find(s => s.id === sid))
          .filter((s): s is Snippet => Boolean(s))
      } else {
        snippets = track.difficultyFilter
          ? selectedLang.snippets.filter(s => s.difficulty === track.difficultyFilter)
          : selectedLang.snippets
      }
    } else {
      snippets = track.snippetIds
        .map(sid => selectedLang.snippets.find(s => s.id === sid))
        .filter((s): s is Snippet => Boolean(s))
    }
    if (difficulty !== 'all') {
      const filtered = snippets.filter(s => s.difficulty === difficulty)
      if (filtered.length > 0) return filtered
    }
    return snippets
  }, [track, selectedLang, difficulty])

  const snippet = trackSnippets[seqIndex] ?? null
  const isLastSnippet = seqIndex >= trackSnippets.length - 1

  // Timer — dynamic per-snippet duration based on difficulty + snippet count
  const snippetCount = trackSnippets.length
  const timerDuration = useMemo(() => getTrackTimerDuration(difficulty, snippetCount), [difficulty, snippetCount])
  const isCountdown = difficulty !== 'all'

  // Pending advance flag — set by handleFinish or handleTimerEnd, consumed by useEffect
  const pendingAdvanceRef = useRef(false)
  const timerDurationRef = useRef(timerDuration)
  timerDurationRef.current = timerDuration

  const handleTimerEnd = useCallback(() => {
    playComplete()
    pendingAdvanceRef.current = true
  }, [])

  const timer = useTimer(timerDuration, isCountdown, handleTimerEnd)

  const handleFinish = useCallback(() => {
    playComplete()
    timer.stop()
    pendingAdvanceRef.current = true
  }, [timer])

  const engine = useTypingEngine(snippet?.code ?? '', handleFinish)

  // Start timer when typing starts
  useEffect(() => {
    if (engine.state.status === 'running' && isCountdown && !timer.isRunning) {
      timer.start()
    }
  }, [engine.state.status])

  // Process snippet completion after engine finishes
  useEffect(() => {
    if (!pendingAdvanceRef.current) return
    if (engine.state.status !== 'finished') return
    pendingAdvanceRef.current = false

    const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
    const stats: SnippetResult = {
      wpm: engine.wpm, rawWpm: engine.rawWpm, accuracy: engine.accuracy,
      errors: engine.state.errors, duration: dur,
      wpmSamples: [...engine.wpmSamples], rawWpmSamples: [...engine.rawWpmSamples],
    }

    if (selectedLang && snippet) {
      recordSession({ languageId: selectedLang.id, snippetId: snippet.id, wpm: stats.wpm, accuracy: stats.accuracy, errors: stats.errors, duration: dur, difficulty: snippet.difficulty })
    }

    const next = [...accumulated, stats]
    setAccumulated(next)

    if (seqIndex >= trackSnippets.length - 1) {
      // Last snippet — show aggregate result
      const avgWpm = Math.round(next.reduce((s, r) => s + r.wpm, 0) / next.length)
      const avgRawWpm = Math.round(next.reduce((s, r) => s + r.rawWpm, 0) / next.length)
      const avgAcc = Math.round(next.reduce((s, r) => s + r.accuracy, 0) / next.length)
      const totalErrors = next.reduce((s, r) => s + r.errors, 0)
      const totalDur = next.reduce((s, r) => s + r.duration, 0)
      setFinalStats({ wpm: avgWpm, rawWpm: avgRawWpm, accuracy: avgAcc, errors: totalErrors, duration: totalDur, wpmSamples: next.flatMap(r => r.wpmSamples), rawWpmSamples: next.flatMap(r => r.rawWpmSamples) })
      setShowResult(true)
      setClientProgress(loadProgress())
    } else {
      // Advance to next snippet
      setSeqIndex(i => i + 1)
      timer.reset(timerDurationRef.current)
    }
  }, [engine.state.status])

  const prevErrors = useMemo(() => ({ current: 0 }), [])
  const isTyping = engine.state.status === 'running'

  useEffect(() => {
    const themeName = getThemePref()
    setCurrentTheme(themeName)
    applyTheme(getTheme(themeName))
    setClientProgress(loadProgress())
  }, [])

  useEffect(() => {
    if (availableLanguages.length > 0 && !selectedLang) {
      setSelectedLang(availableLanguages[0])
    }
  }, [availableLanguages])

  useEffect(() => { if (engine.state.errors > prevErrors.current) { playError() }; prevErrors.current = engine.state.errors }, [engine.state.errors])

  function handleRestartTrack() {
    setSeqIndex(0)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    engine.reset()
    timer.reset(timerDuration)
  }

  function handleRestart() { engine.reset(); timer.reset(timerDuration) }
  function handleNext() { if (seqIndex < trackSnippets.length - 1) { setSeqIndex(i => i + 1); engine.reset(); timer.reset(timerDuration) } }
  function handlePrev() { if (seqIndex > 0) { setSeqIndex(i => i - 1); engine.reset(); timer.reset(timerDuration) } }

  function handleLangChange(lang: Language) {
    setSeqIndex(0)
    setSelectedLang(lang)
    setShowResult(false)
    setSessionResult(null)
    setFinalStats(null)
    setAccumulated([])
    engine.reset()
    timer.reset(timerDuration)
  }

  function handleDifficultyChange(d: Difficulty | 'all') {
    setDifficulty(d)
    setSeqIndex(0)
    setAccumulated([])
    engine.reset()
    const newDur = getTrackTimerDuration(d, snippetCount)
    timer.reset(newDur)
  }

  useKeyboardShortcuts(useMemo(() => ({ Tab: showResult ? handleRestartTrack : handleRestart, ShiftTab: handleRestart, Escape: () => setShowThemeSelector(false) }), [showResult]), true)

  const wrappedHandleKey = useCallback((key: string) => { if (key === ' ' || key === 'Enter') playSpace(); else playKey(); engine.handleKey(key) }, [engine])

  const displaySeconds = isCountdown ? timer.seconds : (engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0)

  if (!track) {
    return <main className="flex-1 flex items-center justify-center"><p style={{ color: 'var(--sub)' }}>{t('trackNotFound', locale)}</p></main>
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={selectedLang ?? languages[0]} difficulty={difficulty}
          seconds={displaySeconds} isTimerRunning={timer.isRunning}
          onLanguageChange={() => {}} onDifficultyChange={handleDifficultyChange}
          showControls={!(track.textLanguages && track.snippetIds.length > 0)}
          onHomeClick={() => router.push('/')} onHelpClick={() => {}}
          level={levelInfo?.level ?? null} streak={clientProgress?.streak.current ?? 0}
          locale={locale} onLocaleToggle={toggleLocale}
          isTyping={isTyping}
        />

        {/* Breadcrumb + progress */}
        <div className={`px-3 sm:px-6 py-2 flex items-center gap-2 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
          <Link href="/tracks" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--sub)' }}>
            <ArrowLeftIcon size={14} /> {t('pageTracks', locale)}
          </Link>
          <span style={{ color: 'var(--sub)', opacity: 0.4 }}>/</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{track.name[locale]}</span>
          {snippet && (
            <span className="text-xs ml-auto" style={{ color: 'var(--sub)' }}>{seqIndex + 1}/{trackSnippets.length}</span>
          )}
        </div>

        {/* Language tabs */}
        {availableLanguages.length > 0 && (
          <div className={`px-3 sm:px-6 pb-3 flex items-center gap-1.5 sm:gap-2 flex-wrap transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
            {availableLanguages.map(lang => (
              <button
                key={lang.id}
                onClick={() => handleLangChange(lang)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-all duration-150 hover:brightness-110 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: lang.id === selectedLang?.id ? 'var(--main)' : 'var(--sub-alt)',
                  color: lang.id === selectedLang?.id ? 'var(--bg)' : 'var(--text)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.id === selectedLang?.id ? 'var(--bg)' : lang.color }} />
                {lang.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6">
          {!snippet ? (
            <p style={{ color: 'var(--sub)' }}>{t('loading', locale)}</p>
          ) : showResult && finalStats ? (
            <ResultScreen wpm={finalStats.wpm} rawWpm={finalStats.rawWpm} accuracy={finalStats.accuracy} errors={finalStats.errors}
              duration={finalStats.duration} snippet={snippet} languageLabel={selectedLang?.label ?? ''} wpmSamples={finalStats.wpmSamples}
              rawWpmSamples={finalStats.rawWpmSamples}
              xpEarned={accumulated.length * 10} newLevel={levelInfo?.level ?? 1} leveledUp={false}
              levelPercent={levelInfo ? Math.round(((clientProgress?.totalXP ?? 0) % 100)) : 0} streak={clientProgress?.streak.current ?? 0}
              onNext={handleRestartTrack} locale={locale} />
          ) : (
            <>
              {/* Prompt — hide when typing */}
              <div className={`w-full max-w-3xl mb-6 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
                <SnippetInfo snippet={snippet} languageLabel={selectedLang?.label ?? ''} languageColor={selectedLang?.color ?? '#888'} current={seqIndex + 1} total={trackSnippets.length} locale={locale} />
              </div>
              {/* Caps Lock warning — desktop: above text */}
              <CapsLockWarning visible={capsLock && !showResult && !isMobile} isMobile={false} locale={locale} />

              <TypingArea code={snippet.code} charStatuses={engine.state.charStatuses} currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey} disabled={showResult} languageId={selectedLang?.id ?? ''} isTyping={isTyping} locale={locale} />

              {/* Caps Lock warning — mobile: below text */}
              <CapsLockWarning visible={capsLock && !showResult && !!isMobile} isMobile={true} locale={locale} />

              {isTyping && (
                <div className="mt-3 text-[10px] animate-fade-in" style={{ color: 'var(--sub)', opacity: 0.4 }}>
                  {t('hintShiftTab', locale)}
                </div>
              )}
              {/* Nav buttons — icon-only, hide when typing */}
              <div className={`w-full max-w-3xl mt-6 flex justify-center transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
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

        <Footer onHelpClick={() => {}} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} isTyping={isTyping} locale={locale} />
      </div>

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
    </main>
  )
}
