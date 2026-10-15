'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { clearLegacyPendingIntroTourVersion } from '@/lib/intro-tour'
import { clearStoredPendingVerificationEmail } from '@/lib/pending-verification'

export default function PendingSignupStateReconciler() {
  const { user, isLoading } = useAuth()
  const processedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (isLoading || !user || processedUserId.current === user.id) return
    processedUserId.current = user.id

    clearStoredPendingVerificationEmail()
    clearLegacyPendingIntroTourVersion()
  }, [isLoading, user])

  return null
}
