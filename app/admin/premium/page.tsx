'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

type PremiumHealthPayload = {
  access?: {
    plan: string
    role: string
    isPlus: boolean
    isSuperAdmin: boolean
  }
  package?: {
    available: boolean
    module: string
    samplePremiumCounts: Record<string, number>
    error: string | null
  }
  tracks?: Record<string, {
    expectedTotal: number
    resolvedTotal: number
    selectedLanguageId: string | null
    premiumCount: number
    hasPlusAccess: boolean
    complete: boolean
  }>
  error?: string
  code?: string
}

export default function PremiumAdminPage() {
  const router = useRouter()
  const { profile, isLoading } = useAuth()
  const { locale } = useLocale()
  const [status, setStatus] = useState<PremiumHealthPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function loadHealth() {
    setPending(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/premium-health', { cache: 'no-store' })
      const payload = await response.json() as PremiumHealthPayload
      if (!response.ok) throw new Error(payload.error ?? 'Could not verify premium runtime health.')
      setStatus(payload)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not verify premium runtime health.')
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!profile?.isSuperUser) {
      router.replace('/')
      return
    }
    void loadHealth()
  }, [isLoading, profile?.isSuperUser, router])

  if (isLoading) {
    return <main className="min-h-screen p-6" style={{ color: 'var(--sub)' }}>{t('loading', locale)}</main>
  }

  const panelStyle = {
    backgroundColor: 'color-mix(in srgb, var(--sub-alt) 86%, transparent)',
    border: '1px solid color-mix(in srgb, var(--sub) 16%, transparent)',
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6" style={{ color: 'var(--text)' }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => router.push('/admin/plus')} className="text-sm cursor-pointer" style={{ color: 'var(--sub)' }}>
            {t('back', locale)}
          </button>
          <button
            onClick={() => void loadHealth()}
            disabled={pending}
            className="rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{ border: '1px solid var(--sub)' }}
          >
            {pending ? t('authWorking', locale) : locale === 'pt' ? 'Executar diagnóstico' : 'Run diagnostics'}
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Premium Runtime Diagnostics</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? 'Valida o acesso efetivo do superadmin, o pacote privado e as trilhas React/Git dentro do runtime da Vercel.'
              : 'Validates effective superadmin access, the private package, and React/Git tracks inside the Vercel runtime.'}
          </p>
        </div>

        {error ? (
          <section className="rounded-xl p-4 text-sm shadow-xl" style={{ ...panelStyle, color: 'var(--error)' }}>
            {error}
          </section>
        ) : null}

        {status?.access ? (
          <section className="rounded-xl p-4 shadow-xl" style={panelStyle}>
            <h2 className="font-semibold">Access</h2>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2" style={{ color: 'var(--sub)' }}>
              <div>Plan: <strong style={{ color: 'var(--text)' }}>{status.access.plan}</strong></div>
              <div>Role: <strong style={{ color: 'var(--text)' }}>{status.access.role}</strong></div>
              <div>Plus: <strong style={{ color: status.access.isPlus ? 'var(--main)' : 'var(--error)' }}>{status.access.isPlus ? '✓' : '✕'}</strong></div>
              <div>Superadmin: <strong style={{ color: status.access.isSuperAdmin ? 'var(--main)' : 'var(--error)' }}>{status.access.isSuperAdmin ? '✓' : '✕'}</strong></div>
            </div>
          </section>
        ) : null}

        {status?.package ? (
          <section className="rounded-xl p-4 shadow-xl" style={panelStyle}>
            <h2 className="font-semibold">Private premium package</h2>
            <div className="mt-3 space-y-2 text-sm" style={{ color: 'var(--sub)' }}>
              <div>Available: <strong style={{ color: status.package.available ? 'var(--main)' : 'var(--error)' }}>{status.package.available ? '✓' : '✕'}</strong></div>
              <div className="break-all">Module: <strong style={{ color: 'var(--text)' }}>{status.package.module}</strong></div>
              {Object.entries(status.package.samplePremiumCounts).map(([languageId, count]) => (
                <div key={languageId}>{languageId}: <strong style={{ color: 'var(--text)' }}>{count}</strong> premium snippets</div>
              ))}
              {status.package.error ? <div style={{ color: 'var(--error)' }}>{status.package.error}</div> : null}
            </div>
          </section>
        ) : null}

        {status?.tracks ? (
          <section className="rounded-xl p-4 shadow-xl" style={panelStyle}>
            <h2 className="font-semibold">Track resolution</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.entries(status.tracks).map(([trackId, track]) => (
                <div
                  key={trackId}
                  className="rounded-lg p-3 text-sm"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 76%, transparent)', border: '1px solid color-mix(in srgb, var(--sub) 14%, transparent)' }}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <strong className="uppercase tracking-wide">{trackId}</strong>
                    <span style={{ color: track.complete ? 'var(--main)' : 'var(--error)' }}>{track.complete ? '✓ complete' : '✕ incomplete'}</span>
                  </div>
                  <div style={{ color: 'var(--sub)' }}>Resolved: <strong style={{ color: 'var(--text)' }}>{track.resolvedTotal}/{track.expectedTotal}</strong></div>
                  <div style={{ color: 'var(--sub)' }}>Premium: <strong style={{ color: 'var(--text)' }}>{track.premiumCount}</strong></div>
                  <div style={{ color: 'var(--sub)' }}>Language: <strong style={{ color: 'var(--text)' }}>{track.selectedLanguageId ?? '—'}</strong></div>
                  <div style={{ color: 'var(--sub)' }}>Plus access: <strong style={{ color: track.hasPlusAccess ? 'var(--main)' : 'var(--error)' }}>{track.hasPlusAccess ? '✓' : '✕'}</strong></div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
