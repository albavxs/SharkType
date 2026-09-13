export const PENDING_VERIFICATION_KEY = 'sharktype-pending-verification-email'

function normalizeEmail(email: string | null | undefined): string {
  return email?.trim().toLowerCase() ?? ''
}

export function getStoredPendingVerificationEmail(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const email = normalizeEmail(window.localStorage.getItem(PENDING_VERIFICATION_KEY))
    return email || null
  } catch {
    return null
  }
}

export function isStoredPendingVerificationEmail(email: string | null | undefined): boolean {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return false
  return getStoredPendingVerificationEmail() === normalizedEmail
}

export function clearStoredPendingVerificationEmail() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(PENDING_VERIFICATION_KEY)
  } catch {
    // ignore storage failures
  }
}
