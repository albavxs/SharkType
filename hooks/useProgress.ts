'use client'

import { useState, useCallback } from 'react'
import {
  loadProgress,
  saveSession,
  UserProgress,
  SessionInput,
  SessionOutput,
} from '@/lib/gamification'

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress())

  const recordSession = useCallback((input: SessionInput): SessionOutput => {
    const outcome = saveSession(input)
    setProgress(loadProgress())
    return outcome
  }, [])

  return { progress, recordSession, reload: () => setProgress(loadProgress()) }
}
