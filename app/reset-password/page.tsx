'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AuthShell from '@/components/auth/AuthShell'
import { EyeIcon, EyeOffIcon, LockIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { user, isLoading, updatePassword, supabaseConfigured } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isPt = locale === 'pt'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await updatePassword(password, confirmPassword)
    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    router.replace('/login?password_reset=1')
  }

  if (!isLoading && !user) {
    return (
      <AuthShell
        title={isPt ? 'Link de recuperação inválido' : 'Invalid recovery link'}
        subtitle={
          isPt
            ? 'Abra novamente o link enviado por email ou solicite uma nova recuperação de senha.'
            : 'Open the link from your email again or request a new password recovery email.'
        }
        footer={
          <Link href="/forgot-password" className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--main)' }}>
            {isPt ? 'Solicitar novo link' : 'Request a new link'}
          </Link>
        }
      >
        <div
          className="rounded-2xl border px-4 py-4 text-sm leading-6"
          style={{
            borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)',
            color: 'var(--sub)',
          }}
        >
          {isPt
            ? 'Por segurança, a sessão de recuperação precisa vir diretamente do link enviado pelo SharkType.'
            : 'For security, the recovery session must come directly from the link sent by SharkType.'}
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title={isPt ? 'Crie uma nova senha' : 'Create a new password'}
      subtitle={
        isPt
          ? 'Escolha uma senha nova com pelo menos 8 caracteres.'
          : 'Choose a new password with at least 8 characters.'
      }
      footer={
        <Link href="/login" className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--main)' }}>
          {isPt ? 'Voltar para o login' : 'Back to sign in'}
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {[
          {
            label: isPt ? 'Nova senha' : 'New password',
            value: password,
            setValue: setPassword,
            visible: showPassword,
            setVisible: setShowPassword,
            autoComplete: 'new-password',
          },
          {
            label: isPt ? 'Confirmar nova senha' : 'Confirm new password',
            value: confirmPassword,
            setValue: setConfirmPassword,
            visible: showConfirmPassword,
            setVisible: setShowConfirmPassword,
            autoComplete: 'new-password',
          },
        ].map((field) => (
          <label key={field.label} className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
              {field.label}
            </span>
            <div
              className="flex items-center gap-2 rounded-2xl border px-3 py-3"
              style={{
                borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)',
              }}
            >
              <LockIcon size={16} className="shrink-0" />
              <input
                value={field.value}
                onChange={(event) => field.setValue(event.target.value)}
                type={field.visible ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete={field.autoComplete}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text)' }}
              />
              <button
                type="button"
                onClick={() => field.setVisible((visible) => !visible)}
                aria-pressed={field.visible}
                aria-label={field.visible ? (isPt ? 'Ocultar senha' : 'Hide password') : isPt ? 'Mostrar senha' : 'Show password'}
                className="shrink-0 rounded-lg p-1 transition-opacity hover:opacity-80"
                style={{ color: 'var(--sub)' }}
              >
                {field.visible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </label>
        ))}

        {error ? (
          <p
            role="alert"
            className="rounded-2xl px-3 py-2 text-sm"
            style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isLoading || !user || !supabaseConfigured}
          className="w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
        >
          {isSubmitting
            ? isPt
              ? 'Salvando...'
              : 'Saving...'
            : isPt
              ? 'Salvar nova senha'
              : 'Save new password'}
        </button>
      </form>
    </AuthShell>
  )
}
