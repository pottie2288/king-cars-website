/**
 * Lightweight GA4 + Meta Pixel event helper. Safe to call anywhere on the
 * client — no-ops on the server.
 *
 * Never pass personal data (name, email, phone, ID) as params — GA4 rejects PII.
 */
type GtagParams = Record<string, string | number | boolean | undefined>;
type MetaParams = Record<string, string | number | string[] | undefined>;

interface AnalyticsWindow {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
  /** See markPageNotFound() */
  __kcNotFound?: boolean;
}

function analyticsWindow(): AnalyticsWindow | null {
  return typeof window === 'undefined'
    ? null
    : (window as unknown as AnalyticsWindow);
}

/**
 * GA4 event name -> Meta standard event name.
 *
 * Meta can only optimise for events it receives, and its pixel was firing
 * PageView and nothing else — so every Meta campaign could only ever bid for
 * traffic. These are the standard events Meta's delivery system understands;
 * custom names would not be usable as an optimisation goal.
 *
 * Two tiers on purpose:
 *   Lead    — the visitor actually reached a person (manager WhatsApp tap, sent
 *             enquiry, submitted a form). Matches what we count as a lead in
 *             reporting, so Meta optimises for the same thing we measure.
 *   Contact — softer intent. Opening the WhatsApp chooser is not contacting
 *             anyone: ~99 opens produced ~56 manager taps, so treating an open
 *             as a Lead would overstate them by roughly half.
 *
 * finance_application_submitted maps to SubmitApplication, Meta's own standard
 * event for applications — the highest-intent action on the site.
 *
 * Events absent from this map are GA4-only by design (enquiry_failed,
 * feedback_submitted): failures and admin actions are not conversions.
 */
const META_EVENTS: Readonly<Record<string, string>> = {
  whatsapp_manager_tapped: 'Lead',
  enquiry_sent: 'Lead',
  contact_form_submitted: 'Lead',
  sell_car_submitted: 'Lead',
  finance_application_submitted: 'SubmitApplication',
  whatsapp_modal_opened: 'Contact',
  phone_click: 'Contact',
  email_click: 'Contact',
};

/**
 * Meta's snippet in app/layout.tsx starts with `if (f.fbq) return;`, so
 * installing our own fbq stub the way trackEvent does for gtag would make the
 * real snippet bail out and never inject fbevents.js — killing the pixel
 * outright. We buffer locally instead and flush once fbq appears.
 *
 * The snippet is afterInteractive and these events are all user-initiated, so
 * the queue is virtually always empty; the retry only covers a click landing in
 * the gap between hydration and the pixel loading.
 */
const pendingMetaEvents: Array<[string, MetaParams]> = [];
let metaFlushTimer: ReturnType<typeof setTimeout> | null = null;
let metaFlushAttempts = 0;
const META_FLUSH_INTERVAL_MS = 400;
const META_FLUSH_MAX_ATTEMPTS = 15; // ~6s, then give up rather than leak a timer

function flushMetaEvents(): void {
  const w = analyticsWindow();
  if (!w) return;

  if (typeof w.fbq === 'function') {
    while (pendingMetaEvents.length) {
      const queued = pendingMetaEvents.shift();
      if (queued) w.fbq('track', queued[0], queued[1]);
    }
  }

  if (metaFlushTimer !== null) {
    clearTimeout(metaFlushTimer);
    metaFlushTimer = null;
  }

  if (pendingMetaEvents.length && metaFlushAttempts < META_FLUSH_MAX_ATTEMPTS) {
    metaFlushAttempts += 1;
    metaFlushTimer = setTimeout(flushMetaEvents, META_FLUSH_INTERVAL_MS);
  }
}

function trackMeta(eventName: string, params: MetaParams = {}): void {
  if (!analyticsWindow()) return;
  pendingMetaEvents.push([eventName, params]);
  flushMetaEvents();
}

/**
 * Carries the vehicle through to Meta so Lead events are attributable to a
 * specific car, and so value-based bidding has a price to work with later.
 * Deliberately narrow — only the two keys our call sites already pass.
 */
function metaParamsFromGtag(params: GtagParams): MetaParams {
  const out: MetaParams = {};
  const carId = params.car_id;
  const carName = params.car;

  if (carId !== undefined) {
    out.content_ids = [String(carId)];
    out.content_type = 'product';
  }
  if (carName !== undefined) out.content_name = String(carName);

  return out;
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

  const metaEvent = META_EVENTS[name];
  if (metaEvent) trackMeta(metaEvent, metaParamsFromGtag(params));
}

/**
 * Fires Meta's ViewContent for a vehicle detail page.
 *
 * Meta-only and deliberately not routed through trackEvent: GA4 already counts
 * this as a page_view, and adding a second GA4 event risks it being marked a
 * key event and inflating the conversion count.
 *
 * This is the event worth optimising for at a small budget. Leads are too rare
 * for Meta to learn on (~50/week per ad set is the threshold), while PageView is
 * so cheap it selects for the most casual clicker available — the previous
 * traffic campaign turned 2,280 clicks into only 136 engaged page views.
 * "Looked at a car" sits between the two: frequent enough to optimise, specific
 * enough to mean something.
 */
export function trackCarView(car: {
  id: string;
  year: number | string;
  make: string;
  model: string;
  price: number;
}): void {
  trackMeta('ViewContent', {
    content_ids: [String(car.id)],
    content_type: 'product',
    content_name: `${car.year} ${car.make} ${car.model}`,
    value: car.price,
    currency: 'ZAR',
  });
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
