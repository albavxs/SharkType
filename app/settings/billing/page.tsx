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

  const loading = authLoading || (Boolean(user) && !payload && !error)
  const isLifetime = payload?.access.source === 'manual_grant' && !payload.entitlement?.expiresAt
  const isGranted = payload?.access.source === 'manual_grant'
  const isAdminAccess = payload?.access.source === 'super_admin'

  const planLabel = payload?.access.isPlus
    ? isLifetime
      ? locale === 'pt' ? 'Plus Vitalício' : 'Lifetime Plus'
      : isGranted
        ? locale === 'pt' ? 'Plus concedido' : 'Granted Plus'
        : isAdminAccess
          ? locale === 'pt' ? 'Plus administrativo' : 'Administrative Plus'
          : 'SharkType Plus'
    : 'SharkType Free'

  const rawStatus = payload?.subscription?.status ?? payload?.entitlement?.status ?? null
  const normalizedStatus = rawStatus?.toLowerCase() ?? null
  const statusLabel = payload?.access.isPlus && (isGranted || isAdminAccess)
    ? locale === 'pt' ? 'Ativo' : 'Active'
    : normalizedStatus === 'active' || normalizedStatus === 'confirmed' || normalizedStatus === 'received'
      ? locale === 'pt' ? 'Ativo' : 'Active'
      : normalizedStatus === 'past_due' || normalizedStatus === 'overdue' || normalizedStatus === 'pending'
        ? locale === 'pt' ? 'Pagamento pendente' : 'Payment pending'
        : normalizedStatus === 'canceled' || normalizedStatus === 'cancelled'
          ? locale === 'pt' ? 'Cancelado' : 'Canceled'
          : normalizedStatus === 'expired'
            ? locale === 'pt' ? 'Expirado' : 'Expired'
            : payload?.access.isPlus
              ? locale === 'pt' ? 'Ativo' : 'Active'
              : locale === 'pt' ? 'Gratuito' : 'Free'

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <SceneWrapper />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <Link
          href="/home"
          className="inline-flex cursor-pointer items-center text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
          style={{ color: 'var(--sub)' }}
        >
          ← {locale === 'pt' ? 'Voltar para a home' : 'Back to home'}
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--main)' }}>SharkType Plus</p>
          <h1 className="mt-2 text-3xl font-bold">{locale === 'pt' ? 'Plano e assinatura' : 'Plan and subscription'}</h1>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? 'Consulte seu plano, o status do acesso e os dados de cobrança quando houver uma assinatura recorrente.'
              : 'Review your plan, access status, and billing details when a recurring subscription exists.'}
          </p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'var(--sub-alt)', color: 'var(--sub)' }}>
            {locale === 'pt' ? 'Carregando plano...' : 'Loading plan...'}
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
                <h2 className="mt-2 text-2xl font-bold">{planLabel}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6" style={{ color: 'var(--sub)' }}>
                  {isLifetime
                    ? locale === 'pt'
                      ? 'Você possui o SharkType Plus Vitalício concedido à sua conta. Aproveite todos os recursos Plus e a experiência Mastery sem renovação ou prazo de expiração.'
                      : 'You have Lifetime SharkType Plus granted to your account. Enjoy every Plus feature and the Mastery experience with no renewal or expiration date.'
                    : isGranted
                      ? locale === 'pt'
                        ? `Seu acesso Plus está ativo${payload.entitlement?.expiresAt ? ` até ${formatDate(payload.entitlement.expiresAt)}` : ''}.`
                        : `Your Plus access is active${payload.entitlement?.expiresAt ? ` until ${formatDate(payload.entitlement.expiresAt)}` : ''}.`
                      : isAdminAccess
                        ? locale === 'pt' ? 'Seu acesso Plus faz parte da sua conta administrativa.' : 'Your Plus access is included with your administrative account.'
                        : payload.access.isPlus
                          ? locale === 'pt' ? 'Sua assinatura Plus está ativa.' : 'Your Plus subscription is active.'
                          : locale === 'pt' ? 'Você está usando o plano gratuito.' : 'You are using the free plan.'}
                </p>
              </div>

              {!payload.access.isPlus ? (
                <Link href="/plus" className="inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
                  {locale === 'pt' ? 'Conhecer SharkType Plus' : 'Explore SharkType Plus'}
                </Link>
              ) : null}
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Plano' : 'Plan'}</dt>
                <dd className="mt-2 text-sm font-semibold">{planLabel}</dd>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}>
                <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>Status</dt>
                <dd className="mt-2 text-sm font-semibold" style={{ color: payload.access.isPlus ? 'var(--main)' : 'var(--text)' }}>{statusLabel}</dd>
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
              ) : isLifetime ? (
                <div
                  className="sm:col-span-2 rounded-xl border p-4 text-sm leading-6"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)',
                    color: 'var(--sub)',
                  }}
                >
                  <div className="font-semibold" style={{ color: 'var(--main)' }}>
                    ✦ {locale === 'pt' ? 'Acesso vitalício exclusivo' : 'Exclusive lifetime access'}
                  </div>
                  <p className="mt-1">
                    {locale === 'pt'
                      ? 'Seu Plus foi concedido permanentemente. Não existe cobrança recorrente, renovação ou data de expiração vinculada a este acesso.'
                      : 'Your Plus was granted permanently. There is no recurring charge, renewal, or expiration date attached to this access.'}
                  </p>
                </div>
              ) : isGranted && payload.entitlement?.expiresAt ? (
                <div className="sm:col-span-2 rounded-xl p-4 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 8%, transparent)', color: 'var(--sub)' }}>
                  {locale === 'pt'
                    ? `Acesso concedido sem cobrança recorrente, válido até ${formatDate(payload.entitlement.expiresAt)}.`
                    : `Granted access with no recurring billing, valid until ${formatDate(payload.entitlement.expiresAt)}.`}
                </div>
              ) : isAdminAccess ? (
                <div className="sm:col-span-2 rounded-xl p-4 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 8%, transparent)', color: 'var(--sub)' }}>
                  {locale === 'pt' ? 'Seu Plus é fornecido pela conta administrativa e não representa uma assinatura cobrada.' : 'Your Plus is provided by the administrative account and does not represent a billed subscription.'}
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}
      </div>
    </main>
  )
}
