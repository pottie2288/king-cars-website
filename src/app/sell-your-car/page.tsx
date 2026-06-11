import type { Metadata } from 'next'
import { SellYourCarPage } from './SellYourCarPage'

export const metadata: Metadata = {
  title: 'Sell Your Car for Cash in Cape Town & Port Elizabeth',
  description: 'Get a fair cash offer for your vehicle within 24 hours. Hassle-free process, instant payment. We buy all makes and models. Trade-in or sell outright.',
  alternates: { canonical: 'https://www.kingcars.co.za/sell-your-car' },
}

export default function Page() {
  return <SellYourCarPage />
}
