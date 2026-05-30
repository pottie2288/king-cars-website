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
                { "@type": "City", "name": "Port Elizabeth" },
                { "@type": "City", "name": "Bellville" },
                { "@type": "City", "name": "Brackenfell" }
              ],
              "address": [
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Bellville",
                  "addressRegion": "Western Cape",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Brackenfell",
                  "addressRegion": "Western Cape",
                  "addressCountry": "ZA"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Port Elizabeth",
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
      <body>
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
