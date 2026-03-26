'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { getTrackById } from '@/data/tracks'
import { textLanguages, languages } from '@/data'
import { Snippet, Language, Difficulty } from '@/lib/types'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useProgress } from '@/hooks/useProgress'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SessionOutput, UserProgress, loadProgress, getLevel } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { playKey, playError, playComplete } from '@/lib/sounds'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import ResultScreen from '@/components/typing/ResultScreen'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import ThemeSelector from '@/components/typing/ThemeSelector'
import SceneWrapper from '@/components/three/SceneWrapper'
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'
import Link from 'next/link'

export default function TrackPracticePage() {
  const params = useParams()
  const router = useRouter()
  const trackId = params.track as string
  const track = getTrackById(trackId)

  const [seqIndex, setSeqIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionOutput | null>(null)
  const [currentTheme, setCurrentTheme] = useState('serika dark')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [clientProgress, setClientProgress] = useState<UserProgress | null>(null)
  const [selectedLang, setSelectedLang] = useState<Language | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const { recordSession } = useProgress()
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()

  const levelInfo = clientProgress ? getLevel(clientProgress.totalXP) : null

  // Available languages for this track
  const availableLanguages = useMemo(() => {
    if (!track) return []
    if (track.textLanguages) return textLanguages.filter(l => l.id !== 'text-typing')
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
    if (track.textLanguages) {
      snippets = track.difficultyFilter
        ? selectedLang.snippets.filter(s => s.difficulty === track.difficultyFilter)
        : selectedLang.snippets
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

  const snippet = trackSnippets[seqIndex % Math.max(trackSnippets.length, 1)] ?? null

  const handleFinish = useCallback(() => { setShowResult(true); playComplete() }, [])
  const engine = useTypingEngine(snippet?.code ?? '', handleFinish)
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

  useEffect(() => {
    if (showResult && snippet && !sessionResult && selectedLang) {
      const dur = engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0
      setSessionResult(recordSession({ languageId: selectedLang.id, snippetId: snippet.id, wpm: engine.wpm, accuracy: engine.accuracy, errors: engine.state.errors, duration: dur, difficulty: snippet.difficulty }))
    }
  }, [showResult])

  function handleNext() { setSeqIndex(i => (i + 1) % Math.max(trackSnippets.length, 1)); setShowResult(false); setSessionResult(null); engine.reset() }
  function handleRestart() { engine.reset(); setShowResult(false); setSessionResult(null) }
  function handlePrev() { setSeqIndex(i => i > 0 ? i - 1 : Math.max(trackSnippets.length - 1, 0)); setShowResult(false); setSessionResult(null); engine.reset() }

  function handleLangChange(lang: Language) {
    let newLen: number
    if (track!.textLanguages) {
      newLen = track!.difficultyFilter
        ? lang.snippets.filter(s => s.difficulty === track!.difficultyFilter).length
        : lang.snippets.length
    } else {
      newLen = track!.snippetIds.filter(sid => lang.snippets.some(s => s.id === sid)).length
    }
    setSeqIndex(i => Math.min(i, Math.max(newLen - 1, 0)))
    setSelectedLang(lang)
    setShowResult(false)
    setSessionResult(null)
    engine.reset()
  }

  useKeyboardShortcuts(useMemo(() => ({ Tab: showResult ? handleNext : handleRestart, Escape: () => setShowThemeSelector(false) }), [showResult]), true)

  const wrappedHandleKey = useCallback((key: string) => { playKey(); engine.handleKey(key) }, [engine])

  const blur = isTyping ? 'blur-sm pointer-events-none' : ''

  if (!track) {
    return <main className="flex-1 flex items-center justify-center"><p style={{ color: 'var(--sub)' }}>Trilha nao encontrada.</p></main>
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={selectedLang ?? languages[0]} difficulty={difficulty}
          seconds={0} isTimerRunning={false}
          onLanguageChange={() => {}} onDifficultyChange={(d) => { setDifficulty(d); setSeqIndex(0); engine.reset() }}
          showControls={!track.textLanguages}
          onHomeClick={() => router.push('/')} onHelpClick={() => {}}
          level={levelInfo?.level ?? null} streak={clientProgress?.streak.current ?? 0}
          locale={locale} onLocaleToggle={toggleLocale}
          isTyping={isTyping}
        />

        {/* Breadcrumb + progress — blur when typing */}
        <div className={`px-6 py-2 flex items-center gap-2 transition-all duration-300 ${blur}`}>
          <Link href="/tracks" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--sub)' }}>
            <ArrowLeftIcon size={14} /> Trilhas
          </Link>
          <span style={{ color: 'var(--sub)', opacity: 0.4 }}>/</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{track.name}</span>
          {snippet && (
            <span className="text-xs ml-auto" style={{ color: 'var(--sub)' }}>{seqIndex + 1}/{trackSnippets.length}</span>
          )}
        </div>

        {/* Language tabs — blur when typing */}
        {availableLanguages.length > 0 && (
          <div className={`px-6 pb-3 flex items-center gap-2 flex-wrap transition-all duration-300 ${blur}`}>
            {availableLanguages.map(lang => (
              <button
                key={lang.id}
                onClick={() => handleLangChange(lang)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-all hover:brightness-110"
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

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {!snippet ? (
            <p style={{ color: 'var(--sub)' }}>Carregando...</p>
          ) : showResult && sessionResult ? (
            <ResultScreen wpm={engine.wpm} rawWpm={engine.rawWpm} accuracy={engine.accuracy} errors={engine.state.errors}
              duration={engine.state.startTime ? Math.floor((Date.now() - engine.state.startTime) / 1000) : 0}
              snippet={snippet} languageLabel={selectedLang?.label ?? ''} wpmSamples={engine.wpmSamples} rawWpmSamples={engine.rawWpmSamples}
              xpEarned={sessionResult.xpEarned} newLevel={sessionResult.newLevel} leveledUp={sessionResult.leveledUp}
              levelPercent={sessionResult.levelPercent} streak={sessionResult.streak} onNext={handleNext} locale={locale} />
          ) : (
            <>
              {/* Prompt — hide when typing */}
              <div className={`w-full max-w-3xl mb-6 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
                <SnippetInfo snippet={snippet} languageLabel={selectedLang?.label ?? ''} languageColor={selectedLang?.color ?? '#888'} current={seqIndex + 1} total={trackSnippets.length} />
              </div>
              <TypingArea code={snippet.code} charStatuses={engine.state.charStatuses} currentIndex={engine.state.currentIndex}
                onKey={wrappedHandleKey} disabled={showResult} languageId={selectedLang?.id ?? ''} isTyping={isTyping} locale={locale} />
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

        <Footer onHelpClick={() => {}} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} isTyping={isTyping} />
      </div>

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
    </main>
  )
}
