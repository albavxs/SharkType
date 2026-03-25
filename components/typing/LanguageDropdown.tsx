'use client'

import { useState, useRef, useEffect } from 'react'
import { codeLanguages, textLanguages } from '@/data'
import { Language } from '@/lib/types'
import { ChevronDownIcon } from '@/components/icons'

interface LanguageDropdownProps {
  selected: Language
  onSelect: (lang: Language) => void
}

export default function LanguageDropdown({ selected, onSelect }: LanguageDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function renderItem(lang: Language) {
    return (
      <button
        key={lang.id}
        onClick={() => { onSelect(lang); setOpen(false) }}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
          lang.id === selected.id
            ? 'text-[#d1d0c5] bg-white/10'
            : 'text-[#646669] hover:text-[#d1d0c5] hover:bg-white/5'
        }`}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
        {lang.label}
      </button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-sm text-[#d1d0c5] hover:bg-white/5 transition-colors"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selected.color }} />
        <span>{selected.label}</span>
        <ChevronDownIcon size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-50 w-48 py-1 rounded-lg border border-[#4a4d52] bg-[#2c2e31] shadow-xl animate-fade-in max-h-80 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#4a4d52]">Codigo</div>
          {codeLanguages.map(renderItem)}
          <div className="border-t border-[#3c3e42] my-1" />
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#4a4d52]">Texto</div>
          {textLanguages.map(renderItem)}
        </div>
      )}
    </div>
  )
}
