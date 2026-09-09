import { NextResponse } from 'next/server'

function temporarilyDisabled() {
  return NextResponse.json(
    { error: 'Plus administration is temporarily disabled during the authentication security hardening.' },
    { status: 503 },
  )
}

export async function GET() {
  return temporarilyDisabled()
}

export async function POST() {
  return temporarilyDisabled()
}
