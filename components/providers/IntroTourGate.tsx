'use client'

import { useEffect, useState } from 'react'
import IntroTourModal, { type IntroTourMode } from '@/components/typing/IntroTourModal'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import {
  getPendingIntroTourVersion,
  KEYBOARD_GUIDE_VERSION,
  setPendingIntroTourVersion,
  shouldShowIntroTour,
  shouldShowKeyboardGuide,
} from '@/lib/intro-tour'
import { isStoredPendingVerificationEmail } from '@/lib/pending-verification'

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
  const { user, profile, isLoading, markIntroTourSeen, pendingVerificationEmail } = useAuth()
  const { locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [tourMode, setTourMode] = useState<IntroTourMode>('full')

  useEffect(() => {
    if (isLoading) return

    if (!user && pendingVerificationEmail && isStoredPendingVerificationEmail(pendingVerificationEmail)) {
      const pendingVersion = getPendingIntroTourVersion(pendingVerificationEmail)
      const mode = getTourMode(pendingVersion)

      if (mode && !getSessionSuppressed(mode)) {
        queueMicrotask(() => {
          setTourMode(mode)
          setIsOpen(true)
        })
      }
      return
    }

    if (!user || !profile) return

    const mode = getTourMode(profile.introTourVersionSeen)
    if (!mode || getSessionSuppressed(mode)) return

    queueMicrotask(() => {
      setTourMode(mode)
      setIsOpen(true)
    })
  }, [isLoading, pendingVerificationEmail, profile, user])

  async function handleTourClose() {
    setIsOpen(false)

    if (
      !user &&
      pendingVerificationEmail &&
      isStoredPendingVerificationEmail(pendingVerificationEmail)
    ) {
      setPendingIntroTourVersion(pendingVerificationEmail, KEYBOARD_GUIDE_VERSION)
      return
    }

    const result = await markIntroTourSeen(KEYBOARD_GUIDE_VERSION)
    if (result.error) {
      setSessionSuppressed(tourMode)
    }
  }

  if (!isOpen) return null

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
