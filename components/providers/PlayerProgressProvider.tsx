'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import FollowerToast from '@/components/gamification/FollowerToast'
import { useLocale } from '@/hooks/useLocale'
import type { ProgressSource } from '@/lib/auth-types'
import {
  createDefaultProgress,
  hasMeaningfulProgress,
  loadProgress,
  resetProgress as resetLocalProgress,
  saveSession as saveGuestSession,
  type SessionInput,
  type SessionOutput,
  type UserProgress,
} from '@/lib/gamification'
import { useAuth } from './AuthProvider'

interface PlayerProgressContextValue {
  progress: UserProgress
  source: ProgressSource
  isLoading: boolean
  isSyncing: boolean
  recordSession: (input: SessionInput) => Promise<SessionOutput>
  reload: () => Promise<void>
  resetCurrentProgress: () => Promise<void>
}

const PlayerProgressContext = createContext<PlayerProgressContextValue | null>(null)

function getImportFlagKey(userId: string) {
  return `sharktype-imported-progress:${userId}`
}

async function parseJsonError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string }
    return payload.error ?? 'Request failed.'
  } catch {
    return 'Request failed.'
  }
}

export function PlayerProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading, supabaseConfigured } = useAuth()
  const [progress, setProgress] = useState<UserProgress>(() => createDefaultProgress())
  const [source, setSource] = useState<ProgressSource>('guest')
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [newFollower, setNewFollower] = useState<string | null>(null)
  const { locale } = useLocale()

  async function loadRemoteSnapshot() {
    const response = await fetch('/api/me/progress', { cache: 'no-store' })
    if (!response.ok) throw new Error(await parseJsonError(response))

    return (await response.json()) as {
      profile: { localImportedAt: string | null }
      progress: UserProgress
    }
  }

  async function maybeImportGuestProgress() {
    if (!user) return null

    const guestProgress = loadProgress()
    if (!hasMeaningfulProgress(guestProgress)) return null

    const importFlagKey = getImportFlagKey(user.id)
    if (window.localStorage.getItem(importFlagKey) === '1') return null

    const importResponse = await fetch('/api/progress/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress: guestProgress }),
    })

    if (!importResponse.ok) throw new Error(await parseJsonError(importResponse))

    const payload = (await importResponse.json()) as { progress: UserProgress }
    window.localStorage.setItem(importFlagKey, '1')
    return payload.progress
  }

  async function reload() {
    if (!user || !supabaseConfigured) {
      setProgress(loadProgress())
      setSource('guest')
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const remote = await loadRemoteSnapshot()
      let effectiveProgress = remote.progress

      if (!remote.profile.localImportedAt) {
        const imported = await maybeImportGuestProgress().catch(() => null)
        if (imported) effectiveProgress = imported
      }

      setProgress(effectiveProgress)
      setSource('supabase')
    } catch {
      setProgress(loadProgress())
      setSource('guest')
    } finally {
      setIsLoading(false)
    }
  }

  const checkNewFollowers = useCallback(async (userId: string) => {
    try {
      // Busca eventos globais para ver se alguém seguiu o usuário logado
      const response = await fetch('/api/feed?scope=global')
      if (!response.ok) return

      const { events } = (await response.json()) as { events: any[] }
      const followEvent = events.find(
        (e) => e.eventType === 'follow' && e.payload.targetId === userId
      )

      if (followEvent) {
        const eventId = followEvent.id
        const storageKey = `sharktype-follow-shown:${userId}:${eventId}`

        if (window.localStorage.getItem(storageKey) !== '1') {
          setNewFollower(followEvent.username)
          window.localStorage.setItem(storageKey, '1')
        }
      }
    } catch {
      // ignora falhas na busca de seguidores
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    void reload()

    if (user?.id && supabaseConfigured) {
      void checkNewFollowers(user.id)
    }
  }, [authLoading, user?.id, supabaseConfigured, checkNewFollowers])

  async function recordSession(input: SessionInput): Promise<SessionOutput> {
    if (!user || !supabaseConfigured) {
      const output = saveGuestSession(input)
      setProgress(loadProgress())
      setSource('guest')
      return output
    }

    setIsSyncing(true)

    try {
      const response = await fetch('/api/progress/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) throw new Error(await parseJsonError(response))

      const payload = (await response.json()) as {
        progress: UserProgress
        output: SessionOutput
      }

      setProgress(payload.progress)
      setSource('supabase')
      return payload.output
    } catch {
      const output = saveGuestSession(input)
      setProgress(loadProgress())
      setSource('guest')
      return output
    } finally {
      setIsSyncing(false)
    }
  }

  async function resetCurrentProgress() {
    if (!user || !supabaseConfigured) {
      resetLocalProgress()
      setProgress(createDefaultProgress())
      setSource('guest')
      return
    }

    const response = await fetch('/api/me/progress', {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error(await parseJsonError(response))

    const fresh = createDefaultProgress()
    setProgress(fresh)
  }

  const value: PlayerProgressContextValue = {
    progress,
    source,
    isLoading,
    isSyncing,
    recordSession,
    reload,
    resetCurrentProgress,
  }

  return (
    <PlayerProgressContext.Provider value={value}>
      {children}
      <FollowerToast
        followerUsername={newFollower}
        locale={locale}
        onExited={() => setNewFollower(null)}
      />
    </PlayerProgressContext.Provider>
  )
}

export function usePlayerProgress() {
  const context = useContext(PlayerProgressContext)
  if (!context) throw new Error('usePlayerProgress must be used within a PlayerProgressProvider.')
  return context
}
