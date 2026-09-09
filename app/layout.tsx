import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/AppProviders'
import { ThemeBootstrap } from '@/components/providers/ThemeBootstrap'
import sharkLogo from '@/icons/Shark.png'
import { buildSeoMetadata, siteUrl } from '@/lib/seo'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildSeoMetadata({
    title: 'SharkType | Code typing practice and treino de digitacao',
    description: 'Practice typing with programming snippets, English typing drills, and focused tracks for developers learning speed, accuracy, and code syntax.',
    path: '/',
    keywords: [
      'typing practice',
      'code typing practice',
      'programming typing',
      'treino de digitacao',
      'digitacao para programacao',
      'site para treinar digitacao',
    ],
  }),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: sharkLogo.src, sizes: '1024x1024', type: 'image/png' },
    ],
    apple: [
      { url: sharkLogo.src, sizes: '1024x1024', type: 'image/png' },
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
