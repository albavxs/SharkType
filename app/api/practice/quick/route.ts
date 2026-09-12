import { NextResponse } from 'next/server'
import { getQuickPracticePayload } from '@/lib/server/base-practice'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const languageId = searchParams.get('languageId')

  return NextResponse.json(getQuickPracticePayload(languageId), {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  })
}
