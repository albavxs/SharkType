'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthShell from '@/components/auth/AuthShell'
import { MailIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'

export default function ForgotPasswordPage() {
  const { locale } = useLocale()
  const { resetPassword, supabaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isPt = locale === 'pt'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSubmitting(true)

    const result = await resetPassword(email)
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setNotice(
      isPt
        ? 'Se existir uma conta com esse email, enviamos um link para redefinir a senha.'
        : 'If an account exists for that email, we sent a password reset link.',
    )
  }

  return (
    <AuthShell
      title={isPt ? 'Esqueceu sua senha?' : 'Forgot your password?'}
      subtitle={
        isPt
          ? 'Informe seu email e enviaremos um link seguro para criar uma nova senha.'
          : 'Enter your email and we will send a secure link to create a new password.'
      }
      footer={
        <Link href="/login" className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--main)' }}>
          {isPt ? 'Voltar para o login' : 'Back to sign in'}
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
            Email
          </span>
          <div
            className="flex items-center gap-2 rounded-2xl border px-3 py-3"
            style={{
              borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)',
            }}
          >
            <MailIcon size={16} className="shrink-0" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--text)' }}
            />
          </div>
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-2xl px-3 py-2 text-sm"
            style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}
          >
            {error}
          </p>
        ) : null}

        {notice ? (
          <p
            className="rounded-2xl px-3 py-2 text-sm leading-6"
            style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !supabaseConfigured}
          className="w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
        >
          {isSubmitting
            ? isPt
              ? 'Enviando...'
              : 'Sending...'
            : isPt
              ? 'Enviar link de recuperação'
              : 'Send recovery link'}
        </button>
      </form>
    </AuthShell>
  )
}
