'use client'

import Image from 'next/image'
import sharkLogo from '@/icons/SharkSolo.png'

interface BrandLogoProps {
  size?: number
  textSizeClassName?: string
  className?: string
  compact?: boolean
}

export default function BrandLogo({
  size = 28,
  textSizeClassName = 'text-2xl',
  className = '',
  compact = false,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src={sharkLogo}
        alt="SharkType"
        width={size}
        height={size}
        className="h-auto w-auto shrink-0"
        priority
      />
      {!compact ? (
        <span
          className={`${textSizeClassName} font-bold font-[family-name:var(--font-geist-mono)] leading-none`}
          style={{ color: 'var(--text)' }}
        >
          Shark<span style={{ color: 'var(--main)' }}>Type</span>
        </span>
      ) : null}
    </span>
  )
}
