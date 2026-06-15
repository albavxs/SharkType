'use client'

import { useState } from 'react'
import { Snippet } from '@/lib/types'
import { t, Locale } from '@/lib/i18n'

interface SnippetInfoProps {
  snippet: Snippet
  languageLabel: string
  languageColor: string
  current: number
  total: number
  locale: Locale
}

export default function SnippetInfo({ snippet, languageLabel, languageColor, current, total, locale }: SnippetInfoProps) {
  const [showDetail, setShowDetail] = useState(true)
  const diffLabel = snippet.difficulty === 'easy' ? t('easy', locale) : snippet.difficulty === 'medium' ? t('medium', locale) : t('hard', locale)

  return (
    <div className="min-w-0">
      {/* Metadata line */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor }} />
        <span className="text-xs" style={{ color: 'var(--sub)' }}>{languageLabel}</span>
        <span className="hidden sm:inline" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span className="min-w-0 break-words text-xs font-medium" style={{ color: 'var(--sub)' }}>{snippet.concept[locale]}</span>
        <span className="text-xs sm:ml-auto" style={{ color: 'var(--sub)' }}>{current}/{total}</span>
        {snippet.prompt?.[locale] && (
          <button onClick={() => setShowDetail(p => !p)}
            className="text-xs font-medium cursor-pointer transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
            style={{ color: 'var(--main)' }}>
            {showDetail ? t('hide', locale) : t('show', locale)}
          </button>
        )}
      </div>

      {/* Expandable explanation card */}
      {showDetail && snippet.prompt?.[locale] && (
        <div className="mt-3 rounded-lg px-3 py-3 text-sm leading-relaxed animate-fade-in sm:px-4"
          style={{ backgroundColor: 'var(--sub-alt)', borderLeft: '3px solid var(--main)' }}>
          <div className="text-sm font-semibold mb-1.5" style={{ color: 'var(--main)' }}>{snippet.concept[locale]}</div>
          <p style={{ color: 'var(--text)' }}>{snippet.prompt?.[locale]}</p>
          <div className="mt-2 text-[10px]" style={{ color: 'var(--sub)' }}>{languageLabel} · {diffLabel}</div>
        </div>
      )}
    </div>
  )
}
