'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    // Only update if the initial state was different (e.g. during hydration)
    if (matches !== mql.matches) {
      setMatches(mql.matches)
    }

    function handler(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }

    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
