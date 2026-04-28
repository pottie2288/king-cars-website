import type { Metadata } from 'next'
import { ShowroomPage } from './ShowroomPage'

export const metadata: Metadata = {
  title: 'Used Cars for Sale in Cape Town & Port Elizabeth',
  description: 'Browse our full inventory of quality pre-owned cars. 28+ brands from R150k. Every vehicle includes a 2-year unlimited km warranty. Filter by make, price, and location.',
}

export default function Page() {
  return <ShowroomPage />
}
