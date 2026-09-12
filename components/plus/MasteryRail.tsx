'use client'

import type { Locale } from '@/lib/i18n'
import type { MasteryTrack } from '@/lib/mastery'
import { LockIcon } from '@/components/icons'

type MasteryRailProps = {
  tracks: MasteryTrack[]
  locale: Locale
  isPlus: boolean
  onOpenMastery: (trackId: string) => void
  onOpenPlus: () => void
}

export default function MasteryRail({ tracks, locale, isPlus, onOpenMastery, onOpenPlus }: MasteryRailProps) {
  if (tracks.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
      {tracks.map((track) => (
        <MasteryCard
          key={track.id}
          track={track}
          locale={locale}
          isPlus={isPlus}
          onOpenMastery={onOpenMastery}
          onOpenPlus={onOpenPlus}
        />
      ))}
    </div>
  )
}

function MasteryCard({
  track,
  locale,
  isPlus,
  onOpenMastery,
  onOpenPlus,
}: {
  track: MasteryTrack
  locale: Locale
  isPlus: boolean
  onOpenMastery: (trackId: string) => void
  onOpenPlus: () => void
}) {
  const isAvailable = track.availability === 'available' || track.availability === 'inProgress'
  const isComingSoon = track.availability === 'comingSoon'
  const isLocked = track.availability === 'locked'
  const showLock = !isPlus && isLocked
  const actionLabel = isComingSoon
    ? locale === 'pt' ? 'Em breve' : 'Coming soon'
    : isAvailable
      ? track.availability === 'inProgress'
        ? locale === 'pt' ? 'Continuar Mastery' : 'Continue Mastery'
        : locale === 'pt' ? 'Entrar no Mastery' : 'Enter Mastery'
      : locale === 'pt' ? 'Desbloquear com Plus' : 'Unlock with Plus'

  return (
    <article
      className="flex h-full min-h-[190px] w-full min-w-0 flex-col rounded-xl p-4 text-left transition-all duration-150 hover:brightness-110 sm:p-5"
      style={{ backgroundColor: 'var(--sub-alt)' }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="line-clamp-2 min-h-[3rem] text-base font-semibold" style={{ color: 'var(--text)' }}>
            {track.title[locale]} Mastery
          </div>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)',
            color: 'var(--main)',
          }}
        >
          {showLock ? <LockIcon size={11} /> : null}
          {isPlus ? 'Mastery' : 'Plus'}
        </span>
      </div>

      <p className="mb-3 line-clamp-3 min-h-[4.5rem] text-xs leading-relaxed" style={{ color: 'var(--sub)' }}>
        {isComingSoon
          ? locale === 'pt'
            ? 'Novos desafios avançados estão sendo preparados para esta trilha.'
            : 'New advanced challenges are being prepared for this track.'
          : track.description[locale]}
      </p>

      <div className="mt-auto">
        <div className="mb-3 min-h-[2.5rem] text-[11px] font-medium" style={{ color: 'var(--sub)' }}>
          {isComingSoon ? (
            <span>{locale === 'pt' ? 'Mastery elegível · em breve' : 'Mastery eligible · coming soon'}</span>
          ) : (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{track.challengeCount} {locale === 'pt' ? 'desafios' : 'challenges'}</span>
              {track.totalStars ? <span>{track.totalStars} {locale === 'pt' ? 'estrelas' : 'stars'}</span> : null}
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={isComingSoon}
          onClick={() => {
            if (isAvailable) onOpenMastery(track.slug)
            else onOpenPlus()
          }}
          className="w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: isAvailable ? 'var(--main)' : 'color-mix(in srgb, var(--main) 14%, transparent)',
            color: isAvailable ? 'var(--bg)' : 'var(--main)',
            border: isAvailable ? 'none' : '1px solid color-mix(in srgb, var(--main) 24%, transparent)',
            outlineColor: 'var(--main)',
          }}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  )
}
