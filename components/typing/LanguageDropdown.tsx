'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { codeLanguages, textLanguages } from '@/data'
import { Language } from '@/lib/types'
import { ChevronDownIcon } from '@/components/icons'
import { t, Locale } from '@/lib/i18n'

const MENU_MARGIN = 8
const MENU_WIDTH_DESKTOP = 192
const MENU_WIDTH_MOBILE = 176

const sortedCodeLanguages = [...codeLanguages].sort((a, b) =>
  a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })
)
const idiomLanguages = textLanguages.filter(l => l.id !== 'text-typing')

interface LanguageDropdownProps {
  selected: Language
  onSelect: (lang: Language) => void
  locale?: Locale
}

export default function LanguageDropdown({ selected, onSelect, locale = 'pt' }: LanguageDropdownProps) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  function updatePosition() {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    const menuWidth = window.matchMedia('(min-width: 640px)').matches ? MENU_WIDTH_DESKTOP : MENU_WIDTH_MOBILE
    const minLeft = MENU_MARGIN + menuWidth / 2
    const maxLeft = window.innerWidth - MENU_MARGIN - menuWidth / 2
    const centeredLeft = r.left + r.width / 2

    setPos({
      top: r.bottom + 4,
      left: Math.min(Math.max(centeredLeft, minLeft), maxLeft),
    })
  }

  function handleToggle() {
    if (!open) updatePosition()
    setOpen(value => !value)
  }

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (!open) return
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  function renderItem(lang: Language) {
    return (
      <button key={lang.id} onClick={() => { onSelect(lang); setOpen(false) }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-95"
        style={{ color: 'var(--text)', opacity: lang.id === selected.id ? 1 : 0.7, backgroundColor: lang.id === selected.id ? 'var(--sub-alt)' : 'transparent' }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
        {lang.label}
      </button>
    )
  }

  return (
    <>
      <button ref={btnRef} type="button" onClick={handleToggle}
        className="relative z-30 flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer pointer-events-auto transition-all duration-150 hover:scale-105 active:scale-95"
        style={{ color: 'var(--text)' }}>
        <span>{selected.label}</span>
        <ChevronDownIcon size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onMouseDown={() => setOpen(false)} />
          <div ref={menuRef}
            className="fixed z-[10000] w-44 sm:w-48 py-1 rounded-lg shadow-2xl max-h-[70vh] overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              top: pos.top,
              left: pos.left,
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--sub)',
              scrollbarColor: 'var(--sub) var(--bg)',
            }}>
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('sectionCode', locale)}</div>
            {sortedCodeLanguages.map(renderItem)}
            <div className="my-1" style={{ borderTop: '1px solid var(--sub)', opacity: 0.3 }} />
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--sub)' }}>{t('sectionText', locale)}</div>
            {idiomLanguages.map(renderItem)}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
