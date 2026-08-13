import { BRANCHES, type Branch } from '@/data/branches'
import { GOOGLE_REVIEWS, REVIEW_RATING } from '@/data/reviews'

export const SITE_URL = 'https://www.kingcars.co.za'

/**
 * Profiles that represent the same King Cars entity elsewhere on the web.
 *
 * `sameAs` is how search engines and AI assistants confirm that the business on
 * this site is the same one carrying reviews and history on those platforms —
 * without it the entity stays fragmented and reputation signals don't attach.
 * Only list profiles King Cars actually controls or is listed on.
 */
const SAME_AS = [
  'https://www.facebook.com/kingcars.co.za/',
  'https://www.instagram.com/kingcars.co.za/',
]

/** '083 500 8181' -> '+27835008181' */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `+27${digits.slice(1)}` : `+${digits}`
}

function postalAddress(branch: Branch) {
  return {
    '@type': 'PostalAddress',
    streetAddress: branch.postal.streetAddress,
    addressLocality: branch.postal.locality,
    addressRegion: branch.postal.region,
    ...(branch.postal.postalCode && { postalCode: branch.postal.postalCode }),
    addressCountry: 'ZA',
  }
}

/** Shared trading hours — identical across every branch. */
const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:30',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Saturday',
    opens: '09:00',
    closes: '13:00',
  },
]

function ratingSchema(value: number, count: number) {
  return {
    '@type': 'AggregateRating',
    ratingValue: Number(value.toFixed(1)),
    bestRating: 5,
    worstRating: 1,
    reviewCount: count,
  }
}

function branchSchema(branch: Branch) {
  return {
    '@type': 'AutoDealer',
    name: branch.fullName,
    url: `${SITE_URL}/contact`,
    telephone: toE164(branch.phones[0]),
    email: branch.email,
    address: postalAddress(branch),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: branch.geo.latitude,
      longitude: branch.geo.longitude,
    },
    ...(branch.rating && {
      aggregateRating: ratingSchema(branch.rating.value, branch.rating.count),
    }),
    openingHoursSpecification: OPENING_HOURS,
  }
}

/**
 * The group's overall rating across every branch, weighted by review volume —
 * a branch with 300 reviews should move the average more than one with 12.
 *
 * Falls back to the reviews displayed on the homepage while the per-branch
 * Google numbers are still being filled in, so this is always backed by real
 * data rather than an estimate.
 */
function groupRating() {
  const rated = BRANCHES.filter(b => b.rating)
  if (rated.length === 0) {
    return ratingSchema(REVIEW_RATING, GOOGLE_REVIEWS.length)
  }

  const totalReviews = rated.reduce((sum, b) => sum + b.rating!.count, 0)
  const weightedSum = rated.reduce(
    (sum, b) => sum + b.rating!.value * b.rating!.count,
    0
  )
  return ratingSchema(weightedSum / totalReviews, totalReviews)
}

/**
 * A sample of full review texts, for the detail they give an AI assistant
 * summarising King Cars. This is a selection of testimonials, not the whole
 * review corpus — the true totals live in each branch's `rating`.
 */
function reviewSchema() {
  return GOOGLE_REVIEWS.map(review => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: review.name },
    datePublished: review.datePublished,
    reviewBody: review.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: REVIEW_RATING,
      bestRating: 5,
      worstRating: 1,
    },
  }))
}

/**
 * The organisation-level JSON-LD rendered on every page.
 *
 * Derived from BRANCHES and GOOGLE_REVIEWS so branch contact details and
 * reviews never drift between what the site shows and what it tells crawlers.
 */
export function buildOrganisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#organisation`,
    name: 'King Cars',
    description:
      'Quality pre-owned car dealership with 6 branches across the Western Cape and Eastern Cape. 28+ brands with 2-year unlimited km warranty.',
    url: SITE_URL,
    logo: `${SITE_URL}/king-cars-logo.png`,
    image: `${SITE_URL}/king-cars-logo.png`,
    telephone: toE164(BRANCHES[0].phones[0]),
    priceRange: 'R150000 - R350000',
    currenciesAccepted: 'ZAR',
    paymentAccepted: 'Cash, Finance, Trade-In',
    sameAs: SAME_AS,
    areaServed: [
      { '@type': 'City', name: 'Cape Town' },
      { '@type': 'City', name: 'Bellville' },
      { '@type': 'City', name: 'Vredekloof' },
      { '@type': 'City', name: 'Brackenfell' },
      { '@type': 'City', name: 'Gqeberha' },
      { '@type': 'City', name: 'Port Elizabeth' },
    ],
    aggregateRating: groupRating(),
    review: reviewSchema(),
    department: BRANCHES.map(branchSchema),
  }
}
