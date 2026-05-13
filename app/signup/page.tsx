'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AuthShell from '@/components/auth/AuthShell'
import { GithubIcon, LockIcon, MailIcon, UserIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

export default function SignupPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { signInWithGitHub, signUpWithPassword, supabaseConfigured, supabaseMissingVars } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleGitHub() {
    setIsSubmitting(true)
    setError(null)
    const result = await signInWithGitHub()
    setIsSubmitting(false)

    if (result.error) setError(result.error)
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await signUpWithPassword(form)
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.needsVerification) {
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`)
      return
    }

    router.push('/')
  }

  return (
    <AuthShell
      title={t('authSignupTitle', locale)}
      subtitle={t('authSignupSubtitle', locale)}
      footer={
        <div className="space-y-3 text-center">
          <Link href="/login" className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--main)' }}>
            {t('authHaveAccount', locale)}
          </Link>
          <div>
            <Link href="/" className="text-xs transition-opacity hover:opacity-80" style={{ color: 'var(--sub)' }}>
              {t('authContinueGuest', locale)}
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGitHub}
          disabled={isSubmitting || !supabaseConfigured}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}
        >
          <GithubIcon size={16} />
          {t('authContinueGithub', locale)}
        </button>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--sub)' }}>
          <span className="h-px flex-1" style={{ backgroundColor: 'color-mix(in srgb, var(--sub) 24%, transparent)' }} />
          {t('authOr', locale)}
          <span className="h-px flex-1" style={{ backgroundColor: 'color-mix(in srgb, var(--sub) 24%, transparent)' }} />
        </div>

        <form className="space-y-3" onSubmit={handleSignUp}>
          {[
            {
              key: 'username',
              label: t('authUsername', locale),
              type: 'text',
              icon: <UserIcon size={16} className="shrink-0" />,
              placeholder: 'sharkcoder',
              autoComplete: 'username',
            },
            {
              key: 'email',
              label: t('authEmail', locale),
              type: 'email',
              icon: <MailIcon size={16} className="shrink-0" />,
              placeholder: 'you@example.com',
              autoComplete: 'email',
            },
            {
              key: 'password',
              label: t('authPassword', locale),
              type: 'password',
              icon: <LockIcon size={16} className="shrink-0" />,
              placeholder: '••••••••',
              autoComplete: 'new-password',
            },
            {
              key: 'confirmPassword',
              label: t('authConfirmPassword', locale),
              type: 'password',
              icon: <LockIcon size={16} className="shrink-0" />,
              placeholder: '••••••••',
              autoComplete: 'new-password',
            },
          ].map((field) => (
            <label key={field.key} className="block space-y-1.5">
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
                {field.label}
              </span>
              <div className="flex items-center gap-2 rounded-2xl border px-3 py-3" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)' }}>
                {field.icon}
                <input
                  value={form[field.key as keyof typeof form]}
                  onChange={(event) => updateField(field.key as keyof typeof form, event.target.value)}
                  type={field.type}
                  required
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text)' }}
                />
              </div>
            </label>
          ))}

          <p className="text-xs leading-6" style={{ color: 'var(--sub)' }}>
            {t('authUsernameHint', locale)}
          </p>

          {error ? (
            <p className="rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
              {error}
            </p>
          ) : null}

          {!supabaseConfigured ? (
            <div className="rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
              <p>{t('authSupabaseMissing', locale)}</p>
              <p className="mt-2 text-xs leading-5">
                {t('authSupabaseMissingVars', locale)} {supabaseMissingVars.join(', ')}
              </p>
              <p className="mt-2 text-xs leading-5">{t('authSupabaseRedeployHint', locale)}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !supabaseConfigured}
            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
          >
            {isSubmitting ? t('authWorking', locale) : t('authCreateAccount', locale)}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
