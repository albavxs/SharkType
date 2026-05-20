import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons'
import { t, type Locale } from '@/lib/i18n'

interface TrackBreadcrumbProps {
  trackName: string
  current: number
  total: number
  showProgress: boolean
  locale: Locale
  isTyping: boolean
}

export default function TrackBreadcrumb({ trackName, current, total, showProgress, locale, isTyping }: TrackBreadcrumbProps) {
  return (
    <div className={`px-3 sm:px-6 py-2 flex items-center gap-2 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      <Link href="/tracks" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--sub)' }}>
        <ArrowLeftIcon size={14} /> {t('pageTracks', locale)}
      </Link>
      <span style={{ color: 'var(--sub)', opacity: 0.4 }}>/</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{trackName}</span>
      {showProgress && (
        <span className="text-xs ml-auto" style={{ color: 'var(--sub)' }}>{current}/{total}</span>
      )}
    </div>
  )
}
