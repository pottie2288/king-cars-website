# King Cars SEO Fix Plan — Phase 1 (Critical)

Generated from full SEO audit, 2026-07-18. Scope: **critical, high-confidence, low-effort fixes only.** Growth items (category landing pages, content expansion, backlink work) are logged at the bottom as a deferred backlog — not in scope for this pass.

Audit data source: Google Search Console (`sc-domain:kingcars.co.za`), 90-day window, cross-referenced against live site source at `king-cars-website-main`.

---

## Context for whoever implements this

King Cars is a 6-branch used-car dealership in South Africa (Bellville, Brackenfell, Vredekloof in the Western Cape; Sydenham, Walmer/17th Avenue, Newton Park in the Eastern Cape/Gqeberha). Next.js 15 App Router site. The site's technical SEO foundation is actually solid — proper canonical tags, working www-redirect, full AutoDealer + Product/Car JSON-LD schema with all 6 branch addresses, a working sitemap with 208 URLs including all live vehicle listings. The issues below are specific, scoped bugs on top of that solid foundation, not a rebuild.

---

## Fix 1 — Duplicate "King Cars | King Cars" in page titles (CRITICAL)

**Root cause**: `src/app/layout.tsx:14` sets a Next.js metadata title template:
```ts
template: '%s | King Cars',
```
This automatically appends `| King Cars` to every nested page's title. Several pages *also* manually append `| King Cars` (or embed "King Cars" mid-string) in their own `title`, producing a doubled/redundant brand mention in every SERP result and browser tab for these pages. Confirmed live on `/showroom` and every `/showroom/[id]` vehicle page (all ~200 of them, via sitemap) — e.g. rendered title is currently:
> `2022 HYUNDAI ATOS — R 159 990 | King Cars | King Cars`

**Files to fix** (remove the manual `| King Cars` suffix / embedded brand mention — the root layout template adds it automatically):

| File | Line | Current | Change to |
|---|---|---|---|
| `src/app/showroom/page.tsx` | 9 | `'Used Cars for Sale in Cape Town & Gqeberha \| King Cars'` | `'Used Cars for Sale in Cape Town & Gqeberha'` |
| `src/app/showroom/[id]/page.tsx` | 43 | `` `${v.year} ${v.make} ${v.series} — ${price} \| King Cars` `` | `` `${v.year} ${v.make} ${v.series} — ${price}` `` |
| `src/app/showroom/[id]/page.tsx` | 30 | `'Vehicle Not Found — King Cars'` | `'Vehicle Not Found'` |
| `src/app/finance/page.tsx` | 5 | `'Car Finance in Cape Town & Gqeberha \| King Cars'` | `'Car Finance in Cape Town & Gqeberha'` |
| `src/app/popi-policy/page.tsx` | 5 | `'POPI Policy \| King Cars'` | `'POPI Policy'` |
| `src/app/contact/page.tsx` | 5 | `'Contact Us \| King Cars Branches in Cape Town & Gqeberha'` | `'Contact Us — Branches in Cape Town & Gqeberha'` |
| `src/app/compliments-complaints/page.tsx` | 5 | `'Share Your Feedback \| King Cars Compliments & Complaints'` | `'Compliments & Complaints'` |
| `src/app/about/page.tsx` | 5 | `'About King Cars \| 30+ Years Selling Quality Pre-Owned Cars'` | `'About Us — 30+ Years Selling Quality Pre-Owned Cars'` |

