'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MailIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { isStoredPendingVerificationEmail } from '@/lib/pending-verification'

export default function PendingVerificationGate() {
  const pathname = usePathname()
  const { user, isLoading, pendingVerificationEmail } = useAuth()
  const { locale } = useLocale()

  if (
    isLoading ||
    user ||
    !pendingVerificationEmail ||
    !isStoredPendingVerificationEmail(pendingVerificationEmail) ||
    pathname !== '/home'
  ) {
    return null
  }

  const isPt = locale === 'pt'

  return (
    <aside
      className="fixed right-4 top-20 z-[70] w-[calc(100%-2rem)] max-w-sm rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md sm:right-6 sm:top-24"
      style={{
        borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--bg) 92%, transparent)',
        color: 'var(--text)',
      }}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 shrink-0 rounded-full p-2"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)',
            color: 'var(--main)',
          }}
        >
          <MailIcon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {isPt ? 'Confirme sua conta' : 'Confirm your account'}
          </p>
          <p className="mt-1 text-xs leading-5" style={{ color: 'var(--sub)' }}>
            {isPt
              ? 'Verifique seu email para sincronizar seu progresso e liberar os recursos da conta.'
              : 'Verify your email to sync your progress and unlock account features.'}
          </p>
          <Link
            href={`/verify-email?email=${encodeURIComponent(pendingVerificationEmail)}`}
            className="mt-3 inline-flex text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--main)' }}
          >
            {isPt ? 'Verificar email' : 'Verify email'}
          </Link>
        </div>
      </div>
    </aside>
  )
}
