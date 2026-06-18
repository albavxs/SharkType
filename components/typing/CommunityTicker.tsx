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
    t('communityTicker', locale),
    t('communityTickerExtra', locale),
  ]

  return (
    <Link
      href="/community"
      className={`group block overflow-hidden rounded-none border px-0 py-1 transition-all duration-150 hover:brightness-110 ${className}`}
      style={{
        borderColor: 'color-mix(in srgb, var(--main) 28%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--sub-alt) 88%, transparent)',
      }}
      aria-label={segments[0]}
    >
      <div className="community-ticker-track">
        {segments.map((segment, index) => (
          <span key={`${segment}-${index}`} className="community-ticker-segment" aria-hidden={index > 0}>
            {segment}
          </span>
        ))}
      </div>
    </Link>
  )
}
