const ASAAS_SANDBOX_API = 'https://api-sandbox.asaas.com/v3'
const ASAAS_PRODUCTION_API = 'https://api.asaas.com/v3'
const ASAAS_CHECKOUT_URL = 'https://asaas.com/checkoutSession/show?id='

export type AsaasEnvironment = 'sandbox' | 'production'

export interface CreateRecurringCheckoutInput {
  externalReference: string
  amount: number
  callbackBaseUrl: string
  itemName: string
  itemDescription: string
}

function getEnvironment(): AsaasEnvironment {
  const value = process.env.ASAAS_ENV?.trim().toLowerCase()
  if (value === 'production') return 'production'
  if (value === 'sandbox') return 'sandbox'
  throw new Error('ASAAS_ENV must be either sandbox or production.')
}

export function getAsaasConfig() {
  const environment = getEnvironment()
  const apiKey = process.env.ASAAS_API_KEY?.trim()
  if (!apiKey) throw new Error('ASAAS_API_KEY is not configured.')

  return {
    environment,
    apiKey,
    baseUrl: environment === 'production' ? ASAAS_PRODUCTION_API : ASAAS_SANDBOX_API,
    sandbox: environment === 'sandbox',
  }
}

function addOneMonth(date: Date): string {
  const next = new Date(date)
  next.setUTCMonth(next.getUTCMonth() + 1)
  return next.toISOString().slice(0, 10)
}

async function parseAsaasError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      errors?: Array<{ description?: string; code?: string }>
      message?: string
    }
    return payload.errors?.map((entry) => entry.description ?? entry.code).filter(Boolean).join('; ')
      || payload.message
      || `Asaas request failed with status ${response.status}.`
  } catch {
    return `Asaas request failed with status ${response.status}.`
  }
}

export async function createAsaasRecurringCheckout(input: CreateRecurringCheckoutInput) {
  const config = getAsaasConfig()
  const callbackBaseUrl = input.callbackBaseUrl.replace(/\/$/, '')

  const response = await fetch(`${config.baseUrl}/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      access_token: config.apiKey,
      'User-Agent': 'SharkType/1.0',
    },
    body: JSON.stringify({
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      minutesToExpire: 60,
      externalReference: input.externalReference,
      callback: {
        successUrl: `${callbackBaseUrl}/plus?checkout=success`,
        cancelUrl: `${callbackBaseUrl}/plus?checkout=cancel`,
        expiredUrl: `${callbackBaseUrl}/plus?checkout=expired`,
      },
      items: [
        {
          name: input.itemName,
          description: input.itemDescription,
          quantity: 1,
          value: input.amount,
        },
      ],
      subscription: {
        cycle: 'MONTHLY',
        nextDueDate: addOneMonth(new Date()),
      },
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(await parseAsaasError(response))
  }

  const payload = (await response.json()) as { id?: string }
  if (!payload.id) throw new Error('Asaas did not return a checkout id.')

  return {
    id: payload.id,
    checkoutUrl: `${ASAAS_CHECKOUT_URL}${encodeURIComponent(payload.id)}`,
    sandbox: config.sandbox,
  }
}

export function getPlusPrice(): number {
  const raw = process.env.ASAAS_PLUS_PRICE?.trim()
  const value = raw ? Number(raw.replace(',', '.')) : Number.NaN
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('ASAAS_PLUS_PRICE is not configured with a valid positive amount.')
  }
  return Math.round(value * 100) / 100
}

export function getWebhookToken(): string {
  const token = process.env.ASAAS_WEBHOOK_TOKEN?.trim()
  if (!token || token.length < 32) {
    throw new Error('ASAAS_WEBHOOK_TOKEN is not configured or is too short.')
  }
  return token
}
