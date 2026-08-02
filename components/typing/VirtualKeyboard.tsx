'use client'

import { useEffect, useMemo, useState } from 'react'
import { Locale, t } from '@/lib/i18n'

type LayoutMapLike = {
  get: (code: string) => string | undefined
}

type BrowserKeyboard = {
  getLayoutMap?: () => Promise<LayoutMapLike>
}

type BrowserNavigator = Navigator & {
  keyboard?: BrowserKeyboard
}

type VirtualKeyboardProps = {
  expectedKey: string | null
  pressedKey: string | null
  pressedCorrect: boolean | null
  pressToken: number
  locale: Locale
  preview?: boolean
}

type KeyboardKey = {
  code: string
  fallback: string
  width?: number
  special?: string
}

const rows: KeyboardKey[][] = [
  [
    { code: 'Backquote', fallback: '`' },
    { code: 'Digit1', fallback: '1' },
    { code: 'Digit2', fallback: '2' },
    { code: 'Digit3', fallback: '3' },
    { code: 'Digit4', fallback: '4' },
    { code: 'Digit5', fallback: '5' },
    { code: 'Digit6', fallback: '6' },
    { code: 'Digit7', fallback: '7' },
    { code: 'Digit8', fallback: '8' },
    { code: 'Digit9', fallback: '9' },
    { code: 'Digit0', fallback: '0' },
    { code: 'Minus', fallback: '-' },
    { code: 'Equal', fallback: '=' },
    { code: 'Backspace', fallback: 'Backspace', width: 2, special: 'virtualKeyboardBackspace' },
  ],
  [
    { code: 'Tab', fallback: 'Tab', width: 1.5, special: 'virtualKeyboardTab' },
    { code: 'KeyQ', fallback: 'q' },
    { code: 'KeyW', fallback: 'w' },
    { code: 'KeyE', fallback: 'e' },
    { code: 'KeyR', fallback: 'r' },
    { code: 'KeyT', fallback: 't' },
    { code: 'KeyY', fallback: 'y' },
    { code: 'KeyU', fallback: 'u' },
    { code: 'KeyI', fallback: 'i' },
    { code: 'KeyO', fallback: 'o' },
    { code: 'KeyP', fallback: 'p' },
    { code: 'BracketLeft', fallback: '[' },
    { code: 'BracketRight', fallback: ']' },
    { code: 'Backslash', fallback: '\\' },
  ],
  [
    { code: 'CapsLock', fallback: 'Caps', width: 1.75 },
    { code: 'KeyA', fallback: 'a' },
    { code: 'KeyS', fallback: 's' },
    { code: 'KeyD', fallback: 'd' },
    { code: 'KeyF', fallback: 'f' },
    { code: 'KeyG', fallback: 'g' },
    { code: 'KeyH', fallback: 'h' },
    { code: 'KeyJ', fallback: 'j' },
    { code: 'KeyK', fallback: 'k' },
    { code: 'KeyL', fallback: 'l' },
    { code: 'Semicolon', fallback: ';' },
    { code: 'Quote', fallback: "'" },
    { code: 'Enter', fallback: 'Enter', width: 2, special: 'virtualKeyboardEnter' },
  ],
  [
    { code: 'ShiftLeft', fallback: 'Shift', width: 2.25, special: 'virtualKeyboardShift' },
    { code: 'KeyZ', fallback: 'z' },
    { code: 'KeyX', fallback: 'x' },
    { code: 'KeyC', fallback: 'c' },
    { code: 'KeyV', fallback: 'v' },
    { code: 'KeyB', fallback: 'b' },
    { code: 'KeyN', fallback: 'n' },
    { code: 'KeyM', fallback: 'm' },
    { code: 'Comma', fallback: ',' },
    { code: 'Period', fallback: '.' },
    { code: 'Slash', fallback: '/' },
    { code: 'ShiftRight', fallback: 'Shift', width: 2.25, special: 'virtualKeyboardShift' },
  ],
  [{ code: 'Space', fallback: 'Space', width: 6.5, special: 'virtualKeyboardSpace' }],
]

const characterCodes = new Set(rows.flat().filter((key) => !key.special).map((key) => key.code))

function normalizeKey(key: string | null): string {
  if (!key) return ''
  if (key === ' ') return 'space'
  if (key === '\n') return 'enter'
  if (key === '\t') return 'tab'
  return key.toLowerCase()
}

function keyMatches(key: string, target: string | null): boolean {
  return normalizeKey(key) === normalizeKey(target)
}

function formatCharacter(value: string): string {
  return value.length === 1 && /[a-z]/i.test(value) ? value.toUpperCase() : value
}

