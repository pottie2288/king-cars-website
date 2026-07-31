/**
 * Lightweight GA4 event helper. Safe to call anywhere on the client —
 * no-ops on the server.
 *
 * Never pass personal data (name, email, phone, ID) as params — GA4 rejects PII.
 */
type GtagParams = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  /** See markPageNotFound() */
  __kcNotFound?: boolean;
}

function analyticsWindow(): AnalyticsWindow | null {
  return typeof window === 'undefined'
    ? null
    : (window as unknown as AnalyticsWindow);
}

export function trackEvent(name: string, params: GtagParams = {}): void {
  const w = analyticsWindow();
  if (!w) return;

  // gtag.js is injected after hydration (next/script afterInteractive), so a
  // fast click or submit can land before window.gtag exists. Install the
  // canonical stub instead of dropping the event — it queues on dataLayer and
  // replays once gtag.js loads.
  if (typeof w.gtag !== 'function') {
    const dataLayer = (w.dataLayer = w.dataLayer ?? []);
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
  }

  w.gtag('event', name, params);
}

/**
 * Marks the current render as a 404 so the tag snippets in app/layout.tsx skip
 * their initial page_view / PageView beacon. Bots hitting non-existent URLs
 * were otherwise creating ~470 GA4 sessions a week at 0.00s engagement.
 *
 * This is the fallback signal, used only where the browser does not expose
 * PerformanceNavigationTiming.responseStatus (Safari, Firefox) — see the
 * page-status snippet in app/layout.tsx.
 *
 * Must be called during render, not from an effect: next/script injects
 * afterInteractive scripts from an effect, and React completes every render in
 * a commit before running any effect, so a render-phase flag is set in time.
 * Setting it twice (StrictMode) is harmless.
 */
export function markPageNotFound(): void {
  const w = analyticsWindow();
  if (w) w.__kcNotFound = true;
}
