import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'
import { t, type Locale } from '@/lib/i18n'

interface PracticeNavButtonsProps {
  onPrev: () => void
  onRestart: () => void
  onNext: () => void
  locale: Locale
  isTyping: boolean
}

function NavButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150 hover:scale-110 active:scale-90 sm:h-auto sm:w-auto sm:p-2.5"
      style={{ color: 'var(--sub)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export default function PracticeNavButtons({ onPrev, onRestart, onNext, locale, isTyping }: PracticeNavButtonsProps) {
  return (
    <div className={`mt-6 flex w-full max-w-3xl justify-center transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <NavButton onClick={onPrev} label={t('prev', locale)}>
          <ArrowLeftIcon size={18} />
        </NavButton>
        <NavButton onClick={onRestart} label={t('restart', locale)}>
          <RefreshIcon size={18} />
        </NavButton>
        <NavButton onClick={onNext} label={t('next', locale)}>
          <ArrowRightIcon size={18} />
        </NavButton>
      </div>
    </div>
  )
}
