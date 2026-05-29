import type { Metadata } from 'next'
import { POPIPage } from './POPIPage'

export const metadata: Metadata = {
  title: 'POPI Policy | King Cars',
  description: 'King Cars Protection of Personal Information Policy. Learn how we collect, use, and protect your personal information in accordance with POPIA.',
}

export default function Page() {
  return <POPIPage />
}
