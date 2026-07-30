const MAX_ERROR_MESSAGE_LENGTH = 500

type ErrorLike = {
  name?: unknown
  code?: unknown
  status?: unknown
  message?: unknown
}

function redactSensitiveValues(message: string): string {
  return message
    .replace(/([?&](?:access_token|refresh_token|code_verifier|client_secret|authorization|apikey|api_key|secret|token|key)=)[^&\s]+/gi, '$1[REDACTED]')
    .replace(/(["']?(?:access_token|refresh_token|code_verifier|client_secret|authorization|apikey|api_key|secret|token|key)["']?\s*:\s*)("[^"]*"|'[^']*'|[^,\s}]+)/gi, '$1[REDACTED]')
    .replace(/\b(access_token|refresh_token|code_verifier|client_secret|authorization|apikey|api_key|secret|token|key)\b(\s*[:=]\s*)("[^"]*"|'[^']*'|[^\s,;&]+)/gi, '$1$2[REDACTED]')
    .replace(/(Bearer\s+)[^\s]+/gi, '$1[REDACTED]')
    .slice(0, MAX_ERROR_MESSAGE_LENGTH)
}

function safeString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  return String(value).slice(0, 160)
}

export function getSafeErrorDetails(error: unknown): Record<string, string> {
  const candidate = (error ?? {}) as ErrorLike
  const message = candidate.message ?? (error instanceof Error ? error.message : String(error))
  const details: Record<string, string> = {
    error_message: redactSensitiveValues(String(message)),
  }

  const name = safeString(candidate.name ?? (error instanceof Error ? error.name : undefined))
  const code = safeString(candidate.code)
  const status = safeString(candidate.status)

  if (name) details.error_name = name
  if (code) details.error_code = code
  if (status) details.error_status = status

  return details
}

export function logStructuredError(event: string, fields: Record<string, unknown>): void {
  console.error(JSON.stringify({ event, ...fields }))
}

export function logStructuredInfo(event: string, fields: Record<string, unknown>): void {
  console.info(JSON.stringify({ event, ...fields }))
}
