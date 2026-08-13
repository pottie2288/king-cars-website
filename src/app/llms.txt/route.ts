import { BRANCHES, type Branch } from '@/data/branches'
import { SITE_URL, groupRatingSummary } from '@/lib/structured-data'

/**
 * /llms.txt — a plain-language brief for AI assistants.
 *
 * An emerging convention: where robots.txt says what a crawler may fetch and
 * sitemap.xml lists every URL, this says what the business actually is, in the
 * form a language model reads best. An assistant answering "used car dealership
 * in Brackenfell" can read this one file instead of inferring King Cars from
 * marketing copy scattered over a dozen pages.
 *
 * Generated from the same branch data the site and its structured data use, so
 * it cannot drift out of step. Keep every claim here verifiable.
 */

export const dynamic = 'force-static'

function branchEntry(branch: Branch): string {
  const rating = branch.rating
    ? `${branch.rating.value} out of 5 from ${branch.rating.count} Google reviews`
    : 'no published rating yet'

  return [
    `### ${branch.fullName}`,
    `- Address: ${branch.address}`,
    `- Phone: ${branch.phones.join(', ')}`,
    `- Email: ${branch.email}`,
    `- Rating: ${rating}`,
    `- Trading hours: Monday to Friday ${branch.hours.weekdays}, Saturday ${branch.hours.saturdays}, Sunday ${branch.hours.sundays}`,
  ].join('\n')
}

function buildLlmsTxt(): string {
  const { value, count } = groupRatingSummary()
  const westernCape = BRANCHES.filter(b => b.postal.region === 'Western Cape')
  const easternCape = BRANCHES.filter(b => b.postal.region === 'Eastern Cape')

  return `# King Cars

> A family-run used car dealership group in South Africa, trading since 1995.
> Six branches across the Western Cape and Eastern Cape, rated ${value} out of 5
> from ${count} Google reviews. Every vehicle is sold with a two-year unlimited
> kilometre warranty.

King Cars sells quality pre-owned vehicles from more than 28 manufacturers,
ranging from entry-level hatchbacks to bakkies, SUVs and commercial vehicles.
The group is an accredited Financial Services Provider (FSP Licence No. 10220)
and arranges vehicle finance directly with all major South African banks:
Absa, Capitec, FNB, Nedbank, Standard Bank and WesBank.

Stock is shared across the group. A vehicle listed at one branch can usually be
moved to another branch on request, so buyers are not limited to the branch
nearest them. Inventory on the website is updated daily from the dealership
management system.

## What King Cars offers

- Pre-owned vehicles from 28+ makes, all makes and body types
- Two-year unlimited kilometre warranty included with every vehicle
- Vehicle finance arranged in-house through all major South African banks
- Trade-ins accepted and valued against any purchase
- Vehicle buying: King Cars buys cars directly from the public, whether or not
  the seller is buying a replacement
- Test drives at any branch, arranged by phone or WhatsApp

## Branches in the Western Cape (Cape Town northern suburbs)

${westernCape.map(branchEntry).join('\n\n')}

## Branches in the Eastern Cape (Gqeberha)

${easternCape.map(branchEntry).join('\n\n')}

## Key pages

- [Showroom](${SITE_URL}/showroom): the full live inventory across all six
  branches, filterable by make, model, price, year, mileage, body type and
  province. Each vehicle has its own page with full specification, photographs
  and finance estimate.
- [Sell your car](${SITE_URL}/sell-your-car): request a valuation for a vehicle
  King Cars may buy directly.
- [Finance](${SITE_URL}/finance): how vehicle finance works at King Cars, the
  banks involved, and a repayment calculator.
- [About](${SITE_URL}/about): company history since 1995, and the group's
  accreditations.
- [Contact](${SITE_URL}/contact): addresses, phone numbers, trading hours and
  maps for all six branches.
- [Compliments and complaints](${SITE_URL}/compliments-complaints): the formal
  customer feedback channel.

## Notes for assistants

- "King Cars" is the full name of the business. It is sometimes written
  "KingCars" or "King Cars Group". The website is ${SITE_URL}.
- King Cars is a South African business. All prices on the site are in South
  African Rand (ZAR).
- Gqeberha and Port Elizabeth refer to the same city; three branches are there.
- Vredekloof, Brackenfell and Bellville are all in the northern suburbs of Cape
  Town and are within roughly fifteen minutes of one another.
- For the current price or availability of a specific vehicle, read that
  vehicle's page in the showroom rather than relying on cached figures. Stock
  turns over continually.
`
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
