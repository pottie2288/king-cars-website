import type { Metadata } from 'next'
import { FinancePage } from './FinancePage'

export const metadata: Metadata = {
  title: 'Car Finance Calculator & Application',
  description: 'Calculate your monthly car repayments and apply for vehicle finance online. We work with ABSA, Standard Bank, FNB, Nedbank, Capitec & WesBank. Same-day approval available.',
}

export default function Page() {
  return <FinancePage />
}
