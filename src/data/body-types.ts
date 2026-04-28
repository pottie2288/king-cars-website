export interface BodyType {
  /** Display label shown on the filter card (uppercase styling applied in component) */
  name: string
  /** Path to the body-type illustration in /public */
  image: string
  /** Category value used for filtering vehicles (case must match VMG body_type values) */
  category: string
}

export const BODY_TYPES: BodyType[] = [
  { name: 'SUV', image: '/body-types/suv.png', category: 'SUV' },
  { name: 'HATCHBACK', image: '/body-types/hatchback.png', category: 'Hatchback' },
  { name: 'DOUBLE CAB', image: '/body-types/doublecab.png', category: 'Bakkie' },
  { name: 'SEDAN', image: '/body-types/sedan.png', category: 'Sedan' },
  { name: 'SINGLE CAB', image: '/body-types/singlecab.png', category: 'Bakkie' },
  { name: 'PANEL VAN / MINI', image: '/body-types/minivan.png', category: 'Bakkie' },
]
