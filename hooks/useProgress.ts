'use client'

import { usePlayerProgress } from '@/components/providers/PlayerProgressProvider'

export function useProgress() {
  return usePlayerProgress()
}
