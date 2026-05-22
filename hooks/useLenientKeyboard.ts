'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sharktype-lenient-keyboard'

export function useLenientKeyboard() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setEnabled(raw === '1')
    } catch {
      // ignora
    }
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0') } catch {}
  }

  return { enabled, toggle }
}
