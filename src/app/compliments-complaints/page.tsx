import type { Metadata } from 'next'
import { ComplaintsPage } from './ComplaintsPage'

export const metadata: Metadata = {
  title: 'Share Your Feedback | King Cars Compliments & Complaints',
  description: 'Had a great experience or something to improve? Share your feedback with King Cars. We value every customer review across our Cape Town and Gqeberha branches.',
  alternates: { canonical: 'https://www.kingcars.co.za/compliments-complaints' },
}

export default function Page() {
  return <ComplaintsPage />
}
