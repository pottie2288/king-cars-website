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
      // Old VMG per-branch showroom pages (e.g. /showroom-bellville, /showroom-newton)
      { source: '/showroom-:branch', destination: '/showroom', permanent: true },
      // Old VMG per-branch team pages (e.g. /team-capetown, /team-sydenham, /team-newton)
      { source: '/team-:branch', destination: '/about', permanent: true },
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
