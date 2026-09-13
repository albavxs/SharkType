'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  clearPendingIntroTourVersion,
  getPendingIntroTourVersion,
} from '@/lib/intro-tour'
import {
  clearStoredPendingVerificationEmail,
  getStoredPendingVerificationEmail,
} from '@/lib/pending-verification'

export default function PendingSignupStateReconciler() {
  const { user, isLoading, refreshProfile } = useAuth()
  const processedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (isLoading || !user || processedUserId.current === user.id) return
    processedUserId.current = user.id

    const authenticatedEmail = user.email?.trim().toLowerCase() ?? ''
    const storedPendingEmail = getStoredPendingVerificationEmail()

    if (storedPendingEmail && storedPendingEmail !== authenticatedEmail) {
      clearPendingIntroTourVersion(storedPendingEmail)
    }

    // Read/migrate any pending tour state before removing the verification key.
    const pendingVersion = authenticatedEmail
      ? getPendingIntroTourVersion(authenticatedEmail)
      : 0

    clearStoredPendingVerificationEmail()

    if (!authenticatedEmail || pendingVersion <= 0) return

    void (async () => {
      try {
        const response = await fetch('/api/me/profile/intro-tour', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ versionSeen: pendingVersion }),
        })

        if (!response.ok) return

        clearPendingIntroTourVersion(authenticatedEmail)
        await refreshProfile()
      } catch {
        // Keep the scoped tour state so a future authenticated load can retry.
      }
    })()
  }, [isLoading, refreshProfile, user])

  return null
}
