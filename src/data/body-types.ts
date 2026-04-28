export interface BodyType {
  /** Display label shown on the filter card (uppercase styling applied in component) */
  name: string
  /** Path to the body-type illustration in /public */
  image: string
  /** Category value used for filtering vehicles (case must match VMG body_type values) */
  category: string
  /**
   * Optional exact door count to filter on. Used to split bakkies into
   * Single Cab (2 doors) vs Double Cab (4 doors) — both share category "Bakkie".
   */
  doors?: number
}

export const BODY_TYPES: BodyType[] = [
  { name: 'SUV', image: '/body-types/suv.png', category: 'SUV' },
  { name: 'HATCHBACK', image: '/body-types/hatchback.png', category: 'Hatchback' },
  { name: 'DOUBLE CAB', image: '/body-types/doublecab.png', category: 'Bakkie', doors: 4 },
  { name: 'SEDAN', image: '/body-types/sedan.png', category: 'Sedan' },
  { name: 'SINGLE CAB', image: '/body-types/singlecab.png', category: 'Bakkie', doors: 2 },
  { name: 'PANEL VAN / MINI', image: '/body-types/minivan.png', category: 'Bakkie' },
]
