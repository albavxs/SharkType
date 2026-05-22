import { t, type Locale } from '@/lib/i18n'

interface FollowerCountsProps {
  followers: number
  following: number
  locale: Locale
}

export default function FollowerCounts({ followers, following, locale }: FollowerCountsProps) {
  return (
    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--sub)' }}>
      <span>
        <span className="font-semibold tabular-nums" style={{ color: 'var(--text)' }}>{followers}</span>
        {' '}
        {t('followers', locale)}
      </span>
      <span>
        <span className="font-semibold tabular-nums" style={{ color: 'var(--text)' }}>{following}</span>
        {' '}
        {t('following', locale)}
      </span>
    </div>
  )
}
