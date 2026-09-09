'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import BrandLogo from '@/components/brand/BrandLogo'

export default function PlusPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { locale } = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function startCheckout() {
    if (!user) {
      router.push('/login')
      return
    }

    setPending(true)
    setError(null)

    try {
      const response = await fetch('/api/billing/plus/checkout', { method: 'POST' })
      const payload = (await response.json()) as { checkoutUrl?: string; error?: string }
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? 'Could not start checkout.')
      }
      // Checkout is hosted by Asaas, outside the Next.js router.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(payload.checkoutUrl)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not start checkout.')
      setPending(false)
    }
  }

  const isPlus = profile?.isSuperUser || profile?.username === 'sharkcoder'

  return (
    <main className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <button onClick={() => router.push('/')} className="w-fit text-sm" style={{ color: 'var(--sub)' }}>
          {t('back', locale)}
        </button>

        <section className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: 'var(--sub-alt)' }}>
          <div className="mb-8">
            <BrandLogo size={42} />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase" style={{ color: 'var(--main)' }}>SharkType Plus</p>
          <h1 className="mb-3 text-3xl font-bold">
            {locale === 'pt' ? 'Desbloqueie os treinos avançados' : 'Unlock advanced practice'}
          </h1>
          <p className="mb-6 text-sm leading-6" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? 'Os 6 primeiros snippets de cada trilha ficam gratuitos. O Plus libera os snippets avançados de programação, idiomas e trilhas focadas.'
              : 'The first 6 snippets in each track stay free. Plus unlocks advanced programming, language, and focused-track snippets.'}
          </p>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {['Code typing', 'Programming drills', 'Typing languages'].map((item) => (
              <div key={item} className="rounded-lg p-3 text-sm" style={{ backgroundColor: 'var(--bg)' }}>
                {item}
              </div>
            ))}
          </div>

          {isPlus ? (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
              {locale === 'pt' ? 'Seu acesso Plus está ativo.' : 'Your Plus access is active.'}
            </p>
          ) : (
            <button
              onClick={startCheckout}
              disabled={pending}
              className="rounded-lg px-5 py-3 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
            >
              {pending ? t('authWorking', locale) : locale === 'pt' ? 'Assinar Plus' : 'Subscribe to Plus'}
            </button>
          )}

          {error ? <p className="mt-4 text-sm" style={{ color: 'var(--error)' }}>{error}</p> : null}
        </section>
      </div>
    </main>
  )
}
