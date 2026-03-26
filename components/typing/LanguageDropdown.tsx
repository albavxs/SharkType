'use client'

import { useState, useRef, useEffect } from 'react'
import { codeLanguages, textLanguages } from '@/data'
import { Language } from '@/lib/types'
import { ChevronDownIcon } from '@/components/icons'

const idiomLanguages = textLanguages.filter(l => l.id !== 'text-typing')

interface LanguageDropdownProps {
  selected: Language
  onSelect: (lang: Language) => void
}

export default function LanguageDropdown({ selected, onSelect }: LanguageDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function renderItem(lang: Language) {
    return (
      <button key={lang.id} onClick={() => { onSelect(lang); setOpen(false) }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-95"
        style={{ color: 'var(--text)', opacity: lang.id === selected.id ? 1 : 0.7, backgroundColor: lang.id === selected.id ? 'var(--bg)' : 'transparent' }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
        {lang.label}
      </button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
        style={{ color: 'var(--text)' }}>
        <span>{selected.label}</span>
        <ChevronDownIcon size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-50 w-40 sm:w-48 py-1 rounded-lg shadow-xl animate-fade-in max-h-80 overflow-y-auto"
          style={{ backgroundColor: 'var(--sub-alt)', border: '1px solid var(--sub)' }}>
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>Codigo</div>
          {codeLanguages.map(renderItem)}
          <div className="my-1" style={{ borderTop: '1px solid var(--sub)', opacity: 0.3 }} />
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>Texto</div>
          {idiomLanguages.map(renderItem)}
        </div>
      )}
    </div>
  )
}
