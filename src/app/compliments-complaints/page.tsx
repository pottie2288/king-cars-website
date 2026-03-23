import type { Metadata } from 'next'
import { ComplaintsPage } from '@/views/ComplaintsPage'

export const metadata: Metadata = {
  title: 'Compliments & Complaints',
  description: 'Share your experience with King Cars. We value your feedback and use it to continuously improve our service.',
}

export default function Page() {
  return <ComplaintsPage />
}
