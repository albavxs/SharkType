'use client'

import { XIcon } from '@/components/icons'
import { t, Locale } from '@/lib/i18n'

interface HelpModalProps {
  onClose: () => void
  locale: Locale
}

export default function HelpModal({ onClose, locale }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[80vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--sub-alt)', border: '1px solid var(--sub)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--sub)' }}>
          <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
            {t('helpTitle', locale)}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--sub)' }} className="hover:opacity-80">
            <XIcon size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 text-sm" style={{ color: 'var(--text)' }}>
          {/* Shortcuts */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>{t('helpShortcuts', locale)}</h3>
            <div className="space-y-1" style={{ color: 'var(--sub)' }}>
              <div><Kbd>shift + tab</Kbd> {t('helpShiftTab', locale)}</div>
              <div><Kbd>tab</Kbd> {t('helpTab', locale)}</div>
              <div><Kbd>enter</Kbd> {t('helpEnter', locale)}</div>
              <div><Kbd>backspace</Kbd> {t('helpBackspace', locale)}</div>
              <div><Kbd>esc</Kbd> {t('helpEsc', locale)}</div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>{t('helpDifficulty', locale)}</h3>
            <div className="space-y-1" style={{ color: 'var(--sub)' }}>
              <div><strong>default</strong> — {t('helpDefault', locale)}</div>
              <div><strong>{t('easy', locale)}</strong> — {t('helpEasy', locale)}</div>
              <div><strong>{t('medium', locale)}</strong> — {t('helpMedium', locale)}</div>
              <div><strong>{t('hard', locale)}</strong> — {t('helpHard', locale)}</div>
            </div>
          </div>

          {/* Tracks */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>{t('helpTracks', locale)}</h3>
            <p style={{ color: 'var(--sub)' }}>
              {t('helpTracksDesc', locale)}
            </p>
          </div>

          {/* XP */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>{t('helpXP', locale)}</h3>
            <p style={{ color: 'var(--sub)' }}>
              {t('helpXPDesc', locale)}
            </p>
          </div>

          {/* Themes */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>{t('helpThemes', locale)}</h3>
            <p style={{ color: 'var(--sub)' }}>
              {t('helpThemesDesc', locale)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono mr-1"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--sub)' }}
    >
      {children}
    </span>
  )
}
