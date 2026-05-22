'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Alias para /feed?scope=following — mantem URL bookmarkavel.
 */
export default function FollowingPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/feed?scope=following')
  }, [router])
  return null
}
