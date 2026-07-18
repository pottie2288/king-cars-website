/**
 * Shared contact-detail validation used by every lead form (client) and its
 * API route (server), so the same rules are enforced on both sides.
 */

export interface ValidationResult {
  valid: boolean
  /** User-facing message when invalid */
  error?: string
  /** Normalised value when valid (phone: 0XXXXXXXXX) */
  normalized?: string
}

/**
 * Validate a South African phone number.
 *
 * Accepts local (0XX XXX XXXX) and international (+27 XX XXX XXXX) formats
 * with any spacing/dashes/brackets. Rejects wrong lengths, invalid SA
 * prefixes (only 01–08 ranges exist), and obvious junk like repeated or
 * sequential digits.
 */
export function validateSAPhone(input: string): ValidationResult {
  const trimmed = (input ?? '').trim()
  if (!trimmed) {
    return { valid: false, error: 'Phone number is required' }
  }

  const digitsOnly = trimmed.replace(/[\s\-().]/g, '')
  if (!/^\+?\d+$/.test(digitsOnly)) {
    return { valid: false, error: 'Phone number can only contain digits' }
  }

  // Normalise to local 0XXXXXXXXX form
  let local: string
  if (digitsOnly.startsWith('+27')) {
    local = '0' + digitsOnly.slice(3)
  } else if (digitsOnly.startsWith('27') && digitsOnly.length === 11) {
    local = '0' + digitsOnly.slice(2)
  } else {
    local = digitsOnly
  }

  if (!local.startsWith('0')) {
    return { valid: false, error: 'Enter a South African number starting with 0 or +27' }
  }
  if (local.length !== 10) {
    return { valid: false, error: 'Phone number must be 10 digits (e.g. 082 123 4567)' }
  }

  // SA numbers only use 01–08 ranges (09 and 00 are not assigned)
  const secondDigit = local[1]
  if (secondDigit === '0' || secondDigit === '9') {
    return { valid: false, error: 'That doesn’t look like a valid South African number' }
  }

  // Junk detection: same digit repeated, or an obvious keyboard sequence
  const significant = local.slice(1)
  if (/^(\d)\1{8}$/.test(significant)) {
    return { valid: false, error: 'Please enter your real phone number' }
  }
  if (local === '0123456789' || local === '0987654321') {
    return { valid: false, error: 'Please enter your real phone number' }
  }

  return { valid: true, normalized: local }
}

/** Convenience boolean wrapper for disabling submit buttons */
export function isValidSAPhone(input: string): boolean {
  return validateSAPhone(input).valid
}

/**
 * Pragmatic email format check: one @, a non-empty local part, and a domain
 * with at least one dot and a 2+ letter TLD.
 */
export function validateEmail(input: string): ValidationResult {
  const trimmed = (input ?? '').trim()
  if (!trimmed) {
    return { valid: false, error: 'Email address is required' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address (e.g. name@example.com)' }
  }
  return { valid: true, normalized: trimmed.toLowerCase() }
}

/** Convenience boolean wrapper for disabling submit buttons */
export function isValidEmail(input: string): boolean {
  return validateEmail(input).valid
}

/**
 * Validate a South African ID number: 13 digits, a real YYMMDD birth date,
 * and a correct Luhn check digit (the official SA ID checksum).
 */
export function isValidSAID(input: string): boolean {
  const id = (input ?? '').replace(/\s/g, '')
  if (!/^\d{13}$/.test(id)) return false

  const month = Number(id.slice(2, 4))
  const day = Number(id.slice(4, 6))
  if (month < 1 || month > 12 || day < 1 || day > 31) return false

  // Luhn checksum over all 13 digits (doubling every second digit from the right)
  let sum = 0
  for (let i = 0; i < 13; i++) {
    let digit = Number(id[i])
    if ((13 - i) % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}
