/**
 * Lightweight GA4 event helper. Safe to call anywhere on the client —
 * no-ops on the server or before gtag has loaded.
 *
 * Never pass personal data (name, email, phone, ID) as params — GA4 rejects PII.
 */
type GtagParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: GtagParams = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', name, params);
}
