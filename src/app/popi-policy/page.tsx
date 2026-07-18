import type { Metadata } from 'next'
import { POPIPage } from './POPIPage'

export const metadata: Metadata = {
  title: 'POPI Policy',
  description: 'King Cars Protection of Personal Information Policy. Learn how we collect, use, and protect your personal information in accordance with POPIA.',
  alternates: { canonical: 'https://www.kingcars.co.za/popi-policy' },
}

export default function Page() {
  return <POPIPage />
}
