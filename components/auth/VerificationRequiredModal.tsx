'use client'

import Link from 'next/link'
import { MailIcon } from '@/components/icons'
import type { Locale } from '@/lib/i18n'

interface VerificationRequiredModalProps {
  email: string
  locale: Locale
  onClose: () => void
}

export default function VerificationRequiredModal({
  email,
  locale,
  onClose,
}: VerificationRequiredModalProps) {
  const isPt = locale === 'pt'

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-required-title"
    >
      <div
        className="w-full max-w-lg rounded-[2rem] border p-6 shadow-2xl sm:p-8"
        style={{
          borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
        }}
      >
        <div
          className="mb-5 inline-flex rounded-full p-3"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)',
            color: 'var(--main)',
          }}
        >
          <MailIcon size={22} />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--main)' }}>
          {isPt ? 'falta só um passo' : 'one last step'}
        </p>
        <h2 id="verification-required-title" className="text-2xl font-semibold">
          {isPt ? 'Verifique seu email para liberar a conta completa' : 'Verify your email to unlock the full account'}
        </h2>
        <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>
          {isPt
            ? 'Você já pode explorar o SharkType e praticar localmente. A confirmação libera sincronização, progresso da conta, recursos sociais e acesso completo aos recursos autenticados.'
            : 'You can already explore SharkType and practice locally. Verification unlocks account sync, saved progress, social features, and full authenticated access.'}
        </p>

        <div
          className="mt-5 rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: 'color-mix(in srgb, var(--sub) 20%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)',
          }}
        >
          <span style={{ color: 'var(--sub)' }}>{isPt ? 'Enviado para ' : 'Sent to '}</span>
          <span className="font-medium">{email}</span>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/verify-email?email=${encodeURIComponent(email)}`}
            className="flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
          >
            {isPt ? 'Verificar email' : 'Verify email'}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)' }}
          >
            {isPt ? 'Continuar por enquanto' : 'Continue for now'}
          </button>
        </div>
      </div>
    </div>
  )
}
