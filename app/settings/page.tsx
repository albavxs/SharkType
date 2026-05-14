'use client'

import { useState, useEffect } from 'react'
import { getSoundPref, setSoundPref, setAllSoundPrefs, SoundProfile, SoundEvent, soundProfiles, previewSound } from '@/lib/sounds'
import { ArrowLeftIcon, UserIcon } from '@/components/icons'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'

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
  const { resetCurrentProgress } = useProgress()
  const { profile, updateProfile, user } = useAuth()
  const [profileForm, setProfileForm] = useState({
    username: '',
    displayName: '',
    avatarUrl: ''
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username || '',
        displayName: profile.displayName || '',
        avatarUrl: profile.avatarUrl || ''
      })
    }
  }, [profile])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPrefs({ key: getSoundPref('key'), space: getSoundPref('space'), error: getSoundPref('error'), complete: getSoundPref('complete') })
    }, 0)

    return () => window.clearTimeout(timeoutId)
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

  async function handleReset() {
    await resetCurrentProgress()
    setShowConfirm(false)
    window.location.href = '/'
  }

  async function onProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileMessage(null)
    
    const result = await updateProfile({
      username: profileForm.username,
      displayName: profileForm.displayName,
      avatarUrl: profileForm.avatarUrl
    } as any)

    setIsUpdatingProfile(false)
    if (result.error) {
      setProfileMessage({ type: 'error', text: result.error })
    } else {
      setProfileMessage({ type: 'success', text: t('profileSuccess', locale) })
    }
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="px-3 sm:px-6 py-4">
        <Link href="/" className="relative z-20 inline-flex w-fit items-center gap-1.5 text-sm transition-opacity duration-150 hover:opacity-80 pointer-events-auto cursor-pointer" style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={14} />
          {t('back', locale)}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-3 sm:px-6 py-4 sm:py-8">
        <div className="w-full max-w-lg space-y-6 sm:space-y-8">
          <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
            {t('pageSettings', locale)}
          </h1>

          {/* Profile Section */}
          {user && (
            <div className="py-3 space-y-4" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
              <span className="text-sm font-medium block" style={{ color: 'var(--text)' }}>{t('sectionProfile', locale)}</span>
              
              <form onSubmit={onProfileSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border flex items-center justify-center" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)' }}>
                      {profileForm.avatarUrl ? (
                        <img src={profileForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => setProfileForm(p => ({ ...p, avatarUrl: '' }))} />
                      ) : (
                        <UserIcon size={32} style={{ color: 'var(--sub)' }} />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('profileUsername', locale)}</label>
                      <input 
                        type="text" 
                        value={profileForm.username}
                        onChange={e => setProfileForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                        className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:border-main"
                        style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', color: 'var(--text)' }}
                        placeholder="username"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('profileDisplayName', locale)}</label>
                      <input 
                        type="text" 
                        value={profileForm.displayName}
                        onChange={e => setProfileForm(p => ({ ...p, displayName: e.target.value }))}
                        className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:border-main"
                        style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', color: 'var(--text)' }}
                        placeholder="Display Name"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('profileAvatar', locale)}</label>
                      <input 
                        type="text" 
                        value={profileForm.avatarUrl}
                        onChange={e => setProfileForm(p => ({ ...p, avatarUrl: e.target.value }))}
                        className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:border-main"
                        style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', color: 'var(--text)' }}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {profileMessage && (
                  <p className={`text-xs p-2 rounded-lg ${profileMessage.type === 'success' ? 'bg-main/10 text-main' : 'bg-error/10 text-error'}`} style={{ backgroundColor: profileMessage.type === 'success' ? 'color-mix(in srgb, var(--main) 12%, transparent)' : 'color-mix(in srgb, var(--error) 12%, transparent)' }}>
                    {profileMessage.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                >
                  {isUpdatingProfile ? t('authWorking', locale) : t('profileSave', locale)}
                </button>
              </form>
            </div>
          )}

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
