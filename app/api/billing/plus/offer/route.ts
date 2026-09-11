import { NextResponse } from 'next/server'
import { isCommercialCheckoutEnabled, listPublicPlusPlans } from '@/lib/server/asaas'

export async function GET() {
  return NextResponse.json(
    {
      plans: listPublicPlusPlans(),
      checkoutEnabled: isCommercialCheckoutEnabled(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
