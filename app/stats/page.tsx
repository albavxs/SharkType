'use client'

import { useEffect, useState } from 'react'
import { loadProgress, getLevel, UserProgress } from '@/lib/gamification'
import { languages } from '@/data'
import { ArrowLeftIcon, FlameIcon } from '@/components/icons'
import Link from 'next/link'

export default function StatsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  if (!progress) return null

  const levelInfo = getLevel(progress.totalXP)
  const langEntries = Object.entries(progress.languages)

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white light:hover:text-black transition-colors">
          <ArrowLeftIcon size={14} />
          Voltar
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-lg space-y-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]">
            Estatísticas
          </h1>

          {/* Profile */}
          <div className="flex items-center gap-6 py-4 border-b border-neutral-800 light:border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-400">{levelInfo.level}</span>
            </div>
            <div>
              <div className="text-sm font-medium">{progress.totalXP} XP</div>
              <div className="w-24 h-1.5 rounded-full bg-neutral-800 light:bg-neutral-200 mt-1">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${levelInfo.percent}%` }} />
              </div>
            </div>
            {progress.streak.current > 0 && (
              <div className="flex items-center gap-1 text-sm text-orange-400">
                <FlameIcon size={14} />
                {progress.streak.current}d streak
              </div>
            )}
          </div>

          {/* Per language */}
          <div className="space-y-3">
            <h2 className="text-xs text-neutral-600 uppercase tracking-wider">Por linguagem</h2>
            {langEntries.length === 0 && (
              <p className="text-sm text-neutral-600">Nenhuma sessao ainda. Comece a praticar!</p>
            )}
            {langEntries.map(([langId, langProg]) => {
              const lang = languages.find(l => l.id === langId)
              if (!lang) return null
              const completed = langProg.completedSnippetIds.length
              const total = lang.snippets.length
              const pct = Math.round((completed / total) * 100)
              return (
                <div key={langId} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-sm w-20">{lang.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-800 light:bg-neutral-200">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: lang.color }} />
                  </div>
                  <span className="text-xs text-neutral-500 w-12 text-right">{completed}/{total}</span>
                  {langProg.bestWPM > 0 && (
                    <span className="text-xs text-neutral-600 w-16 text-right">{langProg.bestWPM} wpm</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Recent sessions */}
          {progress.history.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs text-neutral-600 uppercase tracking-wider">Historico recente</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {progress.history.slice(0, 20).map((session, i) => {
                  const lang = languages.find(l => l.id === session.languageId)
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs py-1.5 border-b border-neutral-900 light:border-neutral-100">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang?.color || '#666' }} />
                      <span className="text-neutral-400 w-16">{session.date}</span>
                      <span className="text-white light:text-black tabular-nums">{session.wpm} wpm</span>
                      <span className="text-neutral-500">{session.accuracy}%</span>
                      <span className="text-indigo-400 ml-auto">+{session.xpEarned} XP</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
