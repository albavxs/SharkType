'use client'

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
  onOpenMastery: (trackId: string) => void
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
  onOpenMastery,
  onOpenPlus,
  footer,
}: CategorySectionProps) {
  const mastery = category.mastery

  return (
    <section className="mb-10">
      <CategoryHeader
        category={category}
        locale={locale}
        isPlus={isPlus}
        isOpen={isMasteryOpen}
        onToggle={onMasteryToggle}
      />

      <div className="relative overflow-hidden">
        <div
          aria-hidden={isMasteryOpen}
          className={`transition-transform duration-300 ease-out ${
            isMasteryOpen
              ? 'pointer-events-none absolute inset-x-0 top-0 -translate-x-full'
              : 'relative translate-x-0'
          }`}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
            {category.tracks.map((track) => renderTrackCard(track))}
          </div>
        </div>

        {mastery?.eligible ? (
          <div
            id={`mastery-panel-${category.id}`}
            aria-hidden={!isMasteryOpen}
            className={`transition-transform duration-300 ease-out ${
              isMasteryOpen
                ? 'relative translate-x-0'
                : 'pointer-events-none absolute inset-x-0 top-0 translate-x-full'
            }`}
          >
            <MasteryRail
              tracks={mastery.tracks}
              locale={locale}
              isPlus={isPlus}
              onOpenMastery={onOpenMastery}
              onOpenPlus={onOpenPlus}
            />
          </div>
        ) : null}
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
              ? 'A trilha base continua gratuita; o Mastery fica separado no Plus.'
              : 'The base track stays free; Mastery remains separate in Plus.'}
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
  const closedLabel = isPlus
    ? 'Mastery'
    : challengeCount > 0
      ? locale === 'pt' ? `${challengeCount} desafios Mastery` : `${challengeCount} Mastery challenges`
      : locale === 'pt' ? 'Mastery Plus' : 'Mastery Plus'

  return (
    <button
      type="button"
      aria-controls={`mastery-panel-${categoryId}`}
      aria-expanded={isOpen}
      onClick={onClick}
      className="inline-flex max-w-full shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-150 hover:scale-[1.02] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
          <span className="truncate">{closedLabel}</span>
          <ArrowRightIcon size={15} className="shrink-0" />
        </>
      )}
    </button>
  )
}
