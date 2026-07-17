import type { Metadata } from 'next'
import Script from 'next/script'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { FavouritesProvider } from '@/context/FavouritesContext'
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
        <link rel="icon" type="image/png" href="/king-cars-logo.png" />
        <link rel="apple-touch-icon" href="/king-cars-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "King Cars",
              "description": "Quality pre-owned car dealership in Cape Town and Port Elizabeth. 28+ brands with 2-year unlimited km warranty.",
              "url": "https://www.kingcars.co.za",
              "logo": "https://www.kingcars.co.za/king-cars-logo.png",
              "telephone": "+27835008181",
              "priceRange": "R150000 - R350000",
              "currenciesAccepted": "ZAR",
              "paymentAccepted": "Cash, Finance, Trade-In",
              "areaServed": [
                { "@type": "City", "name": "Cape Town" },
                { "@type": "City", "name": "Bellville" },
                { "@type": "City", "name": "Vredekloof" },
                { "@type": "City", "name": "Brackenfell" },
                { "@type": "City", "name": "Gqeberha" },
                { "@type": "City", "name": "Port Elizabeth" }
              ],
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "25 Strand Rd",
                  "addressLocality": "Bellville",
                  "addressRegion": "Western Cape",
                  "postalCode": "7530",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "2 Hillcrest Rd",
                  "addressLocality": "Vredekloof",
                  "addressRegion": "Western Cape",
                  "postalCode": "7560",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Corner of Old Paarl and Ferndale St",
                  "addressLocality": "Brackenfell",
                  "addressRegion": "Western Cape",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "1 William Moffett Express Way",
                  "addressLocality": "Walmer, Gqeberha",
                  "addressRegion": "Eastern Cape",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "19-21 Uitenhage Road",
                  "addressLocality": "Sydenham, Gqeberha",
                  "addressRegion": "Eastern Cape",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "343 Cape Rd",
                  "addressLocality": "Newton Park, Gqeberha",
                  "addressRegion": "Eastern Cape",
                  "addressCountry": "ZA"
                }
              ]
            })
          }}
        />
      </head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
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
          fbq('track', 'PageView');
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
