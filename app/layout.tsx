import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/components/LocaleProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SharkType',
  description: 'Practice typing code syntax across programming languages',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var n=localStorage.getItem('sharktype-theme');if(!n)return;try{var t=JSON.parse(localStorage.getItem('sharktype-themes-cache')||'{}')[n];if(!t)return;var r=document.documentElement;r.style.setProperty('--bg',t.bg);r.style.setProperty('--main',t.main);r.style.setProperty('--caret',t.caret);r.style.setProperty('--sub',t.sub);r.style.setProperty('--sub-alt',t.subAlt);r.style.setProperty('--text',t.text);r.style.setProperty('--error',t.error);r.style.setProperty('--error-extra',t.errorExtra)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
