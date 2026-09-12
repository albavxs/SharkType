'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TypingArea from '@/components/typing/TypingArea'
import SnippetInfo from '@/components/typing/SnippetInfo'
import SceneWrapper from '@/components/three/SceneWrapper'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useLocale } from '@/hooks/useLocale'
import type { LanguageMeta, Snippet } from '@/lib/types'

type MasteryPayload = {
  availableLanguages: LanguageMeta[]
  selectedLanguage: LanguageMeta | null
  snippets: Snippet[]
  mastery: {
    eligible: boolean
    available: boolean
    challengeCount: number
    totalStars: number
  }
  error?: string
  code?: string
}

export default function TrackMasteryPage() {
  const params = useParams<{ track: string }>()
  const router = useRouter()
  const { locale } = useLocale()
  const { enabled: lenient } = useLenientKeyboard()
  const trackId = decodeURIComponent(params.track ?? '')
  const [payload, setPayload] = useState<MasteryPayload | null>(null)
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const currentSnippet = payload?.snippets[currentIndex] ?? null
  const displayCode = currentSnippet?.code ?? ''

  const handleFinish = useCallback(() => {
    if (!currentSnippet) return
    setCompleted((previous) => {
      const next = new Set(previous)
      next.add(currentSnippet.id)
      return next
    })
  }, [currentSnippet])

  const engine = useTypingEngine(displayCode, handleFinish, { lenient })

  const loadMastery = useCallback(async (languageId?: string | null) => {
    setLoading(true)
    setError(null)

    const query = languageId ? `?languageId=${encodeURIComponent(languageId)}` : ''
    try {
      const response = await fetch(`/api/tracks/${encodeURIComponent(trackId)}/mastery${query}`, { cache: 'no-store' })
      const data = (await response.json()) as MasteryPayload

      if (!response.ok) {
        if (response.status === 403) {
          router.replace('/plus')
          return
        }
        throw new Error(data.error ?? 'Could not load Mastery.')
      }

      setPayload(data)
      setSelectedLanguageId(data.selectedLanguage?.id ?? null)
      setCurrentIndex(0)
      engine.reset()
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load Mastery.')
    } finally {
      setLoading(false)
    }
  }, [engine, router, trackId])

  useEffect(() => {
    void loadMastery()
  }, [loadMastery])

  const earnedStars = completed.size * 3
  const totalStars = payload?.mastery.totalStars ?? 0
  const progress = payload?.snippets.length ? Math.round((completed.size / payload.snippets.length) * 100) : 0

  const languageOptions = useMemo(() => payload?.availableLanguages ?? [], [payload?.availableLanguages])

  function selectChallenge(index: number) {
    setCurrentIndex(index)
    engine.reset()
  }

  async function selectLanguage(languageId: string) {
    setSelectedLanguageId(languageId)
    setCompleted(new Set())
    await loadMastery(languageId)
  }

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <SceneWrapper />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push('/tracks')}
            className="cursor-pointer text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
            style={{ color: 'var(--sub)' }}
          >
            ← {locale === 'pt' ? 'Trilhas' : 'Tracks'}
          </button>
          <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)' }}>
            ✦ Mastery
          </span>
        </div>

        <section className="mt-6 rounded-[2rem] border p-5 sm:p-7" style={{ borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--main) 9%, transparent), transparent 45%), var(--sub-alt)' }}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--main)' }}>{trackId}</p>
              <h1 className="mt-2 text-3xl font-bold">{locale === 'pt' ? 'Mastery avançado' : 'Advanced Mastery'}</h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--sub)' }}>
                {locale === 'pt' ? 'Complete os desafios avançados e acumule estrelas.' : 'Complete advanced challenges and earn stars.'}
              </p>
            </div>

            {languageOptions.length > 1 ? (
              <select
                value={selectedLanguageId ?? ''}
                onChange={(event) => void selectLanguage(event.target.value)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm outline-none focus-visible:ring-2"
                style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid color-mix(in srgb, var(--sub) 26%, transparent)' }}
              >
                {languageOptions.map((language) => <option key={language.id} value={language.id}>{language.label}</option>)}
              </select>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 72%, transparent)' }}>
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Progresso' : 'Progress'}</p>
              <p className="mt-1 text-xl font-bold">{progress}%</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 72%, transparent)' }}>
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Estrelas' : 'Stars'}</p>
              <p className="mt-1 text-xl font-bold" style={{ color: 'var(--main)' }}>{earnedStars}/{totalStars} ★</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 72%, transparent)' }}>
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--sub)' }}>{locale === 'pt' ? 'Desafios' : 'Challenges'}</p>
              <p className="mt-1 text-xl font-bold">{completed.size}/{payload?.snippets.length ?? 0}</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="mt-8 rounded-2xl p-6 text-sm" style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--sub)' }}>{locale === 'pt' ? 'Carregando Mastery...' : 'Loading Mastery...'}</div>
        ) : error ? (
          <div className="mt-8 rounded-2xl p-6 text-sm" style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--error)' }}>{error}</div>
        ) : currentSnippet && payload?.selectedLanguage ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <section className="min-w-0 rounded-2xl border p-4 sm:p-6" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 90%, transparent)' }}>
              <SnippetInfo
                snippet={currentSnippet}
                languageLabel={payload.selectedLanguage.label}
                languageColor={payload.selectedLanguage.color}
                current={currentIndex + 1}
                total={payload.snippets.length}
                locale={locale}
              />

              <div className="mt-6">
                <TypingArea
                  code={displayCode}
                  charStatuses={engine.state.charStatuses}
                  currentIndex={engine.state.currentIndex}
                  onKey={engine.handleKey}
                  languageId={payload.selectedLanguage.id}
                  isTyping={engine.state.status === 'running'}
                  locale={locale}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--sub)' }}>
                <span>{engine.wpm} WPM · {engine.accuracy}% · {engine.state.errors} {locale === 'pt' ? 'erros' : 'errors'}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={engine.reset} className="cursor-pointer rounded-lg px-3 py-2 font-semibold transition-all hover:brightness-110" style={{ border: '1px solid color-mix(in srgb, var(--sub) 28%, transparent)', color: 'var(--text)' }}>
                    {locale === 'pt' ? 'Reiniciar' : 'Reset'}
                  </button>
                  <button
                    type="button"
                    disabled={currentIndex >= payload.snippets.length - 1}
                    onClick={() => selectChallenge(currentIndex + 1)}
                    className="rounded-lg px-3 py-2 font-semibold transition-all enabled:cursor-pointer enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                    style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                  >
                    {locale === 'pt' ? 'Próximo' : 'Next'} →
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-2">
              {payload.snippets.map((snippet, index) => {
                const isCurrent = index === currentIndex
                const isDone = completed.has(snippet.id)
                return (
                  <button
                    key={snippet.id}
                    type="button"
                    onClick={() => selectChallenge(index)}
                    className="w-full cursor-pointer rounded-xl border p-3 text-left transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2"
                    style={{ borderColor: isCurrent ? 'var(--main)' : 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: isCurrent ? 'color-mix(in srgb, var(--main) 8%, transparent)' : 'var(--sub-alt)' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">{index + 1}. {snippet.concept[locale]}</span>
                      <span style={{ color: isDone ? 'var(--main)' : 'var(--sub)' }}>{isDone ? '★★★' : '☆☆☆'}</span>
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--sub)' }}>{snippet.difficulty}</p>
                  </button>
                )
              })}
            </aside>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl p-6 text-sm" style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--sub)' }}>{locale === 'pt' ? 'Nenhum desafio Mastery disponível.' : 'No Mastery challenges available.'}</div>
        )}
      </div>
    </main>
  )
}
