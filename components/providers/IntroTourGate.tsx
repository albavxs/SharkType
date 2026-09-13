'use client'

import { useEffect, useState } from 'react'
import VerificationRequiredModal from '@/components/auth/VerificationRequiredModal'
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

function getSuppressedSessionKey(mode: IntroTourMode) {
  return `sharktype-intro-tour-suppressed:${mode}:v${KEYBOARD_GUIDE_VERSION}`
}

const VERIFICATION_PROMPT_SESSION_KEY = 'sharktype-verification-prompt-dismissed'

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

function isVerificationPromptSuppressed(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return window.sessionStorage.getItem(VERIFICATION_PROMPT_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function suppressVerificationPrompt() {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(VERIFICATION_PROMPT_SESSION_KEY, '1')
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
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!user && pendingVerificationEmail) {
      const pendingVersion = getPendingIntroTourVersion()
      const mode = getTourMode(pendingVersion)

      if (mode && !getSessionSuppressed(mode)) {
        queueMicrotask(() => {
          setTourMode(mode)
          setIsOpen(true)
          setShowVerificationPrompt(false)
        })
        return
      }

      if (!isVerificationPromptSuppressed()) {
        queueMicrotask(() => setShowVerificationPrompt(true))
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

  useEffect(() => {
    if (!pendingVerificationEmail || user) {
      queueMicrotask(() => setShowVerificationPrompt(false))
    }
  }, [pendingVerificationEmail, user])

  async function handleTourClose() {
    setIsOpen(false)

    if (!user && pendingVerificationEmail) {
      setPendingIntroTourVersion(KEYBOARD_GUIDE_VERSION)
      setShowVerificationPrompt(true)
      return
    }

    const result = await markIntroTourSeen(KEYBOARD_GUIDE_VERSION)
    if (result.error) {
      setSessionSuppressed(tourMode)
    }
  }

  return (
    <>
      {isOpen ? (
        <IntroTourModal
          locale={locale}
          mode={tourMode}
          onClose={() => {
            void handleTourClose()
          }}
        />
      ) : null}

      {!isOpen && showVerificationPrompt && pendingVerificationEmail ? (
        <VerificationRequiredModal
          email={pendingVerificationEmail}
          locale={locale}
          onClose={() => {
            suppressVerificationPrompt()
            setShowVerificationPrompt(false)
          }}
        />
      ) : null}
    </>
  )
}
