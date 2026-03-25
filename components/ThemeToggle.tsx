'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@/components/icons'

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
  }, [])

  function toggle() {
    const next = !isLight
    setIsLight(next)
    if (next) {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', next ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md transition-colors duration-150 hover:bg-neutral-900 light:hover:bg-neutral-100"
      aria-label="Toggle theme"
    >
      {isLight ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </button>
  )
}
