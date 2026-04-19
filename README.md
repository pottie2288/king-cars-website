# King Cars Website

Marketing and inventory website for **King Cars** — a pre-owned car dealership with branches in Bellville, Brackenfell, and Port Elizabeth (South Africa).

Live site: [king-cars-website.vercel.app](https://king-cars-website.vercel.app)
Production domain: [www.kingcars.co.za](https://www.kingcars.co.za)

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) on React 19
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 3.4 + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives + CVA)
- **Animation:** framer-motion
- **Icons:** lucide-react
- **Forms:** react-hook-form + zod
- **Charts:** recharts (finance calculator)
- **Hosting:** Vercel

## Features

- **Live inventory** pulled from the VMG Software API and proxied through a Next.js route handler, with 5-minute server-side caching.
- **Showroom** with search, body-type filter, make/model/price/year/mileage/location filters, and persistent filter state across navigation.
- **Vehicle details** page with image gallery, spec sheet, and quick enquiry.
- **Finance calculator** and multi-step finance application form.
- **Favourites** — client-side shortlisting via React context.
- **Sell your car** lead form.
- **Compliments & complaints** form.
- **About** page with branch info (Bellville, Brackenfell, Port Elizabeth) and bank partners (Absa, Capitec, FNB, Nedbank, Standard Bank, WesBank).
- **SEO:** metadata, JSON-LD `AutoDealer` schema, OpenGraph, sitemap, and robots.
- **Mobile:** animated mobile menu and sticky contact bar.

## Project Structure

```
src/
  app/                    Next.js App Router routes
    api/inventory/        VMG proxy route (GET /api/inventory)
    about/
    compliments-complaints/
    favourites/
    finance/
    sell-your-car/
    showroom/
    layout.tsx            Root layout, metadata, JSON-LD
    page.tsx              Homepage
  views/                  Page-level view components
  components/             Shared UI (Header, Footer, CarCard, SearchBar, ...)
    ui/                   shadcn/ui primitives
  context/                React context providers (FavouritesContext)
  hooks/                  useInventory, useScrollAnimation, use-mobile
  lib/                    utils (cn, etc.)
  types/                  Shared TypeScript types (Car, VmgVehicle, FilterState)
public/                   Static assets (logo, hero images, body-types, banks, cars)
```

## Getting Started

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Inventory Data

Live stock comes from the VMG Software API. The browser calls our own proxy at `/api/inventory` ([src/app/api/inventory/route.ts](src/app/api/inventory/route.ts)), which fetches from VMG server-side and caches for 5 minutes. The client hook [useInventory](src/hooks/useInventory.ts) normalises VMG records into the internal `Car` shape (fuel/transmission code mapping, image URL collection, body-type normalisation) and marks the 6 most recently updated vehicles as featured.

No environment variables are required — the VMG endpoint and company IDs are baked into the proxy route.

## Deployment

The site deploys to Vercel on push to `main`. `next.config.ts` disables image optimisation (plain `<img>` tags) and skips ESLint during build.

## License

Private — all rights reserved.
