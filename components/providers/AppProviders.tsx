'use client'

import { LocaleProvider } from '@/components/LocaleProvider'
import { AuthProvider } from './AuthProvider'
import { PlayerProgressProvider } from './PlayerProgressProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <PlayerProgressProvider>{children}</PlayerProgressProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}
