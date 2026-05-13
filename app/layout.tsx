import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/AppProviders'
import { ThemeBootstrap } from '@/components/providers/ThemeBootstrap'

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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SharkType',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <head suppressHydrationWarning />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeBootstrap />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
