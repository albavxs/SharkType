'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tracks } from '@/data/tracks'
import { loadProgress, UserProgress, getLevel } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { useLocale } from '@/hooks/useLocale'
import { useIsMobile } from '@/hooks/useMediaQuery'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import ThemeSelector from '@/components/typing/ThemeSelector'
import SceneWrapper from '@/components/three/SceneWrapper'
import { DEFAULT_LANGUAGE } from '@/lib/constants'
import { getLanguageById } from '@/data'
import { Language, Mode, Difficulty } from '@/lib/types'

export default function TracksPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [currentTheme, setCurrentTheme] = useState('serika dark')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const levelInfo = progress ? getLevel(progress.totalXP) : null

  // Dummy language for Toolbar prop compatibility
  const dummyLang = getLanguageById(DEFAULT_LANGUAGE)!

  useEffect(() => {
    const themeName = getThemePref()
    setCurrentTheme(themeName)
    applyTheme(getTheme(themeName))
    setProgress(loadProgress())
  }, [])

  function getTrackProgress(snippetIds: string[]): number {
    if (!progress) return 0
    let completed = 0
    for (const id of snippetIds) {
      for (const lp of Object.values(progress.languages)) {
        if (lp.completedSnippetIds.includes(id)) { completed++; break }
      }
    }
    return completed
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={dummyLang} mode={'snippet' as Mode} difficulty={'all' as Difficulty | 'all'}
          seconds={0} isTimerRunning={false}
          onLanguageChange={() => {}} onModeChange={() => {}} onDifficultyChange={() => {}}
          onHomeClick={() => router.push('/')} onHelpClick={() => {}}
          level={levelInfo?.level ?? null} streak={progress?.streak.current ?? 0}
          locale={locale} onLocaleToggle={toggleLocale}
        />

        <div className="flex-1 flex flex-col items-center px-6 py-8">
          <div className="w-full max-w-3xl">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] mb-2" style={{ color: 'var(--text)' }}>
              Trilhas
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--sub)' }}>
              Escolha uma trilha de conceitos. Em seguida, escolha a linguagem para praticar.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tracks.map(track => {
                const completed = getTrackProgress(track.snippetIds)
                const total = track.snippetIds.length
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0

                return (
                  <button key={track.id} onClick={() => router.push(`/tracks/${track.id}`)}
                    className="block p-4 rounded-lg text-left transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--sub-alt)' }}>
                    <div className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>{track.name}</div>
                    <div className="text-xs mb-4" style={{ color: 'var(--sub)' }}>{track.description}</div>

                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: Math.min(total, 10) }).map((_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < completed ? 'var(--main)' : 'var(--bg)' }} />
                      ))}
                      {total > 10 && <span className="text-[10px]" style={{ color: 'var(--sub)' }}>+{total - 10}</span>}
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--sub)' }}>{completed}/{total} · {pct}%</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <Footer onHelpClick={() => {}} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} />
      </div>

      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
    </main>
  )
}
