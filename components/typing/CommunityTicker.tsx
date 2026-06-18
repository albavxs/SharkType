'use client'

import Link from 'next/link'
import { Locale, t } from '@/lib/i18n'

interface CommunityTickerProps {
  locale?: Locale
  className?: string
}

export default function CommunityTicker({ locale = 'pt', className = '' }: CommunityTickerProps) {
  const segments = [
    t('communityTicker', locale),
    t('communityTickerExtra', locale),
  ]
  const marqueeText = `${segments.join(' • ')} • `

  return (
    <Link
      href="/community"
      className={`group block overflow-hidden rounded-md border px-0 py-1 transition-all duration-150 hover:brightness-110 ${className}`}
      style={{
        borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--sub-alt) 88%, transparent)',
      }}
      aria-label={marqueeText.trim()}
    >
      <div className="community-ticker-track">
        <span className="community-ticker-segment">{marqueeText}</span>
        <span className="community-ticker-segment" aria-hidden="true">{marqueeText}</span>
      </div>
    </Link>
  )
}
