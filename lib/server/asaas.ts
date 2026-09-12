const ASAAS_SANDBOX_API = 'https://api-sandbox.asaas.com/v3'
const ASAAS_PRODUCTION_API = 'https://api.asaas.com/v3'
const ASAAS_CHECKOUT_URL = 'https://asaas.com/checkoutSession/show?id='

export type AsaasEnvironment = 'sandbox' | 'production'
export type AsaasSubscriptionCycle = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY'
export type AsaasPixAutomaticFrequency = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'ANNUALLY'
export type PlusPlanKey = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

interface PlusPlanDefinition {
  key: PlusPlanKey
  cycle: AsaasSubscriptionCycle
  months: number
  envName: string
  fallbackEnvName?: string
  itemName: string
  itemDescription: string
}

export interface PublicPlusPlan {
  key: PlusPlanKey
  cycle: AsaasSubscriptionCycle
  months: number
  price: number | null
  monthlyEquivalent: number | null
  configured: boolean
}

const PLUS_PLAN_DEFINITIONS: Record<PlusPlanKey, PlusPlanDefinition> = {
  monthly: { key: 'monthly', cycle: 'MONTHLY', months: 1, envName: 'ASAAS_PLUS_PRICE_MONTHLY', fallbackEnvName: 'ASAAS_PLUS_PRICE', itemName: 'SharkType Plus — Monthly', itemDescription: 'Monthly SharkType Plus subscription' },
  quarterly: { key: 'quarterly', cycle: 'QUARTERLY', months: 3, envName: 'ASAAS_PLUS_PRICE_QUARTERLY', itemName: 'SharkType Plus — Quarterly', itemDescription: 'Quarterly SharkType Plus subscription' },
  semiannual: { key: 'semiannual', cycle: 'SEMIANNUALLY', months: 6, envName: 'ASAAS_PLUS_PRICE_SEMIANNUAL', itemName: 'SharkType Plus — Semiannual', itemDescription: 'Semiannual SharkType Plus subscription' },
  annual: { key: 'annual', cycle: 'YEARLY', months: 12, envName: 'ASAAS_PLUS_PRICE_ANNUAL', itemName: 'SharkType Plus — Annual', itemDescription: 'Annual SharkType Plus subscription' },
}

export interface CreateRecurringCheckoutInput { externalReference: string; amount: number; callbackBaseUrl: string; itemName: string; itemDescription: string; cycle?: AsaasSubscriptionCycle }
export interface UpsertAsaasCustomerInput { externalReference: string; name: string; cpfCnpj: string; email?: string | null }
export interface CreatePixAutomaticAuthorizationInput { customerId: string; contractId: string; amount: number; cycle: AsaasSubscriptionCycle; description?: string }
export type AsaasPixAutomaticQrCode = { payload: string | null; encodedImage: string | null; expirationDate: string | null; conciliationIdentifier: string | null }

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
  return { environment, apiKey, baseUrl: environment === 'production' ? ASAAS_PRODUCTION_API : ASAAS_SANDBOX_API, sandbox: environment === 'sandbox' }
}

function asaasHeaders(apiKey: string) {
  return { 'Content-Type': 'application/json', access_token: apiKey, 'User-Agent': 'SharkType/1.0' }
}

function parsePositiveAmount(raw: string | undefined): number | null {
  const value = raw ? Number(raw.trim().replace(',', '.')) : Number.NaN
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value * 100) / 100
}

function getConfiguredPlanPrice(definition: PlusPlanDefinition): number | null {
  const primary = parsePositiveAmount(process.env[definition.envName])
  if (primary != null) return primary
  if (!definition.fallbackEnvName) return null
  return parsePositiveAmount(process.env[definition.fallbackEnvName])
}

export function isPlusPlanKey(value: unknown): value is PlusPlanKey { return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PLUS_PLAN_DEFINITIONS, value) }
export function listPublicPlusPlans(): PublicPlusPlan[] {
  return (Object.keys(PLUS_PLAN_DEFINITIONS) as PlusPlanKey[]).map((key) => {
    const definition = PLUS_PLAN_DEFINITIONS[key]
    const price = getConfiguredPlanPrice(definition)
    return { key, cycle: definition.cycle, months: definition.months, price, monthlyEquivalent: price == null ? null : Math.round((price / definition.months) * 100) / 100, configured: price != null }
  })
}
export function getPlusPlan(key: PlusPlanKey) {
  const definition = PLUS_PLAN_DEFINITIONS[key]
  const amount = getConfiguredPlanPrice(definition)
  if (amount == null) throw new Error(`Plus plan ${key} is not configured with a valid positive amount.`)
  return { ...definition, amount }
}
export function isCommercialCheckoutEnabled(): boolean { return process.env.ASAAS_ENV?.trim().toLowerCase() === 'production' && Boolean(process.env.ASAAS_API_KEY?.trim()) }

function addMonthsClamped(date: Date, months: number): string {
  const day = date.getUTCDate(); const next = new Date(date); next.setUTCDate(1); next.setUTCMonth(next.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate(); next.setUTCDate(Math.min(day, lastDay)); return next.toISOString().slice(0, 10)
}
function cycleMonths(cycle: AsaasSubscriptionCycle): number { if (cycle === 'QUARTERLY') return 3; if (cycle === 'SEMIANNUALLY') return 6; if (cycle === 'YEARLY') return 12; return 1 }
export function pixAutomaticFrequencyFromCycle(cycle: AsaasSubscriptionCycle): AsaasPixAutomaticFrequency { if (cycle === 'QUARTERLY') return 'QUARTERLY'; if (cycle === 'SEMIANNUALLY') return 'SEMIANNUALLY'; if (cycle === 'YEARLY') return 'ANNUALLY'; return 'MONTHLY' }

async function parseAsaasError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { errors?: Array<{ description?: string; code?: string }>; message?: string }
    return payload.errors?.map((entry) => entry.description ?? entry.code).filter(Boolean).join('; ') || payload.message || `Asaas request failed with status ${response.status}.`
  } catch { return `Asaas request failed with status ${response.status}.` }
}

