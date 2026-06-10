import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { VmgVehicle } from '@/types'
import { ShowroomPage } from './ShowroomPage'

const VMG_API_URL = 'https://vmgplay.co.za/api/v3/view_stock_complete_with_data?company_id=in.(133,209,153,154)';

export const metadata: Metadata = {
  title: 'Used Cars for Sale in Cape Town & Gqeberha | King Cars',
  description: 'Browse our full inventory of quality pre-owned cars. 28+ brands from R150k. Every vehicle includes a 2-year unlimited km warranty. Filter by make, price, and location.',
}

export default async function Page() {
  let initialVehicles: VmgVehicle[] = [];
  try {
    const res = await fetch(VMG_API_URL, { next: { revalidate: 300 } });
    if (res.ok) initialVehicles = await res.json();
  } catch {}

  return (
    <Suspense>
      <ShowroomPage initialVehicles={initialVehicles} />
    </Suspense>
  )
}
