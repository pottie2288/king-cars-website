import type { Metadata } from 'next'
import { ContactPage } from './ContactPage'

export const metadata: Metadata = {
  title: 'Contact Us — Branches in Cape Town & Gqeberha',
  description: 'Find your nearest King Cars branch. Six locations across the Western Cape (Bellville, Vredekloof, Brackenfell) and Eastern Cape (17th Ave, Sydenham, Newton Park). Call or email us today.',
  alternates: { canonical: 'https://www.kingcars.co.za/contact' },
}

export default function Page() {
  return <ContactPage />
}
