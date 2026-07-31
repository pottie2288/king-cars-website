'use client'

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Tracks tel: and mailto: clicks site-wide.
 *
 * GA4 enhanced measurement only auto-tracks outbound http(s) links, so calls
 * and emails were invisible — even though they are the main contact channel on
 * /contact (six branch cards, each with phone + email) and in the footer. The
 * contact form is only a small slice of contact intent, which is why
 * contact_form_submitted looks low next to the page's traffic.
 *
 * One delegated capture-phase listener rather than per-link handlers, so links
 * added later are covered automatically and none can be missed.
 */
export function ContactLinkTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!(link instanceof HTMLAnchorElement)) return;

      const isPhone = link.href.startsWith('tel:');
      trackEvent(isPhone ? 'phone_click' : 'email_click', {
        // King Cars' own number/address — the branch contacted, not visitor data.
        contact: link.href.replace(/^(?:tel|mailto):/, ''),
      });
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
