'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'

interface EntitlementRow {
  id: string
  user_id: string
  status: string
  source: string
  reason: string | null
  updated_at: string
  profile?: {
    username?: string
    display_name?: string | null
    is_super_user?: boolean
  } | null
}

export default function PlusAdminPage() {
  const router = useRouter()
  const { profile, isLoading } = useAuth()
  const { locale } = useLocale()
  const [rows, setRows] = useState<EntitlementRow[]>([])
  const [username, setUsername] = useState('')
  const [reason, setReason] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function loadRows() {
    const response = await fetch('/api/admin/plus', { cache: 'no-store' })
    if (!response.ok) throw new Error((await response.json() as { error?: string }).error ?? 'Request failed.')
    const payload = (await response.json()) as { entitlements?: EntitlementRow[] }
    setRows(payload.entitlements ?? [])
  }

  useEffect(() => {
    if (isLoading) return
    if (!profile?.isSuperUser) {
      router.replace('/')
      return
    }
    void loadRows().catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not load Plus users.'))
  }, [isLoading, profile?.isSuperUser, router])

  async function submit(action: 'grant' | 'revoke', targetUsername = username) {
    setPending(true)
    setError(null)
    setNotice(null)

    try {
      const response = await fetch('/api/admin/plus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, username: targetUsername, reason }),
      })

      if (!response.ok) {
        throw new Error((await response.json() as { error?: string }).error ?? 'Request failed.')
      }

      setNotice(action === 'grant'
        ? (locale === 'pt' ? 'Plus vitalício concedido.' : 'Lifetime Plus granted.')
        : (locale === 'pt' ? 'Plus manual revogado.' : 'Manual Plus revoked.'))
      setUsername('')
      setReason('')
      await loadRows()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not update Plus access.')
    } finally {
      setPending(false)
    }
  }

  if (isLoading) {
    return <main className="min-h-screen p-6" style={{ color: 'var(--sub)' }}>{t('loading', locale)}</main>
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => router.push('/')} className="text-sm" style={{ color: 'var(--sub)' }}>
            {t('back', locale)}
          </button>
          <button
            onClick={() => router.push('/admin/billing')}
            className="rounded-lg px-3 py-2 text-xs font-semibold"
            style={{ border: '1px solid var(--sub)', color: 'var(--text)' }}
          >
            {locale === 'pt' ? 'Abrir painel Asaas' : 'Open Asaas panel'}
          </button>
        </div>

        <h1 className="mb-2 text-2xl font-bold">SharkType Plus Admin</h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--sub)' }}>
          {locale === 'pt'
            ? 'Conceda ou remova Plus manual vitalício. Assinaturas pagas do Asaas continuam independentes.'
            : 'Grant or revoke lifetime manual Plus. Paid Asaas subscriptions remain independent.'}
        </p>

        <section className="mb-6 rounded-xl p-4" style={{ backgroundColor: 'var(--sub-alt)' }}>
          <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="username"
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid color-mix(in srgb, var(--sub) 28%, transparent)' }}
            />
            <input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={locale === 'pt' ? 'motivo (opcional)' : 'reason (optional)'}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid color-mix(in srgb, var(--sub) 28%, transparent)' }}
            />
            <button
              disabled={pending || username.trim().length === 0}
              onClick={() => submit('grant')}
              className="rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
            >
              {locale === 'pt' ? 'Dar Plus vitalício' : 'Grant lifetime Plus'}
            </button>
          </div>
          {notice ? <p className="mt-3 text-sm" style={{ color: 'var(--main)' }}>{notice}</p> : null}
          {error ? <p className="mt-3 text-sm" style={{ color: 'var(--error)' }}>{error}</p> : null}
        </section>

        <section className="overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--sub-alt)' }}>
          {rows.length === 0 ? (
            <p className="p-4 text-sm" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Nenhum entitlement Plus encontrado.' : 'No Plus entitlements found.'}</p>
          ) : rows.map((row) => {
            const rowUsername = row.profile?.username ?? row.user_id
            return (
              <div key={row.id} className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0"
                style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)' }}>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{rowUsername}</div>
                  <div className="text-xs" style={{ color: 'var(--sub)' }}>
                    {row.status} · {row.source} · {new Date(row.updated_at).toLocaleString()}
                  </div>
                  {row.reason ? <div className="mt-1 truncate text-xs" style={{ color: 'var(--sub)' }}>{row.reason}</div> : null}
                </div>
                {row.source === 'manual_grant' && row.status !== 'cancelled' ? (
                  <button
                    disabled={pending}
                    onClick={() => submit('revoke', rowUsername)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--error) 16%, transparent)', color: 'var(--error)' }}
                  >
                    {locale === 'pt' ? 'Revogar' : 'Revoke'}
                  </button>
                ) : null}
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
