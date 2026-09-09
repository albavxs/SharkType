import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Asaas billing is temporarily disabled during the authentication security hardening.' },
    { status: 503 },
  )
}
