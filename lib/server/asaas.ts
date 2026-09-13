import 'server-only'

// Installed during prebuild by scripts/install-premium-package.mjs.
// @ts-expect-error Private package is intentionally absent from the public lockfile.
import * as privateBillingModule from '@albavxs/sharktype-premium/billing'

export type AsaasEnvironment = 'sandbox' | 'production'
export type AsaasSubscriptionCycle = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY'
export type AsaasPixAutomaticFrequency = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'ANNUALLY'
export type PlusPlanKey = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

export interface PublicPlusPlan {
  key: PlusPlanKey
  cycle: AsaasSubscriptionCycle
  months: number
  price: number | null
  monthlyEquivalent: number | null
  configured: boolean
}

export interface CreateRecurringCheckoutInput {
  externalReference: string
  amount: number
  callbackBaseUrl: string
  itemName: string
  itemDescription: string
  cycle?: AsaasSubscriptionCycle
}

export interface UpsertAsaasCustomerInput {
  externalReference: string
  name: string
  cpfCnpj: string
  email?: string | null
}

export interface CreatePixAutomaticAuthorizationInput {
  customerId: string
  contractId: string
  amount: number
  cycle: AsaasSubscriptionCycle
  description?: string
}

export type AsaasPixAutomaticQrCode = {
  payload: string | null
  encodedImage: string | null
  expirationDate: string | null
  conciliationIdentifier: string | null
}

type PrivateBillingRuntime = {
  getAsaasConfig: () => {
    environment: AsaasEnvironment
    apiKey: string
    baseUrl: string
    sandbox: boolean
  }
  isPlusPlanKey: (value: unknown) => value is PlusPlanKey
  listPublicPlusPlans: () => PublicPlusPlan[]
  getPlusPlan: (key: PlusPlanKey) => {
    key: PlusPlanKey
    cycle: AsaasSubscriptionCycle
    months: number
    envName: string
    fallbackEnvName?: string
    itemName: string
    itemDescription: string
    amount: number
  }
  isCommercialCheckoutEnabled: () => boolean
  pixAutomaticFrequencyFromCycle: (cycle: AsaasSubscriptionCycle) => AsaasPixAutomaticFrequency
  createAsaasRecurringCheckout: (input: CreateRecurringCheckoutInput) => Promise<{
    id: string
    checkoutUrl: string
    sandbox: boolean
  }>
  upsertAsaasCustomer: (input: UpsertAsaasCustomerInput) => Promise<{
    id: string
    sandbox: boolean
  }>
  createAsaasPixAutomaticAuthorization: (input: CreatePixAutomaticAuthorizationInput) => Promise<{
    id: string
    status: string
    frequency: AsaasPixAutomaticFrequency
    qrCode: AsaasPixAutomaticQrCode
    sandbox: boolean
  }>
  getWebhookToken: () => string
}

const billing = privateBillingModule as unknown as PrivateBillingRuntime

export const getAsaasConfig = billing.getAsaasConfig
export const isPlusPlanKey = billing.isPlusPlanKey
export const listPublicPlusPlans = billing.listPublicPlusPlans
export const getPlusPlan = billing.getPlusPlan
export const isCommercialCheckoutEnabled = billing.isCommercialCheckoutEnabled
export const pixAutomaticFrequencyFromCycle = billing.pixAutomaticFrequencyFromCycle
export const createAsaasRecurringCheckout = billing.createAsaasRecurringCheckout
export const upsertAsaasCustomer = billing.upsertAsaasCustomer
export const createAsaasPixAutomaticAuthorization = billing.createAsaasPixAutomaticAuthorization
export const getWebhookToken = billing.getWebhookToken

export function getPlusPrice(): number {
  return getPlusPlan('monthly').amount
}
