'use client'

import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { useAuth } from '@/hooks/useAuth'
import { t, type Locale } from '@/lib/i18n'
import { XIcon } from '@/components/icons'
import type { Snippet } from '@/lib/types'
import ResultShareCard from './ResultShareCard'

interface ShareCardModalProps {
  wpm: number
  rawWpm: number
  accuracy: number
  errors: number
  duration: number
  snippet: Snippet
  languageLabel: string
  locale: Locale
  onClose: () => void
}

export default function ShareCardModal(props: ShareCardModalProps) {
  const { onClose, locale, languageLabel } = props
  const { profile } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    setError(null)
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#000',
      })
      const filename = `sharktype-${languageLabel.replace(/\s+/g, '-').toLowerCase()}-${props.wpm}wpm.png`
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate image')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 80%, transparent)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-6 sm:p-8"
        style={{ backgroundColor: 'var(--sub-alt)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 transition-all hover:scale-110"
          style={{ color: 'var(--sub)' }}
          aria-label={locale === 'pt' ? 'Fechar' : 'Close'}
        >
          <XIcon size={20} />
        </button>

        <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--text)' }}>
          {t('shareResult', locale)}
        </h2>
        <p className="mb-5 text-sm" style={{ color: 'var(--sub)' }}>
          {t('shareCardSubtitle', locale)}
        </p>

        {/* Preview escalado */}
        <div className="mb-5 overflow-hidden rounded-2xl border" style={{ borderColor: 'color-mix(in srgb, var(--sub) 20%, transparent)' }}>
          <div style={{ transformOrigin: 'top left', transform: 'scale(0.5)', width: 1200 * 0.5, height: 630 * 0.5 }}>
            <ResultShareCard
              {...props}
              ref={cardRef}
              username={profile?.username ?? null}
              locale={locale}
            />
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-2xl px-4 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full rounded-2xl px-5 py-3 text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
        >
          {downloading ? t('authWorking', locale) : t('downloadCard', locale)}
        </button>
      </div>
    </div>
  )
}
