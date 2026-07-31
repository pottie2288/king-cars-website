import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-eu-west-1.amazonaws.com',
        pathname: '/vmgplay/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Force www — fixes all "duplicate without canonical" in GSC
      // Covers both http://kingcars.co.za and https://kingcars.co.za (non-www)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kingcars.co.za' }],
        destination: 'https://www.kingcars.co.za/:path*',
        permanent: true,
      },
      // Old VMG pages still being crawled by Google
      { source: '/our-vision-and-mission{/}?', destination: '/about', permanent: true },
      { source: '/social-media{/}?', destination: '/', permanent: true },
      { source: '/private{/}?', destination: '/showroom', permanent: true },
      // Old VMG per-branch showroom pages — route to the correct province filter
      // rather than dumping everyone on the unfiltered showroom. There's no
      // branch-level filter today (the VMG feed's branch field is messy/inconsistent —
      // see SEO_FIX_PLAN.md), so province is the most precise filter available.
      { source: '/showroom-bellville', destination: '/showroom?location=Western%20Cape', permanent: true },
      { source: '/showroom-brackenfell', destination: '/showroom?location=Western%20Cape', permanent: true },
      { source: '/showroom-vredekloof', destination: '/showroom?location=Western%20Cape', permanent: true },
      { source: '/showroom-newton', destination: '/showroom?location=Eastern%20Cape', permanent: true },
      { source: '/showroom-sydenham', destination: '/showroom?location=Eastern%20Cape', permanent: true },
      { source: '/showroom-walmer', destination: '/showroom?location=Eastern%20Cape', permanent: true },
      // Fallback for any other old branch slug not explicitly mapped above
      { source: '/showroom-:branch', destination: '/showroom', permanent: true },
      // Old VMG per-branch team pages (e.g. /team-capetown, /team-sydenham, /team-newton)
      { source: '/team-:branch', destination: '/about', permanent: true },
      // Note: bare /team, /our-team, /staff, /people and /get-in-touch are
      // deliberately NOT redirected. They never existed here — they appear in no
      // sitemap entry and no internal link, and the traffic is bot noise
      // (0.00s engagement, 1 pageview, 100% desktop, from 10 Jul 2026). A 301
      // would forward that noise onto /about and /contact and pollute two real
      // pages, so they 404 instead. Analytics is suppressed on 404 — see
      // markPageNotFound() in src/lib/analytics.ts.
      // Old testimonials page
      { source: '/testimonials{/}?', destination: '/about', permanent: true },
      // Old news section (indexed on old site — send to home)
      { source: '/news', destination: '/', permanent: true },
      { source: '/news/:path*', destination: '/', permanent: true },
      // Old news articles lived at /vehicle/[id] on the VMG platform
      { source: '/vehicle/:path*', destination: '/showroom', permanent: true },
      // Common URL variants that may be indexed or bookmarked
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/finance-application', destination: '/finance', permanent: true },
      // POPI/privacy variants
      { source: '/popi', destination: '/popi-policy', permanent: true },
      { source: '/privacy-policy', destination: '/popi-policy', permanent: true },
      // Old Private 2 Private section
      { source: '/private-2-private', destination: '/showroom', permanent: true },
      { source: '/private-2-private/:path*', destination: '/showroom', permanent: true },
    ]
  },
}

export default nextConfig