export default function VirtualKeyboard({ expectedKey, pressedKey, pressedCorrect, pressToken, locale, preview = false }: VirtualKeyboardProps) {
  const [layoutMap, setLayoutMap] = useState<LayoutMapLike | null>(null)

  useEffect(() => {
    let active = true
    const browserNavigator = navigator as BrowserNavigator
    const getLayoutMap = browserNavigator.keyboard?.getLayoutMap
    if (!getLayoutMap) return

    void getLayoutMap()
      .then((map) => {
        if (active) setLayoutMap(map)
      })
      .catch(() => {
        // QWERTY fallback remains active when the browser blocks the API.
      })

    return () => {
      active = false
    }
  }, [])

  const keys = useMemo(() => rows.map((row) => row.map((key) => {
    const adaptedValue = layoutMap && characterCodes.has(key.code) ? layoutMap.get(key.code) : undefined
    const value = adaptedValue && adaptedValue.length <= 2 ? adaptedValue : key.fallback
    const label = key.special ? t(key.special as Parameters<typeof t>[0], locale) : formatCharacter(value)
    return { ...key, value, label }
  })), [layoutMap, locale])

  const expectedLabel = expectedKey === ' ' ? t('virtualKeyboardSpace', locale)
    : expectedKey === '\n' ? t('virtualKeyboardEnter', locale)
      : expectedKey === '\t' ? t('virtualKeyboardTab', locale)
        : expectedKey ? formatCharacter(expectedKey) : '—'
  const pressedLabel = pressedKey === ' ' ? t('virtualKeyboardSpace', locale)
    : pressedKey === 'Enter' ? t('virtualKeyboardEnter', locale)
      : pressedKey === 'Tab' ? t('virtualKeyboardTab', locale)
        : pressedKey ? formatCharacter(pressedKey) : '—'

  return (
    <section className={`w-full ${preview ? 'max-w-xl' : 'max-w-3xl'} animate-slide-up`} aria-label={t('virtualKeyboard', locale)}>
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--sub)' }}>
        <span aria-live="polite">
          {t('virtualKeyboardNext', locale)}: <strong style={{ color: 'var(--main)' }}>{expectedLabel}</strong>
        </span>
        {pressedKey ? (
          <span aria-live="polite">
            {t('virtualKeyboardPressed', locale)}: <strong style={{ color: pressedCorrect ? 'var(--main)' : 'var(--error)' }}>{pressedLabel}</strong>{' '}
            <span style={{ color: pressedCorrect ? 'var(--main)' : 'var(--error)' }}>
              ({t(pressedCorrect ? 'virtualKeyboardCorrect' : 'virtualKeyboardIncorrect', locale)})
            </span>
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-2xl border p-2 sm:p-3" style={{ borderColor: 'color-mix(in srgb, var(--sub) 22%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 84%, transparent)' }}>
        <div className={`mx-auto flex ${preview ? 'min-w-0' : 'min-w-[520px]'} max-w-2xl flex-col gap-1.5`}>
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              {row.map((key) => {
                const isExpected = keyMatches(key.value, expectedKey) || keyMatches(key.fallback, expectedKey)
                const isPressed = keyMatches(key.value, pressedKey) || keyMatches(key.fallback, pressedKey)
                const stateColor = isPressed ? (pressedCorrect ? 'var(--main)' : 'var(--error)') : isExpected ? 'var(--main)' : 'var(--text)'
                const stateBackground = isPressed
                  ? `color-mix(in srgb, ${pressedCorrect ? 'var(--main)' : 'var(--error)'} 26%, transparent)`
                  : isExpected ? 'color-mix(in srgb, var(--main) 14%, transparent)' : 'color-mix(in srgb, var(--bg) 45%, transparent)'

                return (
                  <div
                    key={`${key.code}-${isPressed ? pressToken : 'idle'}`}
                    role="presentation"
                    className={`flex ${preview ? 'h-6 text-[8px] sm:h-7 sm:text-[9px]' : 'h-8 text-[10px] sm:h-9 sm:text-xs'} min-w-0 items-center justify-center rounded-lg border font-semibold transition-all duration-150 ${isPressed ? 'animate-[virtual-key-press_180ms_ease-out]' : ''}`}
                    style={{
                      flex: `${key.width ?? 1} 1 0%`,
                      borderColor: isPressed || isExpected ? stateColor : 'color-mix(in srgb, var(--sub) 20%, transparent)',
                      backgroundColor: stateBackground,
                      color: stateColor,
                      boxShadow: isExpected ? '0 0 0 1px color-mix(in srgb, var(--main) 14%, transparent)' : undefined,
                    }}
                  >
                    {key.label}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
