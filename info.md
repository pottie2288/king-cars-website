King Cars Website — internal reference

Runtime:
  Node.js 20+, Next.js 15 (App Router), React 19, TypeScript 5.9
  Tailwind CSS 3.4 + shadcn/ui theme

Entry points:
  src/app/layout.tsx   Root layout, metadata, JSON-LD AutoDealer schema
  src/app/page.tsx     Homepage (content inlined, no metadata)
  src/app/globals.css  Global styles

Routes (src/app):
  /                         Home (app/page.tsx)
  /showroom                 Inventory listing with filters
  /showroom/[id]            Vehicle details (content inlined)
  /finance                  Finance calculator + application form
  /sell-your-car            Sell-your-car lead form
  /favourites               Shortlisted vehicles
  /about                    About + branches + banks
  /compliments-complaints   Feedback form
  /api/inventory            VMG proxy (5-min revalidate)

Page content:
  Routes with metadata keep their client component colocated next to
  page.tsx, e.g. src/app/about/AboutPage.tsx alongside app/about/page.tsx.
  Routes without metadata (home, car details) inline the client UI
  directly into page.tsx as a single file.

Shared components (src/components):
  Header, Footer, CarCard, SearchBar, BodyTypeFilter, BranchSection,
  FinanceCalculator, FinanceApplicationForm, StickyContactBar,
  ScrollToTop, AnimatedSection
  ui/  shadcn/ui primitives (button, card, dialog, form, input, ...)

Static content (src/data):
  branches.ts     6 King Cars branches with addresses, phones, hours
  banks.ts        BANKS (lenders shown on Finance page) +
                  PERSONAL_BANKS (customer's-own-bank dropdown in the
                  application form)
  body-types.ts   6 body-type cards on the home page

State & data:
  src/context/FavouritesContext.tsx  Client-side favourites
  src/hooks/useInventory.ts          Fetches /api/inventory, normalises VMG records
  src/hooks/useScrollAnimation.ts    Scroll-triggered reveals
  src/hooks/use-mobile.ts            Mobile breakpoint hook
  src/lib/utils.ts                   cn() helper
  src/types/index.ts                 Car, VmgVehicle, FilterState, ...

Public assets:
  public/king-cars-logo.png          Logo + favicon
  public/hero-showroom.png           Hero image
  public/about-showroom.png          About image
  public/body-types/                 sedan, hatchback, suv, minivan,
                                     singlecab, doublecab
  public/banks/                      absa, capitec, fnb, nedbank,
                                     standardbank, wesbank
  public/cars/                       Fallback car images
  public/inventory.json              Legacy/static inventory (unused at runtime)
  public/sitemap.xml, robots.txt

Config:
  next.config.ts        images.unoptimized, eslint.ignoreDuringBuilds
  tailwind.config.js    shadcn theme
  postcss.config.js, eslint.config.js, tsconfig.json, components.json

Scripts:
  npm run dev    next dev
  npm run build  next build
  npm start      next start
  npm run lint   eslint .
