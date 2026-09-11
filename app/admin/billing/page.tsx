'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

type BillingStatus = {
  config: {
    environment: string | null
    apiConfigured: boolean
    webhookConfigured: boolean
    sandbox: boolean
  }
  premiumHealth: {
    available: boolean
    module: string
    samplePremiumCounts: Record<string, number>
    error: string | null
  }
  checkouts: Array<Record<string, unknown>>
  subscriptions: Array<Record<string, unknown>>
  events: Array<Record<string, unknown>>
}

export default function BillingAdminPage() {
  const router = useRouter()
  const { profile, isLoading } = useAuth()
  const { locale } = useLocale()
  const [status, setStatus] = useState<BillingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function loadStatus() {
    const response = await fetch('/api/admin/billing', { cache: 'no-store' })
    const payload = await response.json() as BillingStatus & { error?: string }
    if (!response.ok) throw new Error(payload.error ?? 'Could not load billing status.')
    setStatus(payload)
  }

  useEffect(() => {
    if (isLoading) return
    if (!profile?.isSuperUser) {
      router.replace('/')
      return
    }
    void loadStatus().catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not load billing status.'))
  }, [isLoading, profile?.isSuperUser, router])

  async function startSandboxCheckout() {
    setPending(true)
    setError(null)
    try {
      const response = await fetch('/api/billing/asaas/test-checkout', { method: 'POST' })
      const payload = await response.json() as { checkoutUrl?: string; error?: string }
      if (!response.ok || !payload.checkoutUrl) throw new Error(payload.error ?? 'Could not start sandbox checkout.')
      window.location.assign(payload.checkoutUrl)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not start sandbox checkout.')
      setPending(false)
    }
  }

  if (isLoading) {
    return <main className="min-h-screen p-6" style={{ color: 'var(--sub)' }}>{t('loading', locale)}</main>
  }

  const bool = (value: boolean) => value ? '✓' : '✕'
  const asText = (value: unknown) => value == null ? '—' : String(value)

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => router.push('/admin/plus')} className="text-sm" style={{ color: 'var(--sub)' }}>{t('back', locale)}</button>
          <button onClick={() => void loadStatus()} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ border: '1px solid var(--sub)' }}>
            {locale === 'pt' ? 'Atualizar status' : 'Refresh status'}
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Billing / Asaas Admin</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--sub)' }}>
            {locale === 'pt' ? 'Diagnóstico do conteúdo Plus, checkout sandbox e webhooks.' : 'Premium content, sandbox checkout and webhook diagnostics.'}
          </p>
        </div>

        {error ? <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--error)' }}>{error}</div> : null}

        {status ? (
          <>
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--sub-alt)' }}>
                <h2 className="font-semibold">Asaas</h2>
                <div className="mt-3 space-y-1 text-sm" style={{ color: 'var(--sub)' }}>
                  <div>Environment: <strong style={{ color: 'var(--text)' }}>{status.config.environment ?? 'unconfigured'}</strong></div>
                  <div>API configured: {bool(status.config.apiConfigured)}</div>
                  <div>Webhook configured: {bool(status.config.webhookConfigured)}</div>
                  <div>Sandbox: {bool(status.config.sandbox)}</div>
                </div>
                <button
                  onClick={() => void startSandboxCheckout()}
                  disabled={pending || !status.config.sandbox || !status.config.apiConfigured}
                  className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-45"
                  style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                >
                  {pending ? t('authWorking', locale) : locale === 'pt' ? 'Testar checkout Asaas — R$ 1,00' : 'Test Asaas checkout — R$1.00'}
                </button>
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--sub-alt)' }}>
                <h2 className="font-semibold">Premium package</h2>
                <div className="mt-3 space-y-1 text-sm" style={{ color: 'var(--sub)' }}>
                  <div>Available: {bool(status.premiumHealth.available)}</div>
                  <div className="break-all">Module: {status.premiumHealth.module}</div>
                  {Object.entries(status.premiumHealth.samplePremiumCounts).map(([key, count]) => <div key={key}>{key}: {count} premium snippets</div>)}
                  {status.premiumHealth.error ? <div style={{ color: 'var(--error)' }}>{status.premiumHealth.error}</div> : null}
                </div>
              </div>
            </section>

            <section className="rounded-xl p-4" style={{ backgroundColor: 'var(--sub-alt)' }}>
              <h2 className="font-semibold">Últimos checkouts</h2>
              <div className="mt-3 overflow-x-auto text-xs">
                {status.checkouts.length === 0 ? <p style={{ color: 'var(--sub)' }}>Nenhum checkout.</p> : status.checkouts.map((row, index) => (
                  <div key={String(row.id ?? index)} className="grid gap-1 border-b py-2 sm:grid-cols-5" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)' }}>
                    <span>{asText(row.purpose)}</span><span>{asText(row.status)}</span><span>{asText(row.amount)}</span><span>{asText(row.sandbox)}</span><span>{asText(row.created_at)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl p-4" style={{ backgroundColor: 'var(--sub-alt)' }}>
              <h2 className="font-semibold">Últimos webhooks</h2>
              <div className="mt-3 overflow-x-auto text-xs">
                {status.events.length === 0 ? <p style={{ color: 'var(--sub)' }}>Nenhum webhook.</p> : status.events.map((row, index) => (
                  <div key={String(row.id ?? index)} className="grid gap-1 border-b py-2 sm:grid-cols-4" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)' }}>
                    <span>{asText(row.event_type)}</span><span>{row.processed_at ? 'processed' : 'pending'}</span><span style={{ color: row.processing_error ? 'var(--error)' : 'var(--sub)' }}>{asText(row.processing_error)}</span><span>{asText(row.received_at)}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}
