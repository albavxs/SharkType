'use client'

import { useEffect } from 'react'

interface ShortcutMap {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    function handler(e: KeyboardEvent) {
      // Tab for restart (only when not typing in the textarea)
      if (e.key === 'Tab' && shortcuts['Tab']) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          shortcuts['Tab']()
        }
      }

      if (e.key === 'Escape' && shortcuts['Escape']) {
        e.preventDefault()
        shortcuts['Escape']()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts, enabled])
}
