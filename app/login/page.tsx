'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthShell from '@/components/auth/AuthShell'
import { GithubIcon, GoogleIcon, MailIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { user, isLoading, signInWithGoogle, signInWithGitHub, signInWithPassword, supabaseConfigured, supabaseMissingVars } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [oauthErrorId, setOauthErrorId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('oauth_error') === '1') {
      setError(t('authOAuthError', locale))
      const errorId = params.get('error_id')
      setOauthErrorId(errorId ? errorId.slice(0, 8) : null)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [locale])

  useEffect(() => {
    if (isLoading) return
    if (user) {
      router.replace('/')
    }
  }, [isLoading, router, user])

  async function handlePasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setOauthErrorId(null)

    const result = await signInWithPassword(email, password)
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
  }

  async function handleGoogleLogin() {
    setError(null)
    setOauthErrorId(null)
    setIsSubmitting(true)
    const result = await signInWithGoogle()
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    }
  }

  async function handleGitHubLogin() {
    setError(null)
    setOauthErrorId(null)
    setIsSubmitting(true)
    const result = await signInWithGitHub()
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    }
  }

  return (
    <AuthShell
      title={t('authLoginTitle', locale)}
      subtitle={t('authLoginSubtitle', locale)}
      footer={
        <div className="space-y-3 text-center">
          <Link href="/signup" className="inline-block cursor-pointer text-sm transition-all duration-150 hover:opacity-80 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100" style={{ color: 'var(--main)' }}>
            {t('authNeedAccount', locale)}
          </Link>
          <div>
            <Link href="/" className="inline-block cursor-pointer text-xs transition-all duration-150 hover:opacity-80 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100" style={{ color: 'var(--sub)' }}>
              {t('authContinueGuest', locale)}
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || !supabaseConfigured}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-150 hover:scale-[1.01] hover:brightness-125 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
        >
          <GoogleIcon size={16} />
          {t('authContinueGoogle', locale)}
        </button>

        <button
          type="button"
          onClick={handleGitHubLogin}
          disabled={isSubmitting || !supabaseConfigured}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-150 hover:scale-[1.01] hover:brightness-110 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
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

        <form className="space-y-3" onSubmit={handlePasswordLogin}>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
              {t('authEmail', locale)}
            </span>
            <div className="flex items-center gap-2 rounded-2xl border px-3 py-3" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)' }}>
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

          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
              {t('authPassword', locale)}
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
              style={{
                borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)',
                color: 'var(--text)',
              }}
            />
          </label>

          {error ? (
            <div role="alert" className="rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
              <p>{error}</p>
              {oauthErrorId ? <p className="mt-1 text-xs opacity-80">Ref: {oauthErrorId}</p> : null}
            </div>
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
            className="w-full cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 hover:scale-[1.01] hover:brightness-110 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
          >
            {isSubmitting ? t('authWorking', locale) : t('authSignIn', locale)}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