**Do NOT touch** (already correct, template produces the right single-brand result):
- `src/app/page.tsx` (homepage — same segment as the layout defining the template, template doesn't apply here, verified live)
- `src/app/favourites/page.tsx`
- `src/app/sell-your-car/page.tsx`

**Verification after fix**: fetch each changed URL and confirm `<title>` shows "King Cars" exactly once. e.g. `curl -s https://www.kingcars.co.za/showroom | grep -oE '<title>[^<]*</title>'` should return `Used Cars for Sale in Cape Town & Gqeberha | King Cars` (single instance).

**Impact**: affects every page in the 208-URL sitemap except the homepage — this is the single highest-leverage fix in this plan by page count.

---

## Fix 2 — Branch-specific redirects lose location context (CRITICAL)

**Root cause**: `next.config.ts:31` redirects all old per-branch showroom URLs to a generic, unfiltered showroom:
```ts
{ source: '/showroom-:branch', destination: '/showroom', permanent: true },
```
This sends anyone (and any residual search-engine crawl signal) landing on e.g. `/showroom-bellville` to the same generic `/showroom` as everyone else — losing the branch-specific intent entirely, even though `/showroom` **already supports exactly this** via a `location` query parameter (confirmed in `src/app/showroom/ShowroomPage.tsx:135`, `searchParams.get('location')`).

**Fix**: change the redirect to pass the branch through as a location filter instead of dropping it:
```ts
{ source: '/showroom-:branch', destination: '/showroom?location=:branch', permanent: true },
```

**Before implementing, verify branch value format**: check what string values `car.location` actually holds in the live VMG-fed data (`src/hooks/useInventory.ts:84`) — likely branch names like `"Bellville"`, `"Brackenfell"`, etc. The `:branch` param from the URL (e.g. `bellville` from `/showroom-bellville`) needs to match that format — may need a small mapping object (`{ bellville: 'Bellville', newton: 'Newton Park', ... }`) rather than a raw pass-through if casing/naming don't line up exactly. Test with a real filtered URL (`/showroom?location=Bellville`) to confirm it actually filters before wiring the redirect.

**Impact**: preserves branch-specific relevance for `/showroom-bellville`, `/showroom-newton`, and any other legacy per-branch URL still receiving search traffic (confirmed real clicks still landing on `/showroom-bellville` and `/showroom-newton` in the last 90 days per GSC).

---

## Verification checklist (run after both fixes, before considering this phase done)

- [ ] `/showroom` title renders with "King Cars" exactly once
- [ ] `/showroom/[any-id]` title renders with "King Cars" exactly once
- [ ] `/finance`, `/popi-policy`, `/contact`, `/compliments-complaints`, `/about` titles render with "King Cars" exactly once
- [ ] `/showroom-bellville` redirects to `/showroom?location=Bellville` (or correct value) and the showroom page actually shows Bellville-filtered results, not the full unfiltered list
- [ ] Homepage title unchanged (still single "King Cars" mention, no regression)
- [ ] `npm run build` passes with no new TypeScript/lint errors

---

## Deferred backlog (NOT in scope for this pass — logged for later)

These are real, valuable findings from the audit but are content/strategy work, not quick code fixes. Revisit once Phase 1 is verified live and re-crawled by Google:

1. **Zero generic search terms rank in top 10** — all organic top-10 queries are branded ("king cars ..."). Real demand exists (per both this audit and the earlier Google Ads audit) for "cars for sale cape town," "used cars cape town," "bakkies," "VW Amarok," "repossessed cars," "rent to own" — none of these currently rank well organically despite the site being topically relevant. Closing this gap needs sustained content work (dedicated category/body-type landing pages, possibly a lightweight buying-guide content section), not a one-off fix.

2. **"cars for sale cape town" (1,321 impressions/90d) is split across 3 pages** — homepage, `/showroom`, and legacy URL variants all rank for it simultaneously (position ~9–15 each), diluting the signal. Recommend consolidating intent onto `/showroom` specifically (it's the most topically correct page) via title/H1 tightening and internal linking, once Phase 1 is live.

3. **Old `/news/*` articles (some still pulling 800–900+ impressions/90d) redirect to the bare homepage** — soft-404-like pattern. No direct equivalent exists since the new site has no blog/news section. Options: leave as-is (acceptable, not urgent), or revive a lightweight content section to recapture this demonstrated demand. Bigger effort — defer.

4. **Domain/URL fragmentation in Search Console** — branded queries currently split across `http://www.`, `https://www.`, and `https://` (non-www) variants in GSC's index, even though the live redirect (`kingcars.co.za` → `www.kingcars.co.za`, confirmed working, HTTP 308) is already correctly configured in code. This should self-resolve as Google recrawls and consolidates now that the redirect exists — no code change needed, just time. Worth checking again in 4–6 weeks.

5. **Individual vehicle pages (`/showroom/[id]`) have good schema but negligible organic visibility** — expected/acceptable given inventory turnover (a specific used car's listing naturally has a short shelf life for SEO purposes). The better long-term investment is persistent make/body-type category pages (e.g. "Bakkies for Sale in Cape Town," "VW Amarok for Sale") that don't churn with inventory — logged as a future content initiative, not urgent.
