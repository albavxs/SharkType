'use client'

import Link from 'next/link'
import { languages } from '@/data'

export default function LanguageSelector() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {languages.map((lang) => (
        <Link
          key={lang.id}
          href={`/practice/${lang.id}`}
          className="group block p-4 rounded-lg border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-neutral-100 transition-all duration-150 hover:border-white light:hover:border-black hover:scale-[1.02] hover:shadow-lg"
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-sm font-medium text-white light:text-black">
              {lang.label}
            </span>
          </div>
          <span className="text-xs text-neutral-500 light:text-neutral-400">
            {lang.snippets.length} snippets
          </span>
        </Link>
      ))}
    </div>
  )
}
