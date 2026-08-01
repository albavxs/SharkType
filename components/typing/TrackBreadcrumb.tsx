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
  showKeyboardToggle?: boolean
  keyboardEnabled?: boolean
  onKeyboardToggle?: () => void
}

export default function TrackBreadcrumb({ trackName, current, total, showProgress, locale, isTyping, showKeyboardToggle = false, keyboardEnabled = false, onKeyboardToggle }: TrackBreadcrumbProps) {
  return (
    <div className={`px-3 sm:px-6 py-2 flex items-center gap-2 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      <Link href="/tracks" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--sub)' }}>
        <ArrowLeftIcon size={14} /> {t('pageTracks', locale)}
      </Link>
      <span style={{ color: 'var(--sub)', opacity: 0.4 }}>/</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{trackName}</span>
      {showKeyboardToggle && onKeyboardToggle ? (
        <button
          type="button"
          onClick={onKeyboardToggle}
          aria-pressed={keyboardEnabled}
          aria-label={t(keyboardEnabled ? 'virtualKeyboardHide' : 'virtualKeyboardShow', locale)}
          title={t(keyboardEnabled ? 'virtualKeyboardHide' : 'virtualKeyboardShow', locale)}
          className="ml-auto rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] transition-all duration-150 hover:brightness-110 active:scale-95"
          style={{
            borderColor: keyboardEnabled ? 'color-mix(in srgb, var(--main) 48%, transparent)' : 'color-mix(in srgb, var(--sub) 22%, transparent)',
            backgroundColor: keyboardEnabled ? 'color-mix(in srgb, var(--main) 14%, transparent)' : 'transparent',
            color: keyboardEnabled ? 'var(--main)' : 'var(--sub)',
          }}
        >
          {t('virtualKeyboard', locale)}
        </button>
      ) : null}
      {showProgress && (
        <span className="text-xs" style={{ color: 'var(--sub)' }}>{current}/{total}</span>
      )}
    </div>
  )
}
