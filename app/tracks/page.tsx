'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { tracks, Track } from '@/data/tracks'
import { languages, textLanguages } from '@/data'
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
import { Language, Difficulty } from '@/lib/types'

const codeTracks = tracks.filter(t => !t.textLanguages)
const idiomTracks = tracks.filter(t => t.textLanguages)
const idiomBadges = textLanguages.filter(l => l.id !== 'text-typing')

function getTrackLanguages(track: Track): Language[] {
  const seen = new Set<string>()
  const result: Language[] = []
  for (const sid of track.snippetIds) {
    for (const lang of languages) {
      if (!seen.has(lang.id) && lang.snippets.some(s => s.id === sid)) {
        seen.add(lang.id)
        result.push(lang)
      }
    }
  }
  return result
}

export default function TracksPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [currentTheme, setCurrentTheme] = useState('serika dark')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const levelInfo = progress ? getLevel(progress.totalXP) : null

  const dummyLang = getLanguageById(DEFAULT_LANGUAGE)!

  const trackLangsMap = useMemo(() => {
    const map = new Map<string, Language[]>()
    for (const track of codeTracks) {
      map.set(track.id, getTrackLanguages(track))
    }
    return map
  }, [])

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

  function getSectionStats(sectionTracks: Track[]) {
    let total = 0
    let completed = 0
    for (const track of sectionTracks) {
      total += track.snippetIds.length
      completed += getTrackProgress(track.snippetIds)
    }
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, pct }
  }

  const codeStats = getSectionStats(codeTracks)

  function TrackCard({ track, badges }: { track: Track; badges: Language[] }) {
    return (
      <button onClick={() => router.push(`/tracks/${track.id}`)}
        className="block p-5 rounded-xl text-left transition-all duration-150 hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer w-full"
        style={{ backgroundColor: 'var(--sub-alt)' }}>
        <div className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>{track.name}</div>
        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--sub)' }}>{track.description}</div>
        <div className="flex flex-wrap gap-1">
          {badges.map(lang => (
            <span key={lang.id} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: lang.color + '22', color: lang.color, border: `1px solid ${lang.color}44` }}>
              {lang.label}
            </span>
          ))}
        </div>
      </button>
    )
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={dummyLang} difficulty={'all' as Difficulty | 'all'}
          seconds={0} isTimerRunning={false}
          onLanguageChange={() => {}} onDifficultyChange={() => {}}
          showControls={false}
          onHomeClick={() => router.push('/')} onHelpClick={() => {}}
          level={levelInfo?.level ?? null} streak={progress?.streak.current ?? 0}
          locale={locale} onLocaleToggle={toggleLocale}
        />

        <div className="flex-1 flex flex-col items-center px-6 py-8">
          <div className="w-full max-w-5xl">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] mb-2" style={{ color: 'var(--text)' }}>
              Trilhas
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--sub)' }}>
              Escolha uma trilha de conceitos. Em seguida, escolha a linguagem para praticar.
            </p>

            {/* Código section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)] mb-0.5" style={{ color: 'var(--text)' }}>Codigo</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>Trilhas tematicas por conceito ou linguagem de programacao</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {codeTracks.map(track => (
                  <TrackCard key={track.id} track={track} badges={trackLangsMap.get(track.id) ?? []} />
                ))}
              </div>
              {codeStats.total > 0 && (
                <div className="mt-4 text-xs" style={{ color: 'var(--sub)' }}>
                  {codeStats.completed}/{codeStats.total} concluidos · {codeStats.pct}%
                </div>
              )}
            </div>

            {/* Idiomas section */}
            <div className="mb-10">
              <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)] mb-0.5" style={{ color: 'var(--text)' }}>Idiomas</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>Treine digitacao com textos em portugues, ingles, espanhol e frances</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {idiomTracks.map(track => (
                  <TrackCard key={track.id} track={track} badges={idiomBadges} />
                ))}
              </div>
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
