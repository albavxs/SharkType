'use client'

import { useState, useEffect } from 'react'
import { resetProgress } from '@/lib/gamification'
import { getSoundPref, setSoundPref, setAllSoundPrefs, SoundProfile, SoundEvent, soundProfiles, previewSound } from '@/lib/sounds'
import { ArrowLeftIcon } from '@/components/icons'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Link from 'next/link'

const soundEvents: { key: SoundEvent; labelKey: string }[] = [
  { key: 'key', labelKey: 'soundKey' },
  { key: 'space', labelKey: 'soundSpace' },
  { key: 'error', labelKey: 'soundError' },
  { key: 'complete', labelKey: 'soundComplete' },
]

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Record<SoundEvent, SoundProfile>>({ key: 'off', space: 'off', error: 'off', complete: 'off' })
  const [showConfirm, setShowConfirm] = useState(false)
  const { locale } = useLocale()

  useEffect(() => {
    setPrefs({ key: getSoundPref('key'), space: getSoundPref('space'), error: getSoundPref('error'), complete: getSoundPref('complete') })
  }, [])

  function handleChange(event: SoundEvent, profile: SoundProfile) {
    setPrefs(p => ({ ...p, [event]: profile }))
    setSoundPref(event, profile)
    previewSound(event, profile)
  }

  function handleSetAll(profile: SoundProfile) {
    setAllSoundPrefs(profile)
    setPrefs({ key: profile, space: profile, error: profile, complete: profile })
    previewSound('key', profile)
  }

  function handleReset() {
    resetProgress()
    setShowConfirm(false)
    window.location.href = '/'
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="px-3 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer" style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={14} />
          {t('back', locale)}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
        <div className="w-full max-w-lg space-y-6 sm:space-y-8">
          <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
            {t('pageSettings', locale)}
          </h1>

          {/* Quick set all */}
          <div className="py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
            <span className="text-sm mb-3 block font-medium" style={{ color: 'var(--text)' }}>{t('soundAll', locale)}</span>
            <p className="text-[10px] mb-3" style={{ color: 'var(--sub)' }}>{t('soundAllDesc', locale)}</p>
            <div className="flex flex-wrap gap-2">
              {soundProfiles.map(o => {
                const allSame = prefs.key === o.key && prefs.space === o.key && prefs.error === o.key && prefs.complete === o.key
                return (
                  <button key={o.key} onClick={() => handleSetAll(o.key)}
                    className="px-3 py-1.5 text-xs rounded transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ border: `1px solid ${allSame ? 'var(--main)' : 'var(--sub)'}`, color: allSame ? 'var(--main)' : 'var(--sub)' }}>
                    {o.key === 'off' ? t('soundOff', locale) : o.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Per-event controls */}
          {soundEvents.map(ev => (
            <div key={ev.key} className="py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
              <span className="text-sm mb-3 block" style={{ color: 'var(--text)' }}>{t('soundPrefix', locale)} — {t(ev.labelKey, locale)}</span>
              <div className="flex flex-wrap gap-2">
                {soundProfiles.map(o => (
                  <button key={o.key} onClick={() => handleChange(ev.key, o.key)}
                    className="px-3 py-1.5 text-xs rounded transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ border: `1px solid ${prefs[ev.key] === o.key ? 'var(--main)' : 'var(--sub)'}`, color: prefs[ev.key] === o.key ? 'var(--main)' : 'var(--sub)' }}>
                    {o.key === 'off' ? t('soundOff', locale) : o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Reset */}
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
            <span className="text-sm" style={{ color: 'var(--text)' }}>{t('resetProgress', locale)}</span>
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="px-3 py-1 text-xs rounded transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 20%, transparent)', color: 'var(--error)' }}>
                  {t('confirm', locale)}
                </button>
                <button onClick={() => setShowConfirm(false)} className="px-3 py-1 text-xs rounded transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer" style={{ border: '1px solid var(--sub)', color: 'var(--sub)' }}>
                  {t('cancel', locale)}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowConfirm(true)} className="px-3 py-1 text-xs rounded transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer" style={{ border: '1px solid var(--sub)', color: 'var(--error)' }}>
                {t('resetBtn', locale)}
              </button>
            )}
          </div>

          <div className="pt-4">
            <Link href="/stats" className="text-xs transition-opacity hover:opacity-80" style={{ color: 'var(--sub)' }}>
              {t('viewStats', locale)} →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
