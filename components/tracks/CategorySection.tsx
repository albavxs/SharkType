'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import type { Track } from '@/data/tracks'
import type { TrackCategory } from '@/lib/mastery'
import MasteryRail from '@/components/plus/MasteryRail'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

type CategorySectionProps = {
  category: TrackCategory
  locale: Locale
  isPlus: boolean
  isMasteryOpen: boolean
  onMasteryToggle: () => void
  renderTrackCard: (track: Track) => ReactNode
  onOpenTrack: (trackId: string) => void
  onOpenPlus: () => void
  footer?: ReactNode
}

export default function CategorySection({
  category,
  locale,
  isPlus,
  isMasteryOpen,
  onMasteryToggle,
  renderTrackCard,
  onOpenTrack,
  onOpenPlus,
  footer,
}: CategorySectionProps) {
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    viewport.scrollTo({
      left: isMasteryOpen ? viewport.clientWidth : 0,
      behavior: 'smooth',
    })
  }, [isMasteryOpen])

  return (
    <section className="mb-10">
      <CategoryHeader
        category={category}
        locale={locale}
        isPlus={isPlus}
        isOpen={isMasteryOpen}
        onToggle={onMasteryToggle}
      />

      <div
        ref={viewportRef}
        id={`mastery-panel-${category.id}`}
        className="overflow-hidden scroll-smooth"
        aria-label={category.mastery?.eligible ? `${category.title[locale]} Mastery navigation` : undefined}
      >
        <div className="flex w-[200%]">
          <div className="w-1/2 shrink-0 pr-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
              {category.tracks.map((track) => renderTrackCard(track))}
            </div>
          </div>

          <div className="w-1/2 shrink-0 pl-3 sm:pl-5" aria-hidden={!isMasteryOpen}>
            {category.mastery?.eligible ? (
              <MasteryRail
                tracks={category.mastery.tracks}
                locale={locale}
                isPlus={isPlus}
                onOpenTrack={onOpenTrack}
                onOpenPlus={onOpenPlus}
              />
            ) : null}
          </div>
        </div>
      </div>

      {footer}
    </section>
  )
}

function CategoryHeader({
  category,
  locale,
  isPlus,
  isOpen,
  onToggle,
}: {
  category: TrackCategory
  locale: Locale
  isPlus: boolean
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:gap-4">
      <div className="min-w-0">
        <h2 className="mb-0.5 text-lg font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
          {category.title[locale]}
        </h2>
        <p className="text-xs" style={{ color: 'var(--sub)' }}>
          {category.description[locale]}
        </p>
        {!isPlus && category.mastery?.eligible ? (
          <p className="mt-1 text-xs" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? 'Continue alem da trilha base com desafios Mastery no Plus.'
              : 'Continue beyond the base track with Mastery challenges in Plus.'}
          </p>
        ) : null}
      </div>

      {category.mastery?.eligible ? (
        <CategoryMasteryToggle
          categoryId={category.id}
          challengeCount={category.mastery.totalChallenges}
          isPlus={isPlus}
          isOpen={isOpen}
          onClick={onToggle}
          locale={locale}
        />
      ) : null}
    </div>
  )
}

function CategoryMasteryToggle({
  categoryId,
  challengeCount,
  isPlus,
  isOpen,
  onClick,
  locale,
}: {
  categoryId: string
  challengeCount: number
  isPlus: boolean
  isOpen: boolean
  onClick: () => void
  locale: Locale
}) {
  const label = isPlus
    ? locale === 'pt' ? 'Mastery' : 'Mastery'
    : locale === 'pt' ? `${challengeCount} desafios extras` : `${challengeCount} extra challenges`

  return (
    <button
      type="button"
      aria-controls={`mastery-panel-${categoryId}`}
      onClick={onClick}
      className="inline-flex max-w-full shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-150 hover:scale-[1.02] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)',
        borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)',
        color: 'var(--main)',
        outlineColor: 'var(--main)',
      }}
    >
      {isOpen ? (
        <>
          <ArrowLeftIcon size={15} className="shrink-0" />
          <span className="truncate">{locale === 'pt' ? 'Trilhas base' : 'Base tracks'}</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">✦</span>
          <span className="truncate">{label}</span>
          <ArrowRightIcon size={15} className="shrink-0" />
        </>
      )}
    </button>
  )
}
