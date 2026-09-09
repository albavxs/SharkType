import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Plus checkout is temporarily disabled during the authentication security hardening.' },
    { status: 503 },
  )
}
