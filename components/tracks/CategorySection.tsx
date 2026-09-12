'use client'

import type { Track } from '@/data/tracks'
import type { LanguageMeta } from '@/lib/types'
import type { Locale } from '@/lib/i18n'

type MasterySummary = {
  eligible: boolean
  available: boolean
  challengeCount: number
  totalStars: number
}

type ProgressSummary = {
  completed: number
  total: number
  isCompleted: boolean
}

interface CategorySectionProps {
  id: string
  title: string
  description: string
  tracks: Track[]
  locale: Locale
  isPlus: boolean
  isOpen: boolean
  masteryMap: Map<string, MasterySummary>
  badgesMap: Map<string, LanguageMeta[]>
  getProgress: (track: Track) => ProgressSummary
  onTrackClick: (track: Track) => void
  onMasteryClick: (track: Track) => void
  onToggle: () => void
}

export default function CategorySection({
  id,
  title,
  description,
  tracks,
  locale,
  isPlus,
  isOpen,
  masteryMap,
  badgesMap,
  getProgress,
  onTrackClick,
  onMasteryClick,
  onToggle,
}: CategorySectionProps) {
  const masteryTracks = tracks.filter((track) => masteryMap.get(track.id)?.eligible)
  const availableMasteryTracks = masteryTracks.filter((track) => masteryMap.get(track.id)?.available)
  const challengeCount = masteryTracks.reduce((total, track) => total + (masteryMap.get(track.id)?.challengeCount ?? 0), 0)

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>{title}</h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--sub)' }}>{description}</p>
          {!isPlus && masteryTracks.length > 0 ? (
            <p className="mt-1 text-[11px]" style={{ color: 'var(--sub)' }}>
              {locale === 'pt' ? 'Continue além da trilha base com desafios Mastery no Plus.' : 'Go beyond the base track with Mastery challenges on Plus.'}
            </p>
          ) : null}
        </div>

        {masteryTracks.length > 0 ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={`mastery-panel-${id}`}
            onClick={onToggle}
            className="inline-flex w-fit cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2"
            style={{ color: 'var(--main)', border: '1px solid color-mix(in srgb, var(--main) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--main) 8%, transparent)' }}
          >
            <span aria-hidden="true">✦</span>
            <span>
              {isPlus
                ? `Mastery ${isOpen ? '↓' : '→'}`
                : challengeCount > 0
                  ? locale === 'pt' ? `${challengeCount} desafios extras ${isOpen ? '↓' : '→'}` : `${challengeCount} extra challenges ${isOpen ? '↓' : '→'}`
                  : locale === 'pt' ? `Ver Mastery Plus ${isOpen ? '↓' : '→'}` : `View Mastery Plus ${isOpen ? '↓' : '→'}`}
            </span>
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
        {tracks.map((track) => {
          const progress = getProgress(track)
          const badges = badgesMap.get(track.id) ?? []

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onTrackClick(track)}
              className="block w-full min-w-0 cursor-pointer rounded-xl p-4 text-left transition-all duration-150 hover:scale-[1.02] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 sm:p-5"
              style={{ backgroundColor: 'var(--sub-alt)' }}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>{track.name[locale]}</div>
                {progress.isCompleted ? (
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}>
                    {locale === 'pt' ? 'Concluída' : 'Completed'}
                  </span>
                ) : null}
              </div>

              <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--sub)' }}>{track.description[locale]}</p>

              {badges.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {badges.map((lang) => (
                    <span key={lang.id} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: `${lang.color}22`, color: lang.color, border: `1px solid ${lang.color}44` }}>
                      {lang.label}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 text-[11px] font-medium" style={{ color: progress.isCompleted ? 'var(--main)' : 'var(--sub)' }}>
                {progress.completed}/{progress.total} {locale === 'pt' ? 'concluídos' : 'completed'}
              </div>
            </button>
          )
        })}
      </div>

      <div id={`mastery-panel-${id}`} aria-hidden={!isOpen} className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div
            className="relative overflow-hidden rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--main) 8%, transparent), transparent 45%), var(--sub-alt)', boxShadow: '0 0 40px color-mix(in srgb, var(--main) 8%, transparent)' }}
          >
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--main)' }}>✦ Mastery</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--sub)' }}>
                  {isPlus
                    ? locale === 'pt' ? 'Domine esta categoria com desafios avançados.' : 'Master this category with advanced challenges.'
                    : locale === 'pt' ? 'Desafios avançados, progressão Mastery e estrelas.' : 'Advanced challenges, Mastery progression, and stars.'}
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--main)' }}>
                {availableMasteryTracks.length}/{masteryTracks.length} {locale === 'pt' ? 'disponíveis' : 'available'}
              </span>
            </div>

            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
              {masteryTracks.map((track) => {
                const summary = masteryMap.get(track.id)!
                const available = summary.available

                return (
                  <article key={track.id} className="flex min-h-[250px] basis-[82vw] shrink-0 snap-start flex-col rounded-xl border p-4 sm:basis-[285px]" style={{ borderColor: 'color-mix(in srgb, var(--main) 22%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 78%, transparent)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--main)' }}>Mastery</p>
                        <h3 className="mt-2 min-h-[3rem] line-clamp-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>{track.name[locale]}</h3>
                      </div>
                      {!isPlus ? <span className="rounded-full px-2 py-1 text-[9px] font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>PLUS</span> : null}
                    </div>

                    <p className="mt-3 min-h-[3.75rem] line-clamp-3 text-xs leading-5" style={{ color: 'var(--sub)' }}>{track.description[locale]}</p>

                    <div className="mt-4 min-h-[54px] space-y-1 text-[11px]" style={{ color: 'var(--sub)' }}>
                      <p>{summary.challengeCount} {locale === 'pt' ? 'desafios' : 'challenges'}</p>
                      <p>{summary.totalStars} ★ {locale === 'pt' ? 'possíveis' : 'possible'}</p>
                      {!available ? <p style={{ color: 'var(--main)' }}>{locale === 'pt' ? 'Em breve' : 'Coming soon'}</p> : null}
                    </div>

                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => onMasteryClick(track)}
                      className="mt-auto w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all enabled:cursor-pointer enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2"
                      style={available ? { backgroundColor: 'var(--main)', color: 'var(--bg)' } : { border: '1px solid color-mix(in srgb, var(--sub) 24%, transparent)', color: 'var(--sub)' }}
                    >
                      {!available
                        ? locale === 'pt' ? 'Em breve' : 'Coming soon'
                        : isPlus
                          ? locale === 'pt' ? 'Entrar no Mastery' : 'Enter Mastery'
                          : locale === 'pt' ? 'Desbloquear com Plus' : 'Unlock with Plus'}
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
