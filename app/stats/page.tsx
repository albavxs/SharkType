'use client'

import { getLevel } from '@/lib/gamification'
import { languages } from '@/data'
import { ArrowLeftIcon, FlameIcon } from '@/components/icons'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'

export default function StatsPage() {
  const { locale } = useLocale()
  const { progress } = useProgress()

  const levelInfo = getLevel(progress.totalXP)
  const langEntries = Object.entries(progress.languages)

  return (
    <main className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="px-3 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={14} />
          {t('back', locale)}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
        <div className="w-full max-w-lg space-y-6 sm:space-y-8">
          <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
            {t('pageStats', locale)}
          </h1>

          {/* Profile */}
          <div className="flex items-center gap-4 sm:gap-6 py-4" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 20%, transparent)' }}>
              <span className="text-base sm:text-lg font-bold" style={{ color: 'var(--main)' }}>{levelInfo.level}</span>
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{progress.totalXP} XP</div>
              <div className="w-20 sm:w-24 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--sub-alt)' }}>
                <div className="h-full rounded-full" style={{ width: `${levelInfo.percent}%`, backgroundColor: 'var(--main)' }} />
              </div>
            </div>
            {progress.streak.current > 0 && (
              <div className="flex items-center gap-1 text-xs sm:text-sm" style={{ color: 'var(--main)' }}>
                <FlameIcon size={14} />
                {progress.streak.current}d streak
              </div>
            )}
          </div>

          {/* Per language */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('perLanguage', locale)}</h2>
            {langEntries.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--sub)' }}>{t('noSessionYet', locale)}</p>
            )}
            {langEntries.map(([langId, langProg]) => {
              const lang = languages.find(l => l.id === langId)
              if (!lang) return null
              const completed = langProg.completedSnippetIds.length
              const total = lang.snippets.length
              const pct = Math.round((completed / total) * 100)
              return (
                <div key={langId} className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                  <span className="text-xs sm:text-sm w-16 sm:w-20 shrink-0" style={{ color: 'var(--text)' }}>{lang.label}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--sub-alt)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: lang.color }} />
                  </div>
                  <span className="text-[10px] sm:text-xs w-10 sm:w-12 text-right shrink-0" style={{ color: 'var(--sub)' }}>{completed}/{total}</span>
                  {langProg.bestWPM > 0 && (
                    <span className="text-[10px] sm:text-xs w-14 sm:w-16 text-right shrink-0" style={{ color: 'var(--sub)' }}>{langProg.bestWPM} wpm</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Recent sessions */}
          {progress.history.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('recentHistory', locale)}</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {progress.history.slice(0, 20).map((session, i) => {
                  const lang = languages.find(l => l.id === session.languageId)
                  return (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs py-1.5" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 15%, transparent)' }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang?.color || '#666' }} />
                      <span className="w-14 sm:w-16 shrink-0" style={{ color: 'var(--sub)' }}>{session.date}</span>
                      <span className="tabular-nums" style={{ color: 'var(--text)' }}>{session.wpm} wpm</span>
                      <span style={{ color: 'var(--sub)' }}>{session.accuracy}%</span>
                      <span className="ml-auto" style={{ color: 'var(--main)' }}>+{session.xpEarned} XP</span>
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
