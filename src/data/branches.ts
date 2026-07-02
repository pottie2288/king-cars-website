export interface BranchHours {
  weekdays: string
  saturdays: string
  sundays: string
  holidays: string
}

export interface Branch {
  id: string
  name: string
  fullName: string
  address: string
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
    phones: ['083 302 4500'],
    email: 'andre@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=Corner%20of%20Old%20Paarl%20and%20Ferndale%20St%2C%20Brackenfell%2C%20Cape%20Town&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
  {
    id: 'vredekloof',
    name: 'Vredekloof',
    fullName: 'King Cars Vredekloof',
    address: '2 Hillcrest Rd, Vredekloof, Cape Town, 7560',
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
    phones: ['073 431 4230'],
    email: 'simbo@kingcars.co.za',
    mapUrl:
      'https://maps.google.com/maps?q=1%20William%20Moffett%20Express%20Way%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: STANDARD_HOURS,
  },
]
