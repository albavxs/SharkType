'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import AuthShell from '@/components/auth/AuthShell'
import { MailIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

export default function VerifyEmailClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  const { pendingVerificationEmail, resendEmailCode, verifyEmailCode } = useAuth()
  const email = useMemo(() => searchParams.get('email') ?? pendingVerificationEmail ?? '', [searchParams, pendingVerificationEmail])
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSubmitting(true)

    const result = await verifyEmailCode(email, code.trim())
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setNotice(t('authVerificationSuccess', locale))
    router.push('/')
  }

  async function handleResend() {
    setError(null)
    setNotice(null)
    setIsSubmitting(true)

    const result = await resendEmailCode(email)
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setNotice(t('authVerificationResent', locale))
  }

  return (
    <AuthShell
      title={t('authVerifyTitle', locale)}
      subtitle={t('authVerifySubtitle', locale)}
      footer={
        <div className="space-y-3 text-center">
          <Link href="/login" className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--main)' }}>
            {t('authBackToLogin', locale)}
          </Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleVerify}>
        <div className="rounded-2xl border px-4 py-4 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)' }}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full p-2" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
              <MailIcon size={16} />
            </div>
            <div>
              <div className="font-medium" style={{ color: 'var(--text)' }}>
                {email || t('authEmailPlaceholder', locale)}
              </div>
              <p className="mt-1 text-xs leading-6" style={{ color: 'var(--sub)' }}>
                {t('authVerifyHint', locale)}
              </p>
            </div>
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
            {t('authVerificationCode', locale)}
          </span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            pattern="[0-9]*"
            required
            placeholder="123456"
            className="w-full rounded-2xl border px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] outline-none"
            style={{
              borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)',
              color: 'var(--text)',
            }}
          />
        </label>

        {error ? (
          <p className="rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
            {error}
          </p>
        ) : null}

        {notice ? (
          <p className="rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
        >
          {isSubmitting ? t('authWorking', locale) : t('authVerifyButton', locale)}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isSubmitting || !email}
          className="w-full rounded-2xl border px-4 py-3 text-sm font-medium transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', color: 'var(--text)' }}
        >
          {t('authResendCode', locale)}
        </button>
      </form>
    </AuthShell>
  )
}
