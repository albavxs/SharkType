import type { NextConfig } from "next";
import path from "path";

function getAllowedDevOrigins() {
  const configuredOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (configuredOrigins && configuredOrigins.length > 0) {
    return configuredOrigins
  }

  // Allow local LAN access in development without pinning a single device IP.
  return ['192.168.15.*']
}

function buildContentSecurityPolicy() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  let supabaseOrigin: string | null = null

  if (supabaseUrl) {
    try {
      supabaseOrigin = new URL(supabaseUrl).origin
    } catch {
      supabaseOrigin = null
    }
  }

  const supabaseWsOrigin = supabaseOrigin?.replace(/^http/, 'ws')
  const connectSrc = ["'self'"]

  if (supabaseOrigin) {
    connectSrc.push(supabaseOrigin)
  } else {
    connectSrc.push('https:')
  }

  if (supabaseWsOrigin) {
    connectSrc.push(supabaseWsOrigin)
  } else {
    connectSrc.push('wss:')
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `connect-src ${connectSrc.join(' ')}`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "object-src 'none'",
    `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
  ].join('; ')
}

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: buildContentSecurityPolicy(),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  ...(process.env.NODE_ENV === 'production'
    ? [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      }]
    : []),
]

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  allowedDevOrigins: getAllowedDevOrigins(),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
