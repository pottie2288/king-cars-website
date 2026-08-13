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
 * Reserved documentation domains (RFC 2606 / RFC 6761) plus the throwaway
 * domains people reach for when they don't want to be contacted. A lead we
 * can't reply to is worse than no lead, so these are rejected outright.
 */
const PLACEHOLDER_EMAIL_DOMAINS = new Set([
  'example.com', 'example.org', 'example.net', 'example.edu',
  'test.com', 'test.org', 'test.net', 'testing.com',
  // NOTE: deliberately NOT blocking real consumer providers that only *look*
  // like placeholders — email.com, mail.com and gmx.com all host real
  // mailboxes. Rejecting a genuine buyer costs far more than letting one junk
  // lead through, so this list stays limited to domains that cannot receive mail.
  'yourdomain.com', 'mydomain.com',
  'sample.com', 'demo.com', 'fake.com', 'nowhere.com',
  'invalid', 'localhost', 'local', 'test',
  'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'sharklasers.com',
  'trashmail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
  'throwawaymail.com', 'getnada.com', 'maildrop.cc', 'dispostable.com',
  'fakeinbox.com', 'mailnesia.com', 'spam4.me', 'mintemail.com',
])

/** Obvious filler local-parts that indicate nobody intends to be reached. */
const PLACEHOLDER_EMAIL_LOCALS = new Set([
  'test', 'tests', 'testing', 'test123', 'asdf', 'asd', 'qwerty',
  'noreply', 'no-reply', 'donotreply', 'do-not-reply',
  'nobody', 'none', 'null', 'undefined', 'xxx', 'aaa',
])

/** Longest address we accept — RFC 5321 caps a mailbox at 254 characters. */
export const MAX_EMAIL_LENGTH = 254

/**
 * Email check with three layers: shape, deliverability heuristics, and a
 * placeholder-domain blocklist so `name@example.com` can't reach the sales
 * inbox as a real lead.
 */
export function validateEmail(input: string): ValidationResult {
  const trimmed = (input ?? '').trim()
  if (!trimmed) {
    return { valid: false, error: 'Email address is required' }
  }
  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email address must be ${MAX_EMAIL_LENGTH} characters or fewer` }
  }
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address (e.g. john@gmail.com)' }
  }

  const lower = trimmed.toLowerCase()
  const atIndex = lower.lastIndexOf('@')
  const local = lower.slice(0, atIndex)
  const domain = lower.slice(atIndex + 1)

  // Consecutive dots, or a dot at either edge of a label, are not deliverable.
  if (lower.includes('..') || local.startsWith('.') || local.endsWith('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return { valid: false, error: 'Enter a valid email address (e.g. john@gmail.com)' }
  }

  if (PLACEHOLDER_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'Please use a real email address we can reach you on — placeholder and temporary addresses aren’t accepted',
    }
  }

  if (PLACEHOLDER_EMAIL_LOCALS.has(local)) {
    return { valid: false, error: 'Please enter your real email address' }
  }

  return { valid: true, normalized: lower }
}

/** Convenience boolean wrapper for disabling submit buttons */
export function isValidEmail(input: string): boolean {
  return validateEmail(input).valid
}

/**
 * Length ceilings for every free-text field, shared by the forms (which use
 * them as `maxLength`) and the API routes (which re-check them, because a
 * browser attribute is a courtesy, not a control).
 */
export const FIELD_LIMITS = {
  name: 80,
  firstName: 50,
  lastName: 50,
  make: 40,
  model: 60,
  employerName: 100,
  occupation: 60,
  address: 250,
  bankOther: 60,
  message: 2000,
  description: 5000,
} as const

/** Numeric ranges that keep obviously impossible values out of the leads. */
export const NUMERIC_LIMITS = {
  mileage: { min: 0, max: 1_500_000 },
  netIncome: { min: 1_000, max: 10_000_000 },
  totalExpenses: { min: 0, max: 10_000_000 },
} as const

/**
 * Validate a free-text field: required (unless `optional`), within its length
 * ceiling, and not just repeated punctuation or a single character mashed out.
 */
export function validateText(
  input: string,
  label: string,
  maxLength: number,
  { minLength = 2, optional = false }: { minLength?: number; optional?: boolean } = {}
): ValidationResult {
  const trimmed = (input ?? '').trim()

  if (!trimmed) {
    return optional
      ? { valid: true, normalized: '' }
      : { valid: false, error: `${label} is required` }
  }
  if (trimmed.length < minLength) {
    return { valid: false, error: `${label} must be at least ${minLength} characters` }
  }
  if (trimmed.length > maxLength) {
    return { valid: false, error: `${label} must be ${maxLength} characters or fewer` }
  }
  // "aaaaaaa", "-------", "2222222" — one character held down on the keyboard.
  if (trimmed.length >= 4 && /^(.)\1+$/.test(trimmed)) {
    return { valid: false, error: `Please enter a real ${label.toLowerCase()}` }
  }
  // No letters or digits at all means it's pure punctuation.
  if (!/[a-zA-Z0-9]/.test(trimmed)) {
    return { valid: false, error: `Please enter a real ${label.toLowerCase()}` }
  }

  return { valid: true, normalized: trimmed }
}

/**
 * Validate a numeric field against an inclusive range. Rejects blanks, junk,
 * negatives below the floor, and values past the ceiling.
 */
export function validateNumber(
  input: string | number,
  label: string,
  { min, max }: { min: number; max: number }
): ValidationResult {
  const raw = typeof input === 'number' ? String(input) : (input ?? '').trim()

  if (!raw) {
    return { valid: false, error: `${label} is required` }
  }
  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    return { valid: false, error: `${label} must be a number` }
  }

  const value = Number(raw)
  if (!Number.isFinite(value)) {
    return { valid: false, error: `${label} must be a number` }
  }
  if (value < min) {
    return {
      valid: false,
      error: min === 0
        ? `${label} can’t be a negative number`
        : `${label} must be at least ${min.toLocaleString('en-ZA')}`,
    }
  }
  if (value > max) {
    return { valid: false, error: `${label} can’t be more than ${max.toLocaleString('en-ZA')}` }
  }

  return { valid: true, normalized: String(value) }
}

/** Convenience boolean wrappers for disabling submit buttons */
export function isValidText(input: string, maxLength: number, minLength = 2): boolean {
  return validateText(input, 'Field', maxLength, { minLength }).valid
}

export function isValidNumber(input: string, range: { min: number; max: number }): boolean {
  return validateNumber(input, 'Field', range).valid
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
