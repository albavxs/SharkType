'use client'

import { useLayoutEffect } from 'react'
import { applyTheme, getTheme } from '@/lib/themes'

export function ThemeBootstrap() {
  useLayoutEffect(() => {
    try {
      const themeName = window.localStorage.getItem('sharktype-theme')
      if (!themeName) return

      applyTheme(getTheme(themeName))
    } catch {
      // Ignore local theme bootstrap errors and fall back to default CSS variables.
    }
  }, [])

  return null
}
