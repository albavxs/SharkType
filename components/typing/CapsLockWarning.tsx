'use client'

import { useState, useEffect } from 'react'
import { CapsLockIcon } from '@/components/icons'
import { Locale, t } from '@/lib/i18n'

interface CapsLockWarningProps {
  visible: boolean
  isMobile: boolean
  locale?: Locale
}

export function useCapsLock() {
  const [capsLock, setCapsLock] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'CapsLock' && e.type === 'keydown') {
        setCapsLock(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => { window.removeEventListener('keydown', handler) }
  }, [])

  return capsLock
}

export default function CapsLockWarning({ visible, isMobile, locale = 'en' }: CapsLockWarningProps) {
  if (!visible) return null

  return (
    <div className={`flex items-center justify-center ${isMobile ? 'mt-4' : 'mb-4'} animate-fade-in`}>
      <div
        className="flex items-center gap-2.5 px-5 py-2 rounded-lg text-sm font-semibold"
        style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
      >
        <CapsLockIcon size={18} />
        <span>{t('capsLock', locale)}</span>
      </div>
    </div>
  )
}
