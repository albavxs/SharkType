'use client'

import { Suspense } from 'react'
import { LocaleProvider } from '@/components/LocaleProvider'
import IntroTourGate from './IntroTourGate'
import PendingSignupStateReconciler from './PendingSignupStateReconciler'
import PendingVerificationGate from './PendingVerificationGate'
import { AuthProvider } from './AuthProvider'
import EmailLinkHandler from './EmailLinkHandler'
import { PlayerProgressProvider } from './PlayerProgressProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <PlayerProgressProvider>
          {children}
          <PendingSignupStateReconciler />
          <IntroTourGate />
          <Suspense fallback={null}>
            <PendingVerificationGate />
          </Suspense>
          <EmailLinkHandler />
        </PlayerProgressProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}
