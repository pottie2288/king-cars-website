export interface Bank {
  /** Stable identifier used for form values, e.g. in select inputs */
  id: string
  /** Display name shown to users */
  name: string
  /** Path to the bank logo in /public */
  logo: string
}

/**
 * Lenders displayed on the Finance page — the institutions we submit
 * finance applications to on behalf of customers.
 */
export const BANKS: Bank[] = [
  { id: 'absa', name: 'ABSA', logo: '/banks/absa.png' },
  { id: 'standard_bank', name: 'Standard Bank', logo: '/banks/standardbank.png' },
  { id: 'fnb', name: 'FNB', logo: '/banks/fnb.png' },
  { id: 'nedbank', name: 'Nedbank', logo: '/banks/nedbank.png' },
  { id: 'capitec', name: 'Capitec', logo: '/banks/capitec.png' },
  { id: 'wesbank', name: 'WesBank', logo: '/banks/wesbank.png' },
]

/**
 * Banks shown in the finance application form's "Main Banking Institution"
 * dropdown — the customer's own personal bank account, not lenders.
 */
export const PERSONAL_BANKS: Pick<Bank, 'id' | 'name'>[] = [
  { id: 'absa', name: 'ABSA' },
  { id: 'fnb', name: 'FNB' },
  { id: 'standard_bank', name: 'Standard Bank' },
  { id: 'nedbank', name: 'Nedbank' },
  { id: 'capitec', name: 'Capitec' },
  { id: 'discovery', name: 'Discovery Bank' },
  { id: 'other', name: 'Other' },
]
