import type { Metadata } from 'next'
import { FinancePage } from './FinancePage'

export const metadata: Metadata = {
  title: 'Car Finance in Cape Town & Gqeberha',
  description: 'Calculate your monthly repayments and apply for vehicle finance online. We work with ABSA, Standard Bank, FNB, Nedbank, Capitec & WesBank. Branches in Cape Town and Gqeberha. Same-day approval available.',
  alternates: { canonical: 'https://www.kingcars.co.za/finance' },
}

export default function Page() {
  return <FinancePage />
}
