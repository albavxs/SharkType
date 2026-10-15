'use client'

import { useEffect, useState } from 'react'
import IntroTourModal, { type IntroTourMode } from '@/components/typing/IntroTourModal'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { KEYBOARD_GUIDE_VERSION, shouldShowIntroTour, shouldShowKeyboardGuide } from '@/lib/intro-tour'

function getSuppressedSessionKey(mode: IntroTourMode) {
  return `sharktype-intro-tour-suppressed:${mode}:v${KEYBOARD_GUIDE_VERSION}`
}

function getSessionSuppressed(mode: IntroTourMode): boolean {
  if (typeof window === 'undefined') return false

  try {
    return window.sessionStorage.getItem(getSuppressedSessionKey(mode)) === '1'
  } catch {
    return false
  }
}

function setSessionSuppressed(mode: IntroTourMode) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(getSuppressedSessionKey(mode), '1')
  } catch {
    // ignore
  }
}

function getTourMode(versionSeen: number | null | undefined): IntroTourMode | null {
  if (shouldShowIntroTour(versionSeen)) return 'full'
  if (shouldShowKeyboardGuide(versionSeen)) return 'keyboard-only'
  return null
}

export default function IntroTourGate() {
  const { user, profile, isLoading, markIntroTourSeen } = useAuth()
  const { locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [tourMode, setTourMode] = useState<IntroTourMode>('full')

  // Signed-in users only: the version seen is saved on their profile, so each
  // account sees the tour once, on any device.
  useEffect(() => {
    if (isLoading || !user || !profile) return

    const mode = getTourMode(profile.introTourVersionSeen)
    if (!mode || getSessionSuppressed(mode)) return

    queueMicrotask(() => {
      setTourMode(mode)
      setIsOpen(true)
    })
  }, [isLoading, profile, user])

  async function handleTourClose() {
    setIsOpen(false)

    const result = await markIntroTourSeen(KEYBOARD_GUIDE_VERSION)
    if (result.error) {
      setSessionSuppressed(tourMode)
    }
  }

  if (!isOpen || !user) return null

  return (
    <IntroTourModal
      locale={locale}
      mode={tourMode}
      onClose={() => {
        void handleTourClose()
      }}
    />
  )
}
