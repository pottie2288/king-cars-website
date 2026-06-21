'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SHOWROOM_SCROLL_KEY } from '@/lib/scroll-keys';

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Stand down when returning to the showroom with a saved scroll position —
    // ShowroomPage restores the user to the car they were viewing instead.
    if (pathname === '/showroom' && sessionStorage.getItem(SHOWROOM_SCROLL_KEY)) {
      return;
    }

    // Immediate scroll attempts for all common scrolling elements
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // Delayed scroll to handle mobile/async layout shifts and native scroll restoration
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
