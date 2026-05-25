'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, type Locale } from '@/lib/i18n'

interface FollowerToastProps {
  followerUsername: string | null
  locale: Locale
  onExited?: () => void
}

/**
 * Mostra toast/overlay quando um novo usuário segue você.
 * Similar ao StreakToast, exibido por 3 segundos.
 */
export default function FollowerToast({ followerUsername, locale, onExited }: FollowerToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (followerUsername) {
      setVisible(true)
      const timeout = setTimeout(() => {
        setVisible(false)
        if (onExited) onExited()
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [followerUsername, onExited])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2"
        >
          <div
            className="flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--main) 90%, var(--bg))',
              color: 'var(--bg)',
              boxShadow: '0 18px 40px color-mix(in srgb, var(--main) 35%, transparent)',
            }}
          >
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1, 1.2, 1],
                y: [0, -4, 0, -4, 0] 
              }}
              transition={{ duration: 1, repeat: 1 }}
              className="text-xl"
            >
              👤
            </motion.span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                {t('newFollower', locale)}
              </span>
              <span className="text-lg font-bold leading-tight">
                <span className="opacity-90">@{followerUsername}</span> {t('followedYou', locale)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
