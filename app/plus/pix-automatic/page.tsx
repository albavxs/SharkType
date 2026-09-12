'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SceneWrapper from '@/components/three/SceneWrapper'
import { useAuth } from '@/hooks/useAuth'
import { useUserAccess } from '@/hooks/useUserAccess'
import { useLocale } from '@/hooks/useLocale'

type PlanKey = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

type PixResponse = {
  authorizationId: string
  status: string
  plan: PlanKey
  amount: number
  frequency: string
  sandbox: boolean
  qrCode: {
    payload: string | null
    encodedImage: string | null
    expirationDate: string | null
    conciliationIdentifier: string | null
  }
  error?: string
}

function isPlanKey(value: string | null): value is PlanKey {
  return value === 'monthly' || value === 'quarterly' || value === 'semiannual' || value === 'annual'
}

export default function PixAutomaticPage() {
  return (
    <Suspense fallback={null}>
      <PixAutomaticPageInner />
    </Suspense>
  )
}

function PixAutomaticPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()
  const { isPlus, isLoading: accessLoading } = useUserAccess()
  const { locale } = useLocale()
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [result, setResult] = useState<PixResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const plan = useMemo<PlanKey>(() => {
    const requested = searchParams.get('plan')
    return isPlanKey(requested) ? requested : 'monthly'
  }, [searchParams])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, router, user])

  useEffect(() => {
    if (!accessLoading && isPlus) router.replace('/settings/billing')
  }, [accessLoading, isPlus, router])

  function formatDocument(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 14)
    if (digits.length <= 11) {
      return digits
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2')
    }
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\/\d{4})(\d)/, '$1-$2')
  }

  async function createAuthorization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setCopied(false)

    try {
      const response = await fetch('/api/billing/plus/pix-automatic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, cpfCnpj }),
      })
      const payload = (await response.json()) as PixResponse
      if (!response.ok) throw new Error(payload.error ?? 'Could not create Pix Automatic authorization.')
      setResult(payload)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not create Pix Automatic authorization.')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyPayload() {
    if (!result?.qrCode.payload) return
    await navigator.clipboard.writeText(result.qrCode.payload)
    setCopied(true)
  }

  const qrImage = result?.qrCode.encodedImage
    ? result.qrCode.encodedImage.startsWith('data:')
      ? result.qrCode.encodedImage
      : `data:image/png;base64,${result.qrCode.encodedImage}`
    : null

  if (authLoading || accessLoading || !user || isPlus) {
    return (
      <main className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <SceneWrapper />
        <div className="relative z-10 flex min-h-screen items-center justify-center text-sm" style={{ color: 'var(--sub)' }}>
          {locale === 'pt' ? 'Carregando...' : 'Loading...'}
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <SceneWrapper />
      <div className="relative z-10 mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer text-sm transition-opacity hover:opacity-80"
          style={{ color: 'var(--sub)' }}
        >
          ← {locale === 'pt' ? 'Voltar' : 'Back'}
        </button>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--main)' }}>Pix Automático</p>
          <h1 className="mt-2 text-3xl font-bold">SharkType Plus</h1>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--sub)' }}>
            {locale === 'pt'
              ? 'Autorize uma vez pelo Pix. Depois, o Asaas cuida das próximas cobranças automaticamente e o SharkType apenas sincroniza seu acesso Plus.'
              : 'Authorize once with Pix. Asaas handles future charges automatically while SharkType only syncs your Plus access.'}
          </p>
        </div>

        {!result ? (
          <form onSubmit={createAuthorization} className="mt-8 rounded-[2rem] border p-6" style={{ borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)', backgroundColor: 'var(--sub-alt)' }}>
            <label className="block text-sm font-medium">
              {locale === 'pt' ? 'CPF ou CNPJ do pagador' : 'Payer CPF or CNPJ'}
              <input
                value={cpfCnpj}
                onChange={(event) => setCpfCnpj(formatDocument(event.target.value))}
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
                style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
              />
            </label>
            <p className="mt-2 text-xs leading-5" style={{ color: 'var(--sub)' }}>
              {locale === 'pt'
                ? 'O documento é enviado ao Asaas para identificar o pagador e não é salvo no banco do SharkType.'
                : 'The document is sent to Asaas to identify the payer and is not stored in SharkType.'}
            </p>

            {error ? <p className="mt-4 text-sm" style={{ color: 'var(--error)' }}>{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || ![11, 14].includes(cpfCnpj.replace(/\D/g, '').length)}
              className="mt-6 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition-all enabled:cursor-pointer enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
            >
              {submitting
                ? locale === 'pt' ? 'Gerando autorização...' : 'Creating authorization...'
                : locale === 'pt' ? 'Gerar Pix Automático' : 'Create Automatic Pix'}
            </button>
          </form>
        ) : (
          <section className="mt-8 rounded-[2rem] border p-6 text-center" style={{ borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)', backgroundColor: 'var(--sub-alt)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--main)' }}>
              {locale === 'pt' ? 'Autorize no seu banco' : 'Authorize in your bank'}
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5" style={{ color: 'var(--sub)' }}>
              {locale === 'pt'
                ? 'O primeiro Pix confirma o pagamento e a autorização recorrente. O Plus é liberado automaticamente quando o Asaas confirmar a ativação pelo webhook.'
                : 'The first Pix confirms payment and recurring authorization. Plus is activated automatically after Asaas confirms activation through the webhook.'}
            </p>

            {qrImage ? (
              <img src={qrImage} alt="Pix Automatic QR Code" className="mx-auto mt-6 h-56 w-56 rounded-xl bg-white p-3 object-contain" />
            ) : null}

            {result.qrCode.payload ? (
              <div className="mt-6 text-left">
                <label className="text-xs font-medium" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Pix copia e cola' : 'Pix copy and paste'}</label>
                <div className="mt-2 flex gap-2">
                  <input
                    readOnly
                    value={result.qrCode.payload}
                    className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  />
                  <button type="button" onClick={() => void copyPayload()} className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
                    {copied ? locale === 'pt' ? 'Copiado' : 'Copied' : locale === 'pt' ? 'Copiar' : 'Copy'}
                  </button>
                </div>
              </div>
            ) : null}

            {result.sandbox ? (
              <p className="mt-5 rounded-xl px-3 py-2 text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--sub) 10%, transparent)', color: 'var(--sub)' }}>
                Sandbox: esta autorização serve apenas para homologação e não concede Plus real.
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => router.push('/settings/billing')}
              className="mt-6 cursor-pointer text-sm font-semibold hover:underline"
              style={{ color: 'var(--main)' }}
            >
              {locale === 'pt' ? 'Ver status do plano →' : 'View plan status →'}
            </button>
          </section>
        )}
      </div>
    </main>
  )
}
