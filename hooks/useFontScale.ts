'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sharktype-font-scale'
const MIN = 0.8
const MAX = 1.6
const STEP = 0.1

export function useFontScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const n = parseFloat(raw)
        if (!Number.isNaN(n) && n >= MIN && n <= MAX) {
          setScale(n)
          applyCssVar(n)
          return
        }
      }
      applyCssVar(1)
    } catch {
      // localStorage indisponivel
    }
  }, [])

  function applyCssVar(value: number) {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--code-font-scale', String(value))
    }
  }

  function update(next: number) {
    const clamped = Math.min(MAX, Math.max(MIN, Math.round(next * 10) / 10))
    setScale(clamped)
    applyCssVar(clamped)
    try { localStorage.setItem(STORAGE_KEY, String(clamped)) } catch {}
  }

  return {
    scale,
    increase: () => update(scale + STEP),
    decrease: () => update(scale - STEP),
    reset: () => update(1),
    canIncrease: scale < MAX,
    canDecrease: scale > MIN,
  }
}
