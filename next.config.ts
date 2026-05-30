import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
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
