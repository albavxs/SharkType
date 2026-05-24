// lib/server/api-errors.ts

import { NextResponse } from 'next/server'

export function safeErrorResponse(
  err: unknown,
  fallback = 'Internal server error.',
  status = 500
) {
  console.error('[api-error]', err)

  return NextResponse.json(
    { error: fallback },
    { status }
  )
}