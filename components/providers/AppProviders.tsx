'use client'

import { LocaleProvider } from '@/components/LocaleProvider'
import IntroTourGate from './IntroTourGate'
import PendingSignupStateReconciler from './PendingSignupStateReconciler'
import PendingVerificationGate from './PendingVerificationGate'
import { AuthProvider } from './AuthProvider'
import { PlayerProgressProvider } from './PlayerProgressProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <PlayerProgressProvider>
          {children}
          <PendingSignupStateReconciler />
          <IntroTourGate />
          <PendingVerificationGate />
        </PlayerProgressProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}
