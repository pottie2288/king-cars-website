import type { Metadata } from 'next'
import Script from 'next/script'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ContactLinkTracker } from '@/components/ContactLinkTracker'
import { FavouritesProvider } from '@/context/FavouritesContext'
import { buildOrganisationSchema } from '@/lib/structured-data'
import './globals.css'

const GA_ID = 'G-P7Q2FW89KW'

export const metadata: Metadata = {
  title: {
    default: 'King Cars | Quality Pre-Owned Cars in Cape Town & Port Elizabeth',
    template: '%s | King Cars',
  },
  description: 'Browse 28+ brands of affordable, reliable pre-owned cars. Every vehicle includes a 2-year unlimited km warranty. Finance available. Branches in Bellville, Brackenfell & Port Elizabeth.',
  metadataBase: new URL('https://www.kingcars.co.za'),
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'King Cars',
    images: ['/king-cars-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'geo.region': 'ZA',
    'geo.placename': 'Cape Town, Bellville, Brackenfell, Gqeberha',
    'geo.position': '-33.9249;18.4241',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Icons come from src/app/{favicon.ico,icon.png,apple-icon.png}, which
            Next.js discovers and links automatically. The old manual tags
            pointed at the full 800x228 wordmark, which browsers squashed into
            the square tab slot. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganisationSchema()),
          }}
        />
      </head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/*
        Is this document an HTTP error response? Bots hitting non-existent URLs
        were creating ~470 GA4 sessions a week at 0.00s engagement, so neither
        tag below sends its page-view beacon on a 404.

        Two signals, because neither alone is sufficient:
          1. responseStatus — the browser reporting the real HTTP status
             (Chrome 109+). Server truth, and independent of React entirely.
          2. window.__kcNotFound — set during render by app/not-found.tsx, for
             browsers without responseStatus (Safari, Firefox). Both snippets
             below are injected from a next/script effect, and React completes
             every render in a commit before running effects, so the flag is
             normally set in time — but signal 1 does not rely on that.
        Evaluated lazily so the fallback is read at call time. Both call sites
        guard on the function existing, so if the detector ever fails to load the
        tags fall back to tracking normally rather than breaking.
      */}
      <Script id="page-status" strategy="beforeInteractive">
        {`
          window.__kcIsErrorPage = function () {
            try {
              var nav = performance.getEntriesByType('navigation')[0];
              if (nav && typeof nav.responseStatus === 'number') {
                return nav.responseStatus >= 400;
              }
            } catch (e) {}
            return !!window.__kcNotFound;
          };
        `}
      </Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: !(window.__kcIsErrorPage && window.__kcIsErrorPage()) });
        `}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1987670918567269');
          if (!(window.__kcIsErrorPage && window.__kcIsErrorPage())) fbq('track', 'PageView');
        `}
      </Script>
      <body>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1987670918567269&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <FavouritesProvider>
          <div className="min-h-screen bg-white overflow-x-hidden relative">
            <ScrollToTop />
            <ContactLinkTracker />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
        </FavouritesProvider>
      </body>
    </html>
  )
}
