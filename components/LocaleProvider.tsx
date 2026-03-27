'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Locale, getLocalePref, setLocalePref } from '@/lib/i18n'

interface LocaleContextValue {
  locale: Locale
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  toggleLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = getLocalePref()
    if (saved !== 'en') setLocale(saved)
  }, [])

  function toggleLocale() {
    const next: Locale = locale === 'pt' ? 'en' : 'pt'
    setLocale(next)
    setLocalePref(next)
  }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext)
}
