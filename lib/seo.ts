import type { Metadata } from 'next'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shark-type-io.vercel.app').replace(/\/$/, '')

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildSeoMetadata(input: {
  title: string
  description: string
  path?: string
  keywords?: string[]
}): Metadata {
  const url = absoluteUrl(input.path ?? '/')

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': url,
        en: url,
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: 'SharkType',
      locale: 'en_US',
      alternateLocale: ['pt_BR'],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: input.title,
      description: input.description,
    },
  }
}
