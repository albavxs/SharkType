'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SceneWrapper from '@/components/three/SceneWrapper'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'

type BillingPayload = {
  access: {
    plan: 'free' | 'plus'
    isPlus: boolean
    source: 'subscription' | 'manual_grant' | 'super_admin' | null
  }
  entitlement: {
    status: string
    startsAt: string | null
    expiresAt: string | null
  } | null
  subscription: {
    provider: string
    status: string
    cycle: string | null
    amount: number | null
    nextDueDate: string | null
    sandbox: boolean
  } | null
  error?: string
}

export default function BillingSettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const [payload, setPayload] = useState<BillingPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace('/login')
      return
    }

    let active = true

    void fetch('/api/me/billing', { cache: 'no-store' })
      .then(async (response) => {
        const data = (await response.json()) as BillingPayload
        if (!response.ok) throw new Error(data.error ?? 'Could not load billing state.')
        return data
      })
      .then((data) => {
        if (!active) return
        setPayload(data)
        setError(null)
      })
      .catch((loadError) => {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Could not load billing state.')
      })

    return () => {
      active = false
    }
  }, [authLoading, router, user])

  const formatDate = (value: string | null | undefined) => {
    if (!value) return '—'
    return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      dateStyle: 'medium',
    }).format(new Date(value))
  }

  const formatMoney = (value: number | null | undefined) => {
    if (value == null) return '—'
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const sourceLabel = payload?.access.source === 'subscription'
    ? locale === 'pt' ? 'Assinatura' : 'Subscription'
    : payload?.access.source === 'manual_grant'
      ? locale === 'pt' ? 'Acesso concedido' : 'Granted access'
      : payload?.access.source === 'super_admin'
        ? locale === 'pt' ? 'Acesso administrativo' : 'Administrative access'
        : locale === 'pt' ? 'Plano gratuito' : 'Free plan'

  const loading = authLoading || (Boolean(user) && !payload && !error)

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <SceneWrapper />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <Link
          href="/settings"
          className="inline-flex cursor-pointer items-center text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
          style={{ color: 'var(--sub)' }}
        >
          ← {locale === 'pt' ? 'Configurações' : 'Settings'}
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--main)' }}>SharkType Plus</p>
          <h1 className="mt-2 text-3xl font-bold">{locale === 'pt' ? 'Plano e assinatura' : 'Plan and subscription'}</h1>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? 'Veja o estado do seu acesso Plus e, quando houver uma assinatura vinculada, os dados básicos de cobrança.'
              : 'Review your Plus access and, when a subscription is linked, its basic billing details.'}
          </p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'var(--sub-alt)', color: 'var(--sub)' }}>
            {locale === 'pt' ? 'Carregando assinatura...' : 'Loading subscription...'}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)', backgroundColor: 'var(--sub-alt)', color: 'var(--error)' }}>
            {error}
          </div>
        ) : payload ? (
          <section className="mt-8 rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 92%, transparent)' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: payload.access.isPlus ? 'var(--main)' : 'var(--sub)' }}>
                  {payload.access.isPlus ? 'SharkType Plus' : 'SharkType Free'}
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {payload.access.isPlus
                    ? locale === 'pt' ? 'Acesso ativo' : 'Access active'
                    : locale === 'pt' ? 'Plano gratuito' : 'Free plan'}
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--sub)' }}>{sourceLabel}</p>
              </div>

              {!payload.access.isPlus ? (
                <Link href="/plus" className="inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
                  {locale === 'pt' ? 'Conhecer SharkType Plus' : 'Explore SharkType Plus'}
                </Link>
              ) : null}
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Origem' : 'Source'}</dt>
                <dd className="mt-2 text-sm font-semibold">{sourceLabel}</dd>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>Status</dt>
                <dd className="mt-2 text-sm font-semibold">{payload.subscription?.status ?? payload.entitlement?.status ?? (payload.access.isPlus ? 'active' : 'free')}</dd>
              </div>

              {payload.subscription ? (
                <>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                    <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Ciclo' : 'Cycle'}</dt>
                    <dd className="mt-2 text-sm font-semibold">{payload.subscription.cycle ?? '—'}</dd>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                    <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Valor' : 'Amount'}</dt>
                    <dd className="mt-2 text-sm font-semibold">{formatMoney(payload.subscription.amount)}</dd>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                    <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Próxima cobrança' : 'Next due date'}</dt>
                    <dd className="mt-2 text-sm font-semibold">{formatDate(payload.subscription.nextDueDate)}</dd>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                    <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Ambiente' : 'Environment'}</dt>
                    <dd className="mt-2 text-sm font-semibold">{payload.subscription.sandbox ? 'Sandbox' : 'Production'}</dd>
                  </div>
                </>
              ) : payload.access.isPlus ? (
                <div className="sm:col-span-2 rounded-xl p-4 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 8%, transparent)', color: 'var(--sub)' }}>
                  {payload.access.source === 'manual_grant'
                    ? locale === 'pt' ? 'Este acesso foi concedido manualmente e não possui cobrança recorrente vinculada.' : 'This access was granted manually and has no recurring billing attached.'
                    : payload.access.source === 'super_admin'
                      ? locale === 'pt' ? 'Seu Plus vem do acesso administrativo e não representa uma assinatura cobrada.' : 'Your Plus comes from administrative access and does not represent a billed subscription.'
                      : locale === 'pt' ? 'Nenhuma assinatura recorrente está vinculada a este acesso.' : 'No recurring subscription is linked to this access.'}
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}
      </div>
    </main>
  )
}
