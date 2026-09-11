'use client'

import { useMemo, useRef, useState } from 'react'
import type { Track } from '@/data/tracks'
import type { Locale } from '@/lib/i18n'
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, LockIcon } from '@/components/icons'

type TrackAccessSummary = {
  plusEligible: boolean
  hasPremiumNow: boolean
  freeCount: number
  totalCount: number
  premiumCount: number
}

type MasteryRailProps = {
  tracks: Track[]
  accessMap: Map<string, TrackAccessSummary>
  locale: Locale
  isPlus: boolean
  onOpenTrack: (trackId: string) => void
  onOpenPlus: () => void
}

function localTrackCount(track: Track): number {
  if (track.slots?.length) return track.slots.length
  return track.snippetIds.length
}

export default function MasteryRail({ tracks, accessMap, locale, isPlus, onOpenTrack, onOpenPlus }: MasteryRailProps) {
  const [expanded, setExpanded] = useState(true)
  const railRef = useRef<HTMLDivElement>(null)

  const masteryTracks = useMemo(() => tracks.filter((track) => {
    if (track.textLanguages) return false
    if (track.section === 'concept') return true
    const summary = accessMap.get(track.id)
    const effectiveCount = Math.max(summary?.totalCount ?? 0, localTrackCount(track))
    return effectiveCount > 4
  }), [accessMap, tracks])

  if (masteryTracks.length === 0) return null

  function scroll(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
  }

  return (
    <section
      className="mt-5 rounded-2xl border p-3 sm:p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--main) 7%, transparent), color-mix(in srgb, var(--sub-alt) 76%, transparent))',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex min-w-0 items-center gap-2 rounded-lg text-left transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          aria-expanded={expanded}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--main)' }}>
                SharkType Plus Mastery
              </span>
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}>
                Plus
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs" style={{ color: 'var(--sub)' }}>
              {locale === 'pt' ? 'Desafios avançados, estrelas e progressão de domínio.' : 'Advanced challenges, stars, and mastery progression.'}
            </p>
          </div>
          <ChevronDownIcon size={16} className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded ? (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="rounded-lg p-2 transition-all duration-150 hover:scale-105 active:scale-90"
              style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)', color: 'var(--sub)' }}
              aria-label={locale === 'pt' ? 'Voltar no carrossel Mastery' : 'Scroll Mastery carousel back'}
            >
              <ArrowLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="rounded-lg p-2 transition-all duration-150 hover:scale-105 active:scale-90"
              style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)', color: 'var(--sub)' }}
              aria-label={locale === 'pt' ? 'Avançar no carrossel Mastery' : 'Scroll Mastery carousel forward'}
            >
              <ArrowRightIcon size={16} />
            </button>
          </div>
        ) : null}
      </div>

      {expanded ? (
        <div
          ref={railRef}
          className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]"
        >
          {masteryTracks.map((track) => {
            const summary = accessMap.get(track.id)
            const hasPremiumNow = summary?.hasPremiumNow === true
            const challengeCount = summary?.premiumCount ?? 0
            const canEnter = isPlus && hasPremiumNow

            return (
              <article
                key={track.id}
                className="min-w-[240px] max-w-[240px] snap-start rounded-xl border p-4 sm:min-w-[270px] sm:max-w-[270px]"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg) 76%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--main) 18%, transparent)',
                }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{track.name[locale]} Mastery</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--main)' }}>
                      ☆☆☆ · Mastery I
                    </div>
                  </div>
                  {!isPlus ? <LockIcon size={15} /> : null}
                </div>

                <p className="min-h-12 text-xs leading-relaxed" style={{ color: 'var(--sub)' }}>
                  {hasPremiumNow
                    ? locale === 'pt'
                      ? `${challengeCount} desafios Plus disponíveis para avançar além da trilha base.`
                      : `${challengeCount} Plus challenges available beyond the base track.`
                    : locale === 'pt'
                      ? 'A extensão Mastery desta trilha está sendo preparada.'
                      : 'This track\'s Mastery extension is being prepared.'}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 text-[10px]" style={{ color: 'var(--sub)' }}>
                  <span>{locale === 'pt' ? 'Estrelas' : 'Stars'} 0/18</span>
                  <span>{hasPremiumNow ? (locale === 'pt' ? 'Disponível' : 'Available') : (locale === 'pt' ? 'Em breve' : 'Coming soon')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => canEnter ? onOpenTrack(track.id) : onOpenPlus()}
                  className="mt-4 w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-95"
                  style={{
                    backgroundColor: canEnter ? 'var(--main)' : 'color-mix(in srgb, var(--main) 14%, transparent)',
                    color: canEnter ? 'var(--bg)' : 'var(--main)',
                    border: canEnter ? 'none' : '1px solid color-mix(in srgb, var(--main) 24%, transparent)',
                  }}
                >
                  {canEnter
                    ? (locale === 'pt' ? 'Entrar no Mastery' : 'Enter Mastery')
                    : isPlus
                      ? (locale === 'pt' ? 'Ver benefícios Plus' : 'View Plus benefits')
                      : (locale === 'pt' ? 'Desbloquear com Plus' : 'Unlock with Plus')}
                </button>
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
