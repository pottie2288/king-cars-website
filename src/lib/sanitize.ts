/**
 * Output encoding for the lead emails we send to staff.
 *
 * Every lead form ends up as an HTML email in a King Cars inbox. Without
 * encoding, anything a visitor types is rendered as live markup by the mail
 * client — so a "message" field containing an <a> tag becomes a working link
 * in an email that appears to come from our own website. Encode at the point
 * of output, never trust the form.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Encode a value for safe interpolation into HTML email body text.
 * Nullish values render as an em dash so empty rows stay readable.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '—'

  const str = String(value)
  if (!str) return '—'

  return str.replace(/[&<>"']/g, char => HTML_ENTITIES[char])
}

/**
 * Encode a value and convert newlines to <br> so multi-line messages keep
 * their shape. Escaping runs first, so the <br> we add is the only markup
 * that survives.
 */
export function escapeHtmlMultiline(value: unknown): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, '<br>')
}

/**
 * Build an email subject from user-supplied text: strip CR/LF (which some
 * mail infrastructure treats as a header boundary), collapse whitespace, and
 * cap the length so the subject line stays usable.
 */
export function safeSubject(value: unknown, maxLength = 150): string {
  const cleaned = String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (!cleaned) return 'Website enquiry'
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned
}

/**
 * Trim an incoming form value to a string and cap its length before it is
 * stored or emailed. Defends against multi-megabyte payloads that would
 * otherwise be forwarded verbatim into an inbox.
 */
export function coerceField(value: unknown, maxLength: number): string {
  if (value === null || value === undefined) return ''
  return String(value).trim().slice(0, maxLength)
}
