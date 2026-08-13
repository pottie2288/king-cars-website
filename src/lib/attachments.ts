/**
 * Server-side limits for uploaded files.
 *
 * The forms cap file size in the browser, but a browser check only constrains
 * the browser — a direct POST to the API route ignores it entirely. These
 * limits are the ones that actually hold, so they run on every request.
 */

export interface SafeAttachment {
  filename: string
  content: Buffer
}

/** Per-file ceiling. Brevo base64-encodes attachments, inflating them ~33%. */
export const MAX_FILE_BYTES = 5 * 1024 * 1024

/** Ceiling across all files on one submission, to bound the Brevo payload. */
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024

/** Types we accept: vehicle photos and supporting paperwork. */
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
])

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf'])

export class AttachmentError extends Error {}

/**
 * Strip a filename down to something safe to hand to a mail client: no path
 * separators, no traversal, no control characters, bounded length.
 */
export function sanitizeFilename(name: string): string {
  const base = (name ?? '')
    .replace(/\\/g, '/')
    .split('/')
    .pop()!
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 100)

  return base || 'attachment'
}

/**
 * Validate one uploaded file and read it into a buffer.
 * Throws AttachmentError with a user-facing message when it fails a check.
 */
export async function readAttachment(file: File): Promise<SafeAttachment> {
  if (file.size > MAX_FILE_BYTES) {
    throw new AttachmentError(
      `"${file.name}" is larger than ${MAX_FILE_BYTES / 1024 / 1024}MB. Please attach a smaller file.`
    )
  }

  const filename = sanitizeFilename(file.name)
  const extension = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : ''

  // Check both the declared type and the extension — either one alone is
  // trivially forged, and we want the file to fail if either looks wrong.
  if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(extension)) {
    throw new AttachmentError(
      `"${file.name}" isn’t a supported file type. Please attach a JPG, PNG, WEBP or PDF.`
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Re-check after reading: `file.size` is metadata, the buffer is the truth.
  if (buffer.byteLength > MAX_FILE_BYTES) {
    throw new AttachmentError(
      `"${file.name}" is larger than ${MAX_FILE_BYTES / 1024 / 1024}MB. Please attach a smaller file.`
    )
  }

  return { filename, content: buffer }
}

/**
 * Read every file posted under the given field names, applying per-file and
 * total-size limits. Fields that are absent or empty are skipped.
 */
export async function collectAttachments(
  data: FormData,
  fieldNames: readonly string[]
): Promise<SafeAttachment[]> {
  const attachments: SafeAttachment[] = []
  let totalBytes = 0

  for (const field of fieldNames) {
    const value = data.get(field)
    if (!(value instanceof File) || value.size === 0) continue

    const attachment = await readAttachment(value)
    totalBytes += attachment.content.byteLength

    if (totalBytes > MAX_TOTAL_BYTES) {
      throw new AttachmentError(
        `Your attachments total more than ${MAX_TOTAL_BYTES / 1024 / 1024}MB. Please attach fewer or smaller files.`
      )
    }

    attachments.push(attachment)
  }

  return attachments
}
