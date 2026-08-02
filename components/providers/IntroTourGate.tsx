'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { shouldShowIntroTour, shouldShowKeyboardGuide, KEYBOARD_GUIDE_VERSION } from '@/lib/intro-tour'
import IntroTourModal, { type IntroTourMode } from '@/components/typing/IntroTourModal'

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
  const markAttemptedRef = useRef(false)

  useEffect(() => {
    markAttemptedRef.current = false
  }, [user?.id])

  useEffect(() => {
    if (isLoading || !user || !profile) return
    const mode = getTourMode(profile.introTourVersionSeen)
    if (!mode || getSessionSuppressed(mode)) return
    queueMicrotask(() => {
      setTourMode(mode)
      setIsOpen(true)
    })
  }, [isLoading, profile, user])

  useEffect(() => {
    if (!isOpen || markAttemptedRef.current) return

    markAttemptedRef.current = true

    void markIntroTourSeen(KEYBOARD_GUIDE_VERSION).then((result) => {
      if (result.error) {
        setSessionSuppressed(tourMode)
      }
    })
  }, [isOpen, markIntroTourSeen, tourMode])

  if (!isOpen) return null

  return (
    <IntroTourModal
      locale={locale}
      mode={tourMode}
      onClose={() => {
        setIsOpen(false)
      }}
    />
  )
}
