'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { shouldShowIntroTour, INTRO_TOUR_VERSION } from '@/lib/intro-tour'
import IntroTourModal from '@/components/typing/IntroTourModal'

const SUPPRESSED_SESSION_KEY = `sharktype-intro-tour-suppressed:v${INTRO_TOUR_VERSION}`

function getSessionSuppressed(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return window.sessionStorage.getItem(SUPPRESSED_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function setSessionSuppressed() {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(SUPPRESSED_SESSION_KEY, '1')
  } catch {
    // ignore
  }
}

export default function IntroTourGate() {
  const { user, profile, isLoading, markIntroTourSeen } = useAuth()
  const { locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const markAttemptedRef = useRef(false)

  useEffect(() => {
    markAttemptedRef.current = false
  }, [user?.id])

  useEffect(() => {
    if (isLoading || !user || !profile) return
    if (!shouldShowIntroTour(profile.introTourVersionSeen)) return
    if (getSessionSuppressed()) return
    setIsOpen(true)
  }, [isLoading, profile, user])

  useEffect(() => {
    if (!isOpen || markAttemptedRef.current) return

    markAttemptedRef.current = true

    void markIntroTourSeen(INTRO_TOUR_VERSION).then((result) => {
      if (result.error) {
        setSessionSuppressed()
      }
    })
  }, [isOpen, markIntroTourSeen])

  if (!isOpen) return null

  return (
    <IntroTourModal
      locale={locale}
      onClose={() => {
        setIsOpen(false)
      }}
    />
  )
}
