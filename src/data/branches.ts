export interface BranchHours {
  weekdays: string
  saturdays: string
  sundays: string
  holidays: string
}

/** Address broken into parts, for schema.org PostalAddress. */
export interface BranchAddress {
  streetAddress: string
  locality: string
  region: 'Western Cape' | 'Eastern Cape'
  postalCode?: string
}

export interface BranchGeo {
  latitude: number
  longitude: number
}

/**
 * A branch's Google Business Profile rating.
 *
 * Read straight off that branch's Google listing — this is asserted to search
 * engines and AI assistants as fact, so never estimate it. Update it whenever
 * the numbers move meaningfully; recency matters as much as the average.
 *
 * Branches with no `rating` are simply omitted from the structured data rather
 * than being given a made-up figure.
 */
export interface BranchRating {
  /** Star average as Google displays it, e.g. 4.6 */
  value: number
  /** Total number of Google reviews for this branch */
  count: number
}

export interface Branch {
  id: string
  name: string
  fullName: string
  address: string
  postal: BranchAddress
  geo: BranchGeo
  /** Google Business Profile rating. Omit until the real numbers are known. */
  rating?: BranchRating
  phones: string[]
  email: string
  mapUrl: string
  hours: BranchHours
}

const STANDARD_HOURS: BranchHours = {
  weekdays: '08:00 to 17:30',
  saturdays: '09:00 to 13:00',
  sundays: 'Closed',
  holidays: 'Closed',
}

export const BRANCHES: Branch[] = [
  {
    id: 'bellville',
    name: 'Bellville',
    fullName: 'King Cars Bellville',
    address: '25 Strand Rd, Bellville, Cape Town, 7530',
    postal: {
      streetAddress: '25 Strand Rd',
      locality: 'Bellville',
      region: 'Western Cape',
      postalCode: '7530',
    },
    geo: { latitude: -33.902909, longitude: 18.6438121 },
    rating: { value: 4.6, count: 234 },
    phones: ['083 500 8181'],
    email: 'andresadie@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=25%20Strand%20Rd%2C%20Bellville%2C%20Cape%20Town&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
  {
    id: 'brackenfell',
    name: 'Brackenfell',
    fullName: 'King Cars Brackenfell',
    address: 'Corner of Old Paarl and Ferndale St, Brackenfell, Cape Town',
    postal: {
      streetAddress: 'Corner of Old Paarl and Ferndale St',
      locality: 'Brackenfell',
      region: 'Western Cape',
    },
    geo: { latitude: -33.8711139, longitude: 18.7001289 },
    rating: { value: 5, count: 8 },
    phones: ['083 480 2929'],
    email: 'izzy@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=Corner%20of%20Old%20Paarl%20and%20Ferndale%20St%2C%20Brackenfell%2C%20Cape%20Town&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
  {
    id: 'vredekloof',
    name: 'Vredekloof',
    fullName: 'King Cars Vredekloof',
    address: '2 Hillcrest Rd, Vredekloof, Cape Town, 7560',
    postal: {
      streetAddress: '2 Hillcrest Rd',
      locality: 'Vredekloof',
      region: 'Western Cape',
      postalCode: '7560',
    },
    geo: { latitude: -33.8619014, longitude: 18.6834027 },
    rating: { value: 4.8, count: 40 },
    phones: ['072 293 9376'],
    email: 'louis@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=2%20Hillcrest%20Rd%2C%20Vredekloof%2C%20Cape%20Town%2C%207560&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
  {
    id: 'sydenham',
    name: 'Sydenham',
    fullName: 'King Cars Sydenham',
    address: '19 - 21 Uitenhage Road, Sydenham, Gqeberha',
    postal: {
      streetAddress: '19-21 Uitenhage Road',
      locality: 'Sydenham, Gqeberha',
      region: 'Eastern Cape',
    },
    geo: { latitude: -33.9313763, longitude: 25.5990354 },
    rating: { value: 4.4, count: 78 },
    phones: ['083 314 9334'],
    email: 'divan@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=19%20-%2021%20Uitenhage%20Road%2C%20Sydenham%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
  {
    id: 'newton-park',
    name: 'Newton Park',
    fullName: 'King Cars Newton Park',
    address: '343 Cape Rd, Newton Park, Gqeberha',
    postal: {
      streetAddress: '343 Cape Rd',
      locality: 'Newton Park, Gqeberha',
      region: 'Eastern Cape',
    },
    geo: { latitude: -33.9487518, longitude: 25.5650611 },
    rating: { value: 4.6, count: 58 },
    phones: ['068 037 4018'],
    email: 'shane@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=343%20Cape%20Rd%2C%20Newton%20Park%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
  {
    id: '17th',
    name: '17th Ave',
    fullName: 'King Cars On 17th',
    address: '1 William Moffett Express Way, Walmer, Gqeberha',
    postal: {
      streetAddress: '1 William Moffett Express Way',
      locality: 'Walmer, Gqeberha',
      region: 'Eastern Cape',
    },
    geo: { latitude: -33.9783333, longitude: 25.5874001 },
    rating: { value: 5, count: 6 },
    phones: ['073 431 4230'],
    email: 'simbo@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=1%20William%20Moffett%20Express%20Way%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
]
