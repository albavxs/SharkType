'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { UserAccess } from '@/lib/server/access-control'

export function useUserAccess() {
  const { user, isLoading: authLoading } = useAuth()
  const [access, setAccess] = useState<UserAccess | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAccess = useCallback(async () => {
    if (!user) {
      setAccess(null)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/me/access', { cache: 'no-store' })
      const payload = (await response.json()) as { access?: UserAccess; error?: string }

      if (!response.ok || !payload.access) {
        throw new Error(payload.error ?? 'Could not load access state.')
      }

      setAccess(payload.access)
    } catch (loadError) {
      setAccess(null)
      setError(loadError instanceof Error ? loadError.message : 'Could not load access state.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    void loadAccess()
  }, [authLoading, loadAccess])

  return {
    access,
    isLoading: authLoading || isLoading,
    error,
    refresh: loadAccess,
    isPlus: access?.isPlus === true,
    isSuperAdmin: access?.isSuperAdmin === true,
    plan: access?.plan ?? 'free',
  }
}
