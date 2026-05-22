'use client'

import { forwardRef } from 'react'
import type { Snippet } from '@/lib/types'
import { t, type Locale } from '@/lib/i18n'

interface ResultShareCardProps {
  wpm: number
  rawWpm: number
  accuracy: number
  errors: number
  duration: number
  snippet: Snippet
  languageLabel: string
  username: string | null
  locale: Locale
}

/**
 * Card visual fixo 1200x630 (Twitter card format) para screenshot via html-to-image.
 * Nao eh responsivo de proposito — precisa render consistente entre devices.
 */
const ResultShareCard = forwardRef<HTMLDivElement, ResultShareCardProps>(function ResultShareCard(
  { wpm, rawWpm, accuracy, errors, duration, snippet, languageLabel, username, locale },
  ref,
) {
  const diff = t(snippet.difficulty, locale)
  return (
    <div
      ref={ref}
      style={{
        width: 1200,
        height: 630,
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        padding: 64,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-geist-mono), monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 800 }}>
          Shark<span style={{ color: 'var(--main)' }}>Type</span>
        </div>
        {username && (
          <div style={{ fontSize: 24, color: 'var(--sub)' }}>@{username}</div>
        )}
      </div>

      {/* Center: WPM destaque */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 20, color: 'var(--sub)', textTransform: 'uppercase', letterSpacing: 8 }}>
          {languageLabel} · {diff}
        </div>
        <div style={{ fontSize: 240, fontWeight: 800, color: 'var(--main)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {wpm}
        </div>
        <div style={{ fontSize: 28, color: 'var(--sub)', letterSpacing: 4 }}>WPM</div>
      </div>

      {/* Bottom stats grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32 }}>
        <Stat label="raw" value={String(rawWpm)} />
        <Stat label="acc" value={`${accuracy}%`} />
        <Stat label="errors" value={String(errors)} />
        <Stat label="time" value={`${duration}s`} />
      </div>
    </div>
  )
})

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 18, color: 'var(--sub)', textTransform: 'uppercase', letterSpacing: 4 }}>{label}</div>
      <div style={{ fontSize: 56, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}

export default ResultShareCard
