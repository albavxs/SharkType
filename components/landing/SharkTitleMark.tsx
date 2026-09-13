'use client'

import Image from 'next/image'
import sharkLogo from '@/icons/SharkSolo.png'

export default function SharkTitleMark() {
  return (
    <div
      className="relative h-[72px] w-[72px] shrink-0 sm:h-[88px] sm:w-[88px] lg:h-[104px] lg:w-[104px]"
      aria-hidden="true"
    >
      <Image src={sharkLogo} alt="" priority className="h-full w-full object-contain" />
    </div>
  )
}
