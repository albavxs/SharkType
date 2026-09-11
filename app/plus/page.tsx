'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckIcon } from '@/components/icons'
import BrandLogo from '@/components/brand/BrandLogo'
import SceneWrapper from '@/components/three/SceneWrapper'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import type { UserAccess } from '@/lib/server/access-control'

type PlanKey = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

type OfferPlan = {
  key: PlanKey
  cycle: string
  months: number
  price: number | null
  monthlyEquivalent: number | null
  configured: boolean
}

type OfferPayload = {
  plans: OfferPlan[]
  checkoutEnabled: boolean
}

const planOrder: PlanKey[] = ['monthly', 'quarterly', 'semiannual', 'annual']

export default function PlusPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { locale } = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [pendingPlan, setPendingPlan] = useState<PlanKey | 'sandbox' | null>(null)
  const [access, setAccess] = useState<UserAccess | null>(null)
  const [offer, setOffer] = useState<OfferPayload | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('monthly')

  useEffect(() => {
    let active = true
    void fetch('/api/billing/plus/offer', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load Plus offer.')
        return response.json() as Promise<OfferPayload>
      })
      .then((payload) => {
        if (active) setOffer(payload)
      })
      .catch(() => {
        if (active) setOffer({ plans: [], checkoutEnabled: false })
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setAccess(null)
      return
    }

    let active = true
    void fetch('/api/me/access', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load access state.')
        return response.json() as Promise<{ access: UserAccess }>
      })
      .then((payload) => {
        if (active) setAccess(payload.access)
      })
      .catch(() => {
        if (active) setAccess(null)
      })

    return () => {
      active = false
    }
  }, [user])

  const plans = useMemo(() => {
    const byKey = new Map((offer?.plans ?? []).map((plan) => [plan.key, plan]))
    return planOrder.map((key) => byKey.get(key) ?? {
      key,
      cycle: key.toUpperCase(),
      months: key === 'monthly' ? 1 : key === 'quarterly' ? 3 : key === 'semiannual' ? 6 : 12,
      price: null,
      monthlyEquivalent: null,
      configured: false,
    })
  }, [offer])

  const currentPlan = plans.find((plan) => plan.key === selectedPlan) ?? plans[0]
  const isPlus = access?.isPlus ?? false
  const isSuperAdmin = profile?.isSuperUser === true

  function planLabel(key: PlanKey) {
    if (locale === 'pt') {
      return key === 'monthly' ? 'Mensal' : key === 'quarterly' ? 'Trimestral' : key === 'semiannual' ? 'Semestral' : 'Anual'
    }
    return key === 'monthly' ? 'Monthly' : key === 'quarterly' ? 'Quarterly' : key === 'semiannual' ? 'Semiannual' : 'Annual'
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  async function openCommercialCheckout(plan: PlanKey) {
    if (!user) {
      router.push('/login')
      return
    }

    setPendingPlan(plan)
    setError(null)

    try {
      const response = await fetch('/api/billing/plus/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const payload = (await response.json()) as { checkoutUrl?: string; error?: string }
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? 'Could not start checkout.')
      }
      window.location.assign(payload.checkoutUrl)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not start checkout.')
      setPendingPlan(null)
    }
  }

  async function openSandboxCheckout() {
    if (!user) {
      router.push('/login')
      return
    }

    setPendingPlan('sandbox')
    setError(null)
    try {
      const response = await fetch('/api/billing/asaas/test-checkout', { method: 'POST' })
      const payload = (await response.json()) as { checkoutUrl?: string; error?: string }
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? 'Could not start sandbox checkout.')
      }
      window.location.assign(payload.checkoutUrl)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not start sandbox checkout.')
      setPendingPlan(null)
    }
  }

  const freeBenefits = locale === 'pt'
    ? ['6 primeiros exercícios por tecnologia', 'Acesso às trilhas gratuitas', 'Progresso, XP e estatísticas']
    : ['First 6 exercises per technology', 'Access to free tracks', 'Progress, XP and statistics']
  const plusBenefits = locale === 'pt'
    ? ['Todos os exercícios técnicos', 'Novas trilhas premium adicionadas ao SharkType', 'Catálogo premium em expansão', 'Futuras funcionalidades premium']
    : ['All technical exercises', 'New premium tracks added to SharkType', 'An expanding premium catalog', 'Future premium features']

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <SceneWrapper />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:py-12">
        <button onClick={() => router.push('/')} className="w-fit text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--sub)' }}>
          {t('back', locale)}
        </button>

        <section className="overflow-hidden rounded-[2rem] border px-6 py-8 sm:px-10 sm:py-12" style={{ borderColor: 'color-mix(in srgb, var(--main) 20%, transparent)', background: 'radial-gradient(circle at top right, color-mix(in srgb, var(--main) 15%, transparent), transparent 34%), var(--sub-alt)' }}>
          <div className="max-w-3xl">
            <BrandLogo size={44} />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--main)' }}>SharkType Plus</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {locale === 'pt' ? 'Continue treinando além dos primeiros exercícios.' : 'Keep practicing beyond the first exercises.'}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: 'var(--sub)' }}>
              {locale === 'pt'
                ? 'Os primeiros 6 exercícios de cada tecnologia continuam gratuitos. Com o Plus, você desbloqueia o conteúdo técnico completo, recebe acesso às novas trilhas premium adicionadas ao SharkType e acompanha a evolução do catálogo.'
                : 'The first 6 exercises of each technology stay free. Plus unlocks the complete technical content, gives you access to new premium tracks added to SharkType, and grows with the catalog.'}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-6" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'var(--sub-alt)' }}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sub)' }}>Free</p>
            <div className="mt-5 space-y-3">
              {freeBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5" style={{ color: 'var(--main)' }}><CheckIcon size={15} /></span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ borderColor: 'color-mix(in srgb, var(--main) 35%, transparent)', backgroundColor: 'color-mix(in srgb, var(--main) 8%, var(--sub-alt))' }}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--main)' }}>Plus</p>
            <div className="mt-5 space-y-3">
              {plusBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5" style={{ color: 'var(--main)' }}><CheckIcon size={15} /></span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'var(--sub-alt)' }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--main)' }}>
                {locale === 'pt' ? 'Escolha seu ciclo' : 'Choose your billing cycle'}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{locale === 'pt' ? 'Um Plus, quatro opções.' : 'One Plus, four options.'}</h2>
            </div>
            {!offer?.checkoutEnabled ? (
              <span className="text-xs" style={{ color: 'var(--sub)' }}>
                {locale === 'pt' ? 'Checkout comercial ainda em homologação.' : 'Commercial checkout is still in validation.'}
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const selected = plan.key === selectedPlan
              return (
                <button
                  key={plan.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedPlan(plan.key)}
                  className="rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: selected ? 'var(--main)' : 'color-mix(in srgb, var(--sub) 18%, transparent)',
                    backgroundColor: selected ? 'color-mix(in srgb, var(--main) 10%, transparent)' : 'var(--bg)',
                    boxShadow: selected ? '0 0 34px color-mix(in srgb, var(--main) 18%, transparent)' : undefined,
                  }}
                >
                  <span className="text-sm font-semibold">{planLabel(plan.key)}</span>
                  <span className="mt-3 block text-xl font-bold" style={{ color: plan.configured ? 'var(--text)' : 'var(--sub)' }}>
                    {plan.price != null ? formatPrice(plan.price) : locale === 'pt' ? 'Preço em definição' : 'Price coming soon'}
                  </span>
                  {plan.monthlyEquivalent != null && plan.months > 1 ? (
                    <span className="mt-1 block text-xs" style={{ color: 'var(--sub)' }}>
                      {locale === 'pt' ? `${formatPrice(plan.monthlyEquivalent)}/mês equivalente` : `${formatPrice(plan.monthlyEquivalent)}/month equivalent`}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          {isPlus ? (
            <div className="mt-6 rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
              {locale === 'pt' ? 'Seu acesso SharkType Plus está ativo.' : 'Your SharkType Plus access is active.'}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void openCommercialCheckout(selectedPlan)}
              disabled={Boolean(pendingPlan) || !offer?.checkoutEnabled || !currentPlan?.configured}
              className="mt-6 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
              style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
            >
              {pendingPlan === selectedPlan
                ? t('authWorking', locale)
                : !offer?.checkoutEnabled
                  ? locale === 'pt' ? 'Assinaturas em breve' : 'Subscriptions coming soon'
                  : !currentPlan?.configured
                    ? locale === 'pt' ? 'Preço em definição' : 'Price coming soon'
                    : locale === 'pt' ? `Assinar plano ${planLabel(selectedPlan).toLowerCase()}` : `Subscribe ${planLabel(selectedPlan).toLowerCase()}`}
            </button>
          )}

          {error ? <p className="mt-4 text-sm" style={{ color: 'var(--error)' }}>{error}</p> : null}
        </section>

        {isSuperAdmin ? (
          <section className="rounded-2xl border p-5" style={{ borderColor: 'color-mix(in srgb, var(--sub) 16%, transparent)', backgroundColor: 'var(--sub-alt)' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>Developer · Asaas Sandbox</p>
            <p className="mt-2 text-xs leading-5" style={{ color: 'var(--sub)' }}>
              {locale === 'pt'
                ? 'Cria uma assinatura recorrente de teste de R$ 1,00. Esse fluxo valida checkout e webhook, mas nunca concede Plus.'
                : 'Creates a R$1.00 recurring test subscription. It validates checkout and webhooks but never grants Plus.'}
            </p>
            <button
              type="button"
              onClick={() => void openSandboxCheckout()}
              disabled={Boolean(pendingPlan)}
              className="mt-4 rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
              style={{ border: '1px solid var(--sub)', color: 'var(--text)' }}
            >
              {pendingPlan === 'sandbox' ? t('authWorking', locale) : locale === 'pt' ? 'Testar transação Asaas — R$ 1,00' : 'Test Asaas transaction — R$1.00'}
            </button>
          </section>
        ) : null}
      </div>
    </main>
  )
}