export async function createAsaasRecurringCheckout(input: CreateRecurringCheckoutInput) {
  const config = getAsaasConfig(); const callbackBaseUrl = input.callbackBaseUrl.replace(/\/$/, ''); const cycle = input.cycle ?? 'MONTHLY'
  const response = await fetch(`${config.baseUrl}/checkouts`, { method: 'POST', headers: asaasHeaders(config.apiKey), body: JSON.stringify({ billingTypes: ['CREDIT_CARD'], chargeTypes: ['RECURRENT'], minutesToExpire: 60, externalReference: input.externalReference, callback: { successUrl: `${callbackBaseUrl}/plus?checkout=success`, cancelUrl: `${callbackBaseUrl}/plus?checkout=cancel`, expiredUrl: `${callbackBaseUrl}/plus?checkout=expired` }, items: [{ name: input.itemName, description: input.itemDescription, quantity: 1, value: input.amount }], subscription: { cycle, nextDueDate: addMonthsClamped(new Date(), cycleMonths(cycle)) } }), cache: 'no-store' })
  if (!response.ok) throw new Error(await parseAsaasError(response)); const payload = (await response.json()) as { id?: string }; if (!payload.id) throw new Error('Asaas did not return a checkout id.')
  return { id: payload.id, checkoutUrl: `${ASAAS_CHECKOUT_URL}${encodeURIComponent(payload.id)}`, sandbox: config.sandbox }
}

export async function upsertAsaasCustomer(input: UpsertAsaasCustomerInput) {
  const config = getAsaasConfig(); const query = new URLSearchParams({ externalReference: input.externalReference, limit: '1' })
  const listResponse = await fetch(`${config.baseUrl}/customers?${query.toString()}`, { method: 'GET', headers: asaasHeaders(config.apiKey), cache: 'no-store' }); if (!listResponse.ok) throw new Error(await parseAsaasError(listResponse))
  const listPayload = (await listResponse.json()) as { data?: Array<{ id?: string }> }; const existingId = listPayload.data?.[0]?.id
  const customerBody = { name: input.name, cpfCnpj: input.cpfCnpj, email: input.email || undefined, externalReference: input.externalReference }
  if (existingId) {
    const updateResponse = await fetch(`${config.baseUrl}/customers/${encodeURIComponent(existingId)}`, { method: 'PUT', headers: asaasHeaders(config.apiKey), body: JSON.stringify(customerBody), cache: 'no-store' }); if (!updateResponse.ok) throw new Error(await parseAsaasError(updateResponse))
    const updated = (await updateResponse.json()) as { id?: string }; if (!updated.id) throw new Error('Asaas did not return the updated customer id.'); return { id: updated.id, sandbox: config.sandbox }
  }
  const createResponse = await fetch(`${config.baseUrl}/customers`, { method: 'POST', headers: asaasHeaders(config.apiKey), body: JSON.stringify(customerBody), cache: 'no-store' }); if (!createResponse.ok) throw new Error(await parseAsaasError(createResponse))
  const created = (await createResponse.json()) as { id?: string }; if (!created.id) throw new Error('Asaas did not return a customer id.'); return { id: created.id, sandbox: config.sandbox }
}

export async function createAsaasPixAutomaticAuthorization(input: CreatePixAutomaticAuthorizationInput) {
  const config = getAsaasConfig(); const frequency = pixAutomaticFrequencyFromCycle(input.cycle)
  const response = await fetch(`${config.baseUrl}/pix/automatic/authorizations`, { method: 'POST', headers: asaasHeaders(config.apiKey), body: JSON.stringify({ frequency, contractId: input.contractId.slice(0, 35), startDate: new Date().toISOString().slice(0, 10), value: input.amount, description: (input.description ?? 'SharkType Plus subscription').slice(0, 35), customerId: input.customerId, immediateQrCode: {}, paymentCreationMode: 'SUBSCRIPTION', retryPolicy: 'ALLOW_THREE_IN_SEVEN_DAYS' }), cache: 'no-store' })
  if (!response.ok) throw new Error(await parseAsaasError(response))
  const payload = (await response.json()) as { id?: string; status?: string; immediateQrCode?: { payload?: string; encodedImage?: string; expirationDate?: string; conciliationIdentifier?: string }; payload?: string; encodedImage?: string }
  if (!payload.id) throw new Error('Asaas did not return a Pix Automatic authorization id.')
  const qrCode: AsaasPixAutomaticQrCode = { payload: payload.immediateQrCode?.payload ?? payload.payload ?? null, encodedImage: payload.immediateQrCode?.encodedImage ?? payload.encodedImage ?? null, expirationDate: payload.immediateQrCode?.expirationDate ?? null, conciliationIdentifier: payload.immediateQrCode?.conciliationIdentifier ?? null }
  return { id: payload.id, status: payload.status ?? 'CREATED', frequency, qrCode, sandbox: config.sandbox }
}

export function getPlusPrice(): number { return getPlusPlan('monthly').amount }
export function getWebhookToken(): string { const token = process.env.ASAAS_WEBHOOK_TOKEN?.trim(); if (!token || token.length < 32) throw new Error('ASAAS_WEBHOOK_TOKEN is not configured or is too short.'); return token }
