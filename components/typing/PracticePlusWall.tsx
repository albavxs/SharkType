'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckIcon, LockIcon } from '@/components/icons'
import { getTrackById, tracks } from '@/data/tracks'
import type { Locale } from '@/lib/i18n'
import type { PracticeWall } from '@/lib/types'

interface PracticePlusWallProps {
  wall: PracticeWall | null | undefined
  locale: Locale
  scope: 'language' | 'track'
  subjectName?: string | null
}

const premiumTrackCount = tracks.filter(
  (track) => (track.accessPolicy ?? 'plus_after_limit') === 'plus_after_limit'
).length

export default function PracticePlusWall({ wall, locale, scope, subjectName }: PracticePlusWallProps) {
  const pathname = usePathname()

  const trackId = scope === 'track' && pathname.startsWith('/tracks/')
    ? decodeURIComponent(pathname.split('/')[2] ?? '')
    : null
  const track = trackId ? getTrackById(trackId) : null
  const resolvedSubject = subjectName?.trim() || track?.name[locale] || null

  if (scope === 'language') {
    if (premiumTrackCount <= 0) return null

    const title = locale === 'pt'
      ? wall?.hasPlusAccess
        ? `${premiumTrackCount} trilhas premium incluídas no seu SharkType Plus`
        : `+ ${premiumTrackCount} trilhas premium disponíveis com SharkType Plus`
      : wall?.hasPlusAccess
        ? `${premiumTrackCount} premium tracks included with your SharkType Plus`
        : `+ ${premiumTrackCount} premium tracks available with SharkType Plus`

    const description = locale === 'pt'
      ? wall?.hasPlusAccess
        ? 'Seu acesso inclui o catálogo premium atual e as novas trilhas adicionadas ao SharkType.'
        : 'Desbloqueie o catálogo premium e tenha acesso às novas trilhas adicionadas ao SharkType.'
      : wall?.hasPlusAccess
        ? 'Your access includes the current premium catalog and new tracks added to SharkType.'
        : 'Unlock the premium catalog and get access to new tracks added to SharkType.'

    if (wall?.hasPlusAccess) {
      return (
        <div
          className="mx-auto mt-2 grid w-[calc(100%-1.5rem)] max-w-3xl grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-xl px-4 py-3 text-xs sm:w-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--main) 8%, transparent)',
            color: 'var(--text)',
            border: '1px solid color-mix(in srgb, var(--main) 22%, transparent)',
          }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg"
            style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)' }}
            aria-hidden="true"
          >
            <CheckIcon size={15} />
          </span>
          <span className="min-w-0 self-center">
            <span className="block font-semibold leading-5">{title}</span>
            <span className="block leading-5" style={{ color: 'var(--sub)' }}>{description}</span>
          </span>
        </div>
      )
    }

    const action = locale === 'pt' ? 'Conhecer Plus' : 'Explore Plus'
    return (
      <Link
        href="/plus"
        aria-label={`${title}. ${action}`}
        className="group mx-auto mt-2 grid w-[calc(100%-1.5rem)] max-w-3xl grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-xl px-4 py-3 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 sm:w-full sm:grid-cols-[auto_minmax(0,1fr)_auto]"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)',
          color: 'var(--text)',
          border: '1px solid color-mix(in srgb, var(--main) 28%, transparent)',
        }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg"
          style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)' }}
          aria-hidden="true"
        >
          <LockIcon size={15} />
        </span>
        <span className="min-w-0 self-center">
          <span className="block font-semibold leading-5">{title}</span>
          <span className="block leading-5" style={{ color: 'var(--sub)' }}>{description}</span>
        </span>
        <span
          className="col-start-2 shrink-0 self-center whitespace-nowrap font-semibold transition-transform duration-200 group-hover:translate-x-0.5 sm:col-start-auto"
          style={{ color: 'var(--main)' }}
        >
          {action} →
        </span>
      </Link>
    )
  }

  if (!wall?.hasPlusContent) return null

  const quantity = `+ ${wall.premiumCount}`

  if (wall.hasPlusAccess) {
    const unlockedTitle = locale === 'pt'
      ? resolvedSubject
        ? `${resolvedSubject} completo com SharkType Plus`
        : 'Conteúdo completo desbloqueado com SharkType Plus'
      : resolvedSubject
        ? `${resolvedSubject} fully unlocked with SharkType Plus`
        : 'Complete content unlocked with SharkType Plus'

    const unlockedDescription = locale === 'pt'
      ? wall.premiumCount > 0
        ? `${quantity} exercícios premium já estão liberados para você.`
        : 'Seu Plus inclui todo o conteúdo premium disponível para esta trilha.'
      : wall.premiumCount > 0
        ? `${quantity} premium exercises are already unlocked for you.`
        : 'Your Plus includes all premium content available for this track.'

    return (
      <div
        className="mx-auto mt-2 grid w-[calc(100%-1.5rem)] max-w-3xl grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-xl px-4 py-3 text-xs sm:w-full"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--main) 8%, transparent)',
          color: 'var(--text)',
          border: '1px solid color-mix(in srgb, var(--main) 22%, transparent)',
        }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg"
          style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)' }}
          aria-hidden="true"
        >
          <CheckIcon size={15} />
        </span>
        <span className="min-w-0 self-center">
          <span className="block font-semibold leading-5">{unlockedTitle}</span>
          <span className="block leading-5" style={{ color: 'var(--sub)' }}>{unlockedDescription}</span>
        </span>
      </div>
    )
  }

  const title = locale === 'pt'
    ? wall.premiumCount > 0
      ? resolvedSubject
        ? `${quantity} exercícios de ${resolvedSubject} disponíveis com SharkType Plus`
        : `${quantity} exercícios disponíveis com SharkType Plus`
      : resolvedSubject
        ? `Mais conteúdo para ${resolvedSubject} com SharkType Plus`
        : 'Mais conteúdo disponível com SharkType Plus'
    : wall.premiumCount > 0
      ? resolvedSubject
        ? `${quantity} ${resolvedSubject} exercises available with SharkType Plus`
        : `${quantity} exercises available with SharkType Plus`
      : resolvedSubject
        ? `More ${resolvedSubject} content with SharkType Plus`
        : 'More content available with SharkType Plus'

  const description = locale === 'pt'
    ? wall.premiumCount > 0
      ? resolvedSubject
        ? `Continue a trilha ${resolvedSubject} com o conteúdo completo.`
        : 'Desbloqueie o restante desta trilha e continue evoluindo.'
      : resolvedSubject
        ? `O Plus acompanha a evolução da trilha ${resolvedSubject} e libera o conteúdo premium adicionado a ela.`
        : 'O Plus libera o conteúdo premium adicionado a esta trilha.'
    : wall.premiumCount > 0
      ? resolvedSubject
        ? `Continue the ${resolvedSubject} track with the complete content.`
        : 'Unlock the rest of this track and keep progressing.'
      : resolvedSubject
        ? `Plus grows with the ${resolvedSubject} track and unlocks premium content added to it.`
        : 'Plus unlocks premium content added to this track.'

  const action = locale === 'pt' ? 'Conhecer Plus' : 'Explore Plus'

  return (
    <Link
      href="/plus"
      aria-label={`${title}. ${action}`}
      className="group mx-auto mt-2 grid w-[calc(100%-1.5rem)] max-w-3xl grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-xl px-4 py-3 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 sm:w-full sm:grid-cols-[auto_minmax(0,1fr)_auto]"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)',
        color: 'var(--text)',
        border: '1px solid color-mix(in srgb, var(--main) 28%, transparent)',
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg"
        style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)' }}
        aria-hidden="true"
      >
        <LockIcon size={15} />
      </span>
      <span className="min-w-0 self-center">
        <span className="block font-semibold leading-5">{title}</span>
        <span className="block leading-5" style={{ color: 'var(--sub)' }}>{description}</span>
      </span>
      <span
        className="col-start-2 shrink-0 self-center whitespace-nowrap font-semibold transition-transform duration-200 group-hover:translate-x-0.5 sm:col-start-auto"
        style={{ color: 'var(--main)' }}
      >
        {action} →
      </span>
    </Link>
  )
}
