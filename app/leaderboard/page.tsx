'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadProgress, UserProgress, getLevel, SessionRecord } from '@/lib/gamification'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { useLocale } from '@/hooks/useLocale'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { getLanguageById } from '@/data'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import ThemeSelector from '@/components/typing/ThemeSelector'
import SceneWrapper from '@/components/three/SceneWrapper'
import { codeLanguages, textLanguages } from '@/data'
import { Language, Difficulty } from '@/lib/types'

const ALL_LANGUAGES = [...codeLanguages, ...textLanguages]

function getLangLabel(id: string): string {
  return getLanguageById(id)?.label ?? id
}

function getLangColor(id: string): string {
  return getLanguageById(id)?.color ?? '#888'
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [currentTheme, setCurrentTheme] = useState('dracula')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [filterLang, setFilterLang] = useState<string>('all')
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()

  useEffect(() => {
    const themeName = getThemePref()
    setCurrentTheme(themeName)
    applyTheme(getTheme(themeName))
    setProgress(loadProgress())
  }, [])

  const levelInfo = progress ? getLevel(progress.totalXP) : null

  // Sorted history by WPM desc
  const sortedHistory: SessionRecord[] = progress
    ? [...progress.history].sort((a, b) => b.wpm - a.wpm)
    : []

  const usedLangIds = Array.from(new Set(sortedHistory.map(r => r.languageId)))

  const filtered = filterLang === 'all'
    ? sortedHistory
    : sortedHistory.filter(r => r.languageId === filterLang)

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={codeLanguages[0]} difficulty={'all' as Difficulty | 'all'}
          seconds={0} isTimerRunning={false}
          onLanguageChange={() => {}} onDifficultyChange={() => {}}
          showControls={false}
          onHomeClick={() => router.push('/')} onHelpClick={() => {}}
          level={levelInfo?.level ?? null} streak={progress?.streak.current ?? 0}
          locale={locale} onLocaleToggle={toggleLocale}
        />

        <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-3xl">
            <div className="flex items-end justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                Ranking
              </h1>
              <span className="text-[10px] sm:text-xs pb-1" style={{ color: 'var(--sub)' }}>ranking global em breve</span>
            </div>
            <p className="text-xs sm:text-sm mb-4 sm:mb-6" style={{ color: 'var(--sub)' }}>
              Suas melhores sessões, ordenadas por WPM.
            </p>

            {/* Personal best cards */}
            {progress && Object.keys(progress.languages).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {Object.entries(progress.languages)
                  .filter(([, lp]) => lp.bestWPM > 0)
                  .sort(([, a], [, b]) => b.bestWPM - a.bestWPM)
                  .slice(0, 6)
                  .map(([langId, lp]) => (
                    <div key={langId} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--sub-alt)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLangColor(langId) }} />
                        <span className="text-xs" style={{ color: 'var(--sub)' }}>{getLangLabel(langId)}</span>
                      </div>
                      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--main)' }}>{lp.bestWPM}</div>
                      <div className="text-[10px]" style={{ color: 'var(--sub)' }}>melhor wpm · {lp.totalSessions} sessões</div>
                    </div>
                  ))}
              </div>
            )}

            {/* Language filter tabs */}
            {usedLangIds.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <button
                  onClick={() => setFilterLang('all')}
                  className="px-3 py-1 text-xs rounded-full transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: filterLang === 'all' ? 'var(--main)' : 'var(--sub-alt)',
                    color: filterLang === 'all' ? 'var(--bg)' : 'var(--sub)',
                  }}
                >
                  Todas
                </button>
                {usedLangIds.map(id => (
                  <button
                    key={id}
                    onClick={() => setFilterLang(id)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: filterLang === id ? 'var(--main)' : 'var(--sub-alt)',
                      color: filterLang === id ? 'var(--bg)' : 'var(--sub)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: filterLang === id ? 'var(--bg)' : getLangColor(id) }} />
                    {getLangLabel(id)}
                  </button>
                ))}
              </div>
            )}

            {/* History table */}
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'var(--sub)' }}>
                <p className="text-sm">Nenhuma sessão ainda.</p>
                <p className="text-xs mt-1">Complete alguns treinos para ver seu histórico aqui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="rounded-lg overflow-hidden min-w-[28rem]" style={{ border: '1px solid color-mix(in srgb, var(--sub) 20%, transparent)' }}>
                  {/* Table header */}
                  <div className="grid text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2"
                    style={{ gridTemplateColumns: '1.5rem 1fr 3.5rem 3.5rem 2.5rem 2.5rem 3.5rem', backgroundColor: 'var(--sub-alt)', color: 'var(--sub)' }}>
                    <span>#</span>
                    <span>linguagem</span>
                    <span className="text-right">wpm</span>
                    <span className="text-right">precisão</span>
                    <span className="text-right">erros</span>
                    <span className="text-right">tempo</span>
                    <span className="text-right">data</span>
                  </div>

                  {filtered.map((record, i) => (
                    <div key={i}
                      className="grid px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm"
                      style={{
                        gridTemplateColumns: '1.5rem 1fr 3.5rem 3.5rem 2.5rem 2.5rem 3.5rem',
                        borderTop: i > 0 ? '1px solid color-mix(in srgb, var(--sub) 10%, transparent)' : 'none',
                        backgroundColor: i === 0 && filterLang === 'all' ? 'color-mix(in srgb, var(--main) 5%, transparent)' : 'transparent',
                      }}>
                      <span className="text-xs font-mono" style={{ color: i < 3 ? 'var(--main)' : 'var(--sub)' }}>
                        {i + 1}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getLangColor(record.languageId) }} />
                        <span style={{ color: 'var(--text)' }}>{getLangLabel(record.languageId)}</span>
                      </span>
                      <span className="text-right font-semibold tabular-nums" style={{ color: 'var(--main)' }}>{record.wpm}</span>
                      <span className="text-right tabular-nums text-xs" style={{ color: 'var(--text)' }}>{record.accuracy}%</span>
                      <span className="text-right tabular-nums text-xs" style={{ color: record.errors > 0 ? 'var(--error)' : 'var(--sub)' }}>{record.errors}</span>
                      <span className="text-right tabular-nums text-xs" style={{ color: 'var(--sub)' }}>{record.duration}s</span>
                      <span className="text-right text-xs" style={{ color: 'var(--sub)' }}>{formatDate(record.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
