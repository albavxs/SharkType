'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { languages } from '@/data'
import { ArrowLeftIcon, FlameIcon } from '@/components/icons'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useLocale } from '@/hooks/useLocale'
import { useProgress } from '@/hooks/useProgress'
import { getLevel } from '@/lib/gamification'
import { t } from '@/lib/i18n'
import { formatSessionDate, getLanguageCompletion } from '@/lib/stats-display'

const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const panelStyle = {
  backgroundColor: 'color-mix(in srgb, var(--sub-alt) 55%, var(--bg))',
  borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)',
}

export default function StatsPage() {
  const { locale } = useLocale()
  const { progress } = useProgress()
  const isMobile = useIsMobile()
  const levelInfo = getLevel(progress.totalXP)

  const langEntries = Object.entries(progress.languages).flatMap(([id, record]) => {
    const language = languages.find(item => item.id === id)
    if (!language) return []

    return [{
      id,
      language,
      bestWPM: record.bestWPM,
      completion: getLanguageCompletion(
        record.completedSnippetIds,
        language.snippets.map(snippet => snippet.id),
      ),
    }]
  })

  return (
    <main className="relative flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-4 sm:px-6 sm:pb-16">
        <Link href="/home"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-md py-1 text-sm transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={15} />
          {t('back', locale)}
        </Link>

        <h1 className="mb-6 text-2xl font-bold font-[family-name:var(--font-geist-mono)] sm:mb-8 sm:text-3xl"
          style={{ color: 'var(--text)' }}>
          {t('pageStats', locale)}
        </h1>

        <section aria-label={locale === 'pt' ? 'Resumo de progresso' : 'Progress overview'}
          className="mb-6 flex min-w-0 flex-wrap items-center gap-4 rounded-2xl border p-4 sm:gap-6 sm:p-6"
          style={panelStyle}>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold tabular-nums"
            style={{ backgroundColor: 'color-mix(in srgb, var(--main) 20%, transparent)', color: 'var(--main)' }}>
            {levelInfo.level}
          </div>
          <div className="min-w-36 flex-1">
            <div className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
              {progress.totalXP.toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US')} XP
            </div>
            <div className="mt-2 h-2 w-full max-w-64 overflow-hidden rounded-full"
              role="progressbar" aria-label={locale === 'pt' ? 'Progresso para o próximo nível' : 'Progress to next level'}
              aria-valuenow={levelInfo.percent} aria-valuemin={0} aria-valuemax={100}
              style={{ backgroundColor: 'var(--bg)' }}>
              <div className="h-full max-w-full rounded-full" style={{ width: `${levelInfo.percent}%`, backgroundColor: 'var(--main)' }} />
            </div>
          </div>
          {progress.streak.current > 0 && (
            <div className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
              style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)' }}>
              <FlameIcon size={17} />
              {progress.streak.current}d {locale === 'pt' ? 'de sequência' : 'streak'}
            </div>
          )}
        </section>

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,1fr)]">
          <section className="min-w-0 rounded-2xl border p-4 sm:p-6" style={panelStyle}>
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--sub)' }}>{t('perLanguage', locale)}</h2>

            {langEntries.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--sub)' }}>{t('noSessionYet', locale)}</p>
            ) : (
              <div className="space-y-1">
                {langEntries.map(({ id, language, completion, bestWPM }) => (
                  <div key={id}
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-lg py-2.5 md:grid-cols-[minmax(8rem,1.1fr)_minmax(0,1.6fr)_auto] md:gap-x-4">
                    <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: language.color }} aria-hidden="true" />
                      <span className="truncate text-sm font-medium" title={language.label} style={{ color: 'var(--text)' }}>
                        {language.label}
                      </span>
                    </div>

                    <div className="col-span-2 col-start-1 row-start-2 h-2 min-w-0 overflow-hidden rounded-full md:col-span-1 md:col-start-2 md:row-start-1"
                      role="progressbar" aria-label={`${language.label}: ${completion.completed}/${completion.total}`}
                      aria-valuenow={completion.completed} aria-valuemin={0} aria-valuemax={completion.total || 1}
                      style={{ backgroundColor: 'var(--bg)' }}>
                      <div className="h-full max-w-full rounded-full transition-[width] duration-300"
                        style={{ width: `${completion.percent}%`, backgroundColor: language.color }} />
                    </div>

                    <div className="col-start-2 row-start-1 flex shrink-0 flex-col items-end gap-0.5 text-right md:col-start-3">
                      <div className="flex items-center gap-2.5 whitespace-nowrap text-xs tabular-nums">
                        <span style={{ color: 'var(--text)' }}>{completion.completed}/{completion.total}</span>
                        {bestWPM > 0 && <span style={{ color: 'var(--sub)' }}>{bestWPM} WPM</span>}
                      </div>
                      {completion.previous > 0 && (
                        <span className="text-[10px] tabular-nums" style={{ color: 'var(--sub)' }}
                          title={locale === 'pt'
                            ? 'Exercícios concluídos anteriormente que não estão no catálogo atual. O histórico foi preservado.'
                            : 'Previously completed exercises that are not in the current catalog. Your history is preserved.'}>
                          +{completion.previous} {locale === 'pt' ? 'anteriores' : 'older'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="min-w-0 rounded-2xl border p-4 sm:p-6" style={panelStyle}>
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--sub)' }}>{t('recentHistory', locale)}</h2>

            {progress.history.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--sub)' }}>{t('noSessionYet', locale)}</p>
            ) : (
              <div className="max-h-[36rem] min-w-0 space-y-1 overflow-y-auto overscroll-contain pr-1">
                {progress.history.slice(0, 20).map((session, index) => {
                  const language = languages.find(item => item.id === session.languageId)
                  return (
                    <div key={`${session.date}-${session.languageId}-${session.snippetId}-${index}`}
                      className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-b py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                      style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)' }}>
                      <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2.5">
                        <span className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: language?.color ?? 'var(--sub)' }} aria-hidden="true" />
                        <span className="whitespace-nowrap text-xs tabular-nums" style={{ color: 'var(--text)' }}>
                          {formatSessionDate(session.date, locale)}
                        </span>
                        <span className="min-w-0 truncate text-xs" style={{ color: 'var(--sub)' }}
                          title={language?.label ?? session.languageId}>
                          {language?.label ?? session.languageId}
                        </span>
                      </div>

                      <div className="col-start-1 row-start-2 flex items-center gap-3 whitespace-nowrap text-xs tabular-nums sm:col-start-2 sm:row-start-1">
                        <span style={{ color: 'var(--text)' }}>{session.wpm} WPM</span>
                        <span style={{ color: 'var(--sub)' }}>{session.accuracy}%</span>
                      </div>
                      <span className="col-start-2 row-start-1 whitespace-nowrap text-right text-xs font-medium tabular-nums sm:col-start-3"
                        style={{ color: 'var(--main)' }}>
                        +{session.xpEarned} XP
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
