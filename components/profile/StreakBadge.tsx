import { FlameIcon } from '@/components/icons'
import { t, type Locale } from '@/lib/i18n'

interface StreakBadgeProps {
  streak: number
  locale: Locale
  size?: 'sm' | 'md'
}

export default function StreakBadge({ streak, locale, size = 'md' }: StreakBadgeProps) {
  if (streak <= 0) return null
  const iconSize = size === 'sm' ? 14 : 18
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm'
  const label = streak === 1 ? t('dayStreak', locale) : t('daysStreak', locale)
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${textClass}`}
      style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}>
      <FlameIcon size={iconSize} />
      <span className="tabular-nums font-semibold">{streak}</span>
      <span style={{ opacity: 0.85 }}>{label}</span>
    </span>
  )
}
