import XPBar from './XPBar'
import { t, type Locale } from '@/lib/i18n'
import type { PublicProfile } from '@/lib/server/profile-store'
import { getLanguageById } from '@/data'

interface ProfileStatsProps {
  profile: PublicProfile
  locale: Locale
}

export default function ProfileStats({ profile, locale }: ProfileStatsProps) {
  return (
    <div className="space-y-5 rounded-[2rem] border p-5 sm:p-7"
      style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>

      <XPBar totalXP={profile.totalXP} />

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'XP', value: profile.totalXP, accent: 'var(--main)' },
          { label: t('statsBestWPM', locale), value: profile.bestWPM, accent: 'var(--text)' },
          { label: t('statsTotalSessions', locale), value: profile.totalSessions, accent: 'var(--text)' },
          { label: t('statsBestAccuracy', locale), value: `${profile.bestAccuracy}%`, accent: 'var(--main)' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl px-4 py-4"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)' }}>
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--sub)' }}>{item.label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: item.accent }}>{item.value}</div>
          </div>
        ))}
      </div>

      {profile.topLanguages.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
            {t('topLanguages', locale)}
          </h2>
          <div className="space-y-2">
            {profile.topLanguages.map(lang => {
              const langInfo = getLanguageById(lang.languageId)
              return (
                <div key={lang.languageId} className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)' }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langInfo?.color ?? 'var(--sub)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {langInfo?.label ?? lang.languageId}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs tabular-nums sm:flex-row sm:items-center sm:gap-4" style={{ color: 'var(--sub)' }}>
                    <span>{lang.totalSessions} {t('sessionsShort', locale)}</span>
                    <span>{lang.bestWPM} WPM</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
