/**
 * In-memory sliding-window rate limiter for the public lead endpoints.
 *
 * Every form here sends an email through Brevo, so an unthrottled endpoint is
 * both a spam vector into staff inboxes and a way to burn the sending quota.
 * State lives in the serverless instance's memory: it resets on cold start and
 * isn't shared between instances, so it is a speed bump rather than a wall.
 * That is the right trade-off at this traffic level — it stops the trivial
 * "hold down submit" and scripted-flood cases without adding infrastructure.
 * If abuse becomes targeted, move this to Vercel KV or Upstash and keep the
 * same call signature.
 */

interface Bucket {
  /** Epoch-ms timestamps of requests still inside the window */
  hits: number[]
}

const buckets = new Map<string, Bucket>()

/** Drop idle buckets once the map grows, so memory can't creep upward. */
const MAX_TRACKED_KEYS = 10_000

export interface RateLimitOptions {
  /** Requests permitted per window */
  limit: number
  /** Window length in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  /** Requests left in the current window */
  remaining: number
  /** Seconds until the window frees up — for the Retry-After header */
  retryAfterSeconds: number
}

/** Defaults tuned for a human filling in a form, not a script. */
export const LEAD_FORM_LIMIT: RateLimitOptions = {
  limit: 5,
  windowMs: 10 * 60 * 1000, // 5 submissions per 10 minutes
}

/**
 * Identify the caller. Behind Vercel, `x-forwarded-for` is set by the platform
 * and its first entry is the real client address. The header is spoofable in
 * principle, which is another reason this is a speed bump by design.
 */
export function getClientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp?.trim() || 'unknown'
  return `${scope}:${ip}`
}

/**
 * Record a request and report whether it is permitted. Call once per request,
 * before doing any real work.
 */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions = LEAD_FORM_LIMIT
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowMs

  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, bucket] of buckets) {
      if (bucket.hits.every(t => t <= windowStart)) buckets.delete(k)
    }
  }

  const existing = buckets.get(key)
  const hits = (existing?.hits ?? []).filter(t => t > windowStart)

  if (hits.length >= limit) {
    const oldest = hits[0]
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000))
    buckets.set(key, { hits })
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  buckets.set(key, { hits: [...hits, now] })
  return { allowed: true, remaining: limit - hits.length - 1, retryAfterSeconds: 0 }
}

/**
 * Standard 429 for a blocked request. The message is deliberately generic —
 * it tells a real person what to do without describing the limit to a script.
 */
export function rateLimitResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many submissions from this device. Please wait a few minutes and try again, or call us on 083 500 8181.',
    }),
    {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(retryAfterSeconds),
      },
    }
  )
}
