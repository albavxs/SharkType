'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useUserAccess } from '@/hooks/useUserAccess'
import type { Locale } from '@/lib/i18n'

interface AccountPlusActionProps {
  locale?: Locale
  compact?: boolean
}

export default function AccountPlusAction({ locale = 'pt', compact = false }: AccountPlusActionProps) {
  const { user } = useAuth()
  const { isPlus, isLoading } = useUserAccess()

  if (!user) return null

  const href = isPlus ? '/settings/billing' : '/plus'
  const title = isPlus
    ? locale === 'pt' ? 'Gerenciar assinatura' : 'Manage subscription'
    : locale === 'pt' ? 'Assinar SharkType Plus' : 'Subscribe to SharkType Plus'

  return (
    <Link
      href={href}
      aria-label={title}
      title={title}
      className={compact
        ? 'inline-flex cursor-pointer items-center justify-center rounded-lg px-2 py-1 text-[10px] font-semibold transition-all duration-150 hover:scale-105 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2'
        : 'inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 hover:scale-105 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2'}
      style={{
        color: 'var(--main)',
        border: '1px solid color-mix(in srgb, var(--main) 34%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)',
        opacity: isLoading ? 0.65 : 1,
      }}
    >
      <span aria-hidden="true">✦</span>
      {!compact ? <span>Plus</span> : null}
    </Link>
  )
}
