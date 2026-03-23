import type { Metadata } from 'next'
import { AboutPage } from '@/views/AboutPage'

export const metadata: Metadata = {
  title: 'About King Cars | 30+ Years Selling Quality Pre-Owned Cars',
  description: 'Family-owned since 1995. 50,000+ cars sold across 6 locations in Cape Town and Port Elizabeth. Every vehicle backed by a 2-year unlimited km warranty.',
}

export default function Page() {
  return <AboutPage />
}
