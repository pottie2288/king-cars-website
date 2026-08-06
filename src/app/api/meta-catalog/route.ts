import { NextResponse } from "next/server";
import type { VmgVehicle } from "@/types";

/**
 * Meta Commerce catalogue feed (CSV).
 *
 * Point a Commerce Manager data feed at this URL on a daily schedule. Meta then
 * sources every carousel/dynamic ad's image, title, price and link from here, so
 * new stock enters ads and sold stock leaves them without anyone rebuilding a
 * creative.
 *
 * Why this exists rather than reusing the existing catalogues: those were built
 * with `link` set to the dealer stock_code (e.g. "S5827") instead of the site's
 * stock_id, so every ad click landed on /showroom/S5827 — a 404. Both ids are in
 * the VMG payload; only stock_id routes.
 *
 * Kept deliberately separate from /api/inventory rather than sharing a fetch
 * helper: that route is owned by other in-flight work, and duplicating one URL
 * constant is cheaper than a merge conflict. Consolidate once both land.
 */
const VMG_API_URL =
  "https://vmgplay.co.za/api/v3/view_stock_complete_with_data?company_id=in.(133,209,153,154)";

const SITE_ORIGIN = "https://www.kingcars.co.za";

/**
 * Locations whose vehicles must never be advertised. VMG uses `location` as a
 * physical-whereabouts field, not a sales-status one, so it mixes saleable floor
 * stock with cars that are away being worked on or out with a customer.
 * Advertising those produces enquiries for a car nobody can show today.
 *
 * Consignment and PRIVATE SELECT stock IS advertised — those are genuinely for
 * sale, just not dealer-owned.
 */
const NON_ADVERTISABLE_LOCATIONS: readonly string[] = [
  "on loan customer",
  "on route to kc sydenham",
  "proline panelbeaters",
  "euro clinic",
];

const FUEL_LABELS: Readonly<Record<string, string>> = {
  P: "Petrol",
  D: "Diesel",
  E: "Electric",
};

const TRANSMISSION_LABELS: Readonly<Record<string, string>> = {
  A: "Automatic",
  M: "Manual",
};

/**
 * Makes and model codes that must not be title-cased. Anything containing a
 * digit is left uppercase too (NP200, CX-5, GD-6, T6, 4X4) — VMG stores every
 * title in caps, and "Np200" or "Cx-5" reads as a typo in an ad.
 */
const ALL_CAPS_TOKENS: ReadonlySet<string> = new Set([
  // Marques
  "BMW", "GWM", "MG", "VW", "BYD", "JAC", "DS", "UD",
  // Model codes — Mercedes and VW trim designations present in stock
  "GLA", "GLB", "GLC", "GLE", "GLS", "CLA", "CLS", "SLK", "SLC", "AMG",
  "GTI", "TDI", "TSI",
  // Roman numerals in model names (CLIO IV, JETTA VI)
  "II", "III", "IV", "VI", "VII",
]);

function titleCaseToken(token: string): string {
  // VMG stores titles in caps, so any lowercase letter is deliberate styling
  // (Hyundai's "i20", "i10") — trust the source rather than re-casing it.
  if (/[a-z]/.test(token)) return token;
  const upper = token.toUpperCase();
  if (ALL_CAPS_TOKENS.has(upper)) return upper;
  if (/\d/.test(token)) return upper;
  // Split on hyphens so T-CROSS becomes T-Cross, not T-cross.
  return token
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");
}

function titleCase(text: string): string {
  return text.trim().split(/\s+/).filter(Boolean).map(titleCaseToken).join(" ");
}

/** "229627" -> "229,627". Explicit rather than toLocaleString so the output
 *  never depends on the server's ICU locale data. */
function withThousands(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const FEED_COLUMNS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "additional_image_link",
  "brand",
  "product_type",
  "custom_label_0",
  "custom_label_1",
  "custom_label_2",
  "custom_label_3",
  "custom_label_4",
] as const;

/** RFC 4180: wrap every field, double any embedded quote. Descriptions and
 *  location names contain commas, quotes and stray newlines from VMG. */
function csvCell(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/\s+/g, " ").trim().replace(/"/g, '""')}"`;
}

/**
 * Turns "F/P King Cars BELLVILLE" into "Bellville" so it can drive a product
 * set. VMG's `suburb` is unusable for Western Cape rows (it holds mashed-together
 * postal codes like "7560 • 7530"), so branch has to come from `location`.
 */
function branchLabel(vehicle: VmgVehicle): string {
  const raw = (vehicle.location ?? "").toUpperCase();
  if (raw.includes("VREDEKLOOF")) return "Vredekloof";
  if (raw.includes("BRACKENFELL")) return "Brackenfell";
  if (raw.includes("BELLVILLE")) return "Bellville";
  if (raw.includes(" EC") || raw.includes("PORT ELIZABETH")) return "Gqeberha";
  return vehicle.province?.trim() || "King Cars";
}

/** Coarse bands, so a product set can say "under R250k" without a price rule. */
function priceBand(price: number): string {
  if (price < 150_000) return "Under R150k";
  if (price < 250_000) return "R150k-R250k";
  if (price < 400_000) return "R250k-R400k";
  if (price < 600_000) return "R400k-R600k";
  return "Over R600k";
}

function galleryUrls(vehicle: VmgVehicle): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const url = (vehicle as unknown as Record<string, unknown>)[`url${i}`];
    if (typeof url === "string" && url.startsWith("https://")) urls.push(url);
  }
  return urls;
}

/**
 * Card description, matching the spec line used by the hand-built bakkie
 * carousel that outperformed everything else in the account:
 *
 *   229,627 km · Full service history · Automatic · Diesel · 130 kW of power · R 560,000
 *
 * VMG leaves `description` empty on roughly half the stock and Meta rejects
 * rows without one, so this is always generated rather than passed through.
 * Every part is conditional — the reference ad omitted whichever fields were
 * missing rather than printing blanks.
 *
 * "No Service History" is omitted rather than printed: it is a negative selling
 * point, the reference ad left it out, and the full detail is on the listing
 * page one tap away.
 */
function buildDescription(vehicle: VmgVehicle): string {
  const parts: string[] = [];

  if (typeof vehicle.mileage === "number" && vehicle.mileage > 0) {
    parts.push(`${withThousands(vehicle.mileage)} km`);
  }

  const service = vehicle.service_history?.trim();
  if (service && !/^no service history$/i.test(service)) {
    parts.push(service.charAt(0).toUpperCase() + service.slice(1).toLowerCase());
  }

  const transmission = TRANSMISSION_LABELS[vehicle.transmission];
  if (transmission) parts.push(transmission);

  const fuel = FUEL_LABELS[vehicle.fuel_type];
  if (fuel) parts.push(fuel);

  if (typeof vehicle.kilowatts === "number" && vehicle.kilowatts > 0) {
    parts.push(`${vehicle.kilowatts} kW of power`);
  }

  parts.push(`R ${withThousands(vehicle.selling_price)}`);

  return parts.join(" · ");
}

function toFeedRow(vehicle: VmgVehicle): string | null {
  const images = galleryUrls(vehicle);
  // Meta rejects any row without an image_link, so drop rather than emit a
  // broken row that would fail the whole feed's validation stats.
  if (images.length === 0) return null;
  if (!vehicle.stock_id || !(vehicle.selling_price > 0)) return null;

  const branch = branchLabel(vehicle);
  // VMG stores make/series in caps ("2018 VOLKSWAGEN POLO CLASSIC"), which both
  // shouts and eats the carousel headline's ~25 visible characters. Title-cased
  // and kept to year + make + series, matching the reference bakkie carousel.
  const title = `${vehicle.year} ${titleCase(
    [vehicle.make, vehicle.series].filter(Boolean).join(" ")
  )}`.slice(0, 200);

  const cells = [
    vehicle.stock_id,
    title,
    buildDescription(vehicle),
    "in stock",
    vehicle.used === false ? "new" : "used",
    `${vehicle.selling_price.toFixed(2)} ZAR`,
    `${SITE_ORIGIN}/showroom/${vehicle.stock_id}`,
    images[0],
    images.slice(1, 11).join(","),
    vehicle.make,
    vehicle.body_type ?? "",
    vehicle.province ?? "",
    branch,
    priceBand(vehicle.selling_price),
    FUEL_LABELS[vehicle.fuel_type] ?? "",
    TRANSMISSION_LABELS[vehicle.transmission] ?? "",
  ];

  return cells.map(csvCell).join(",");
}

function isAdvertisable(vehicle: VmgVehicle): boolean {
  const location = (vehicle.location ?? "").toLowerCase().trim();
  return !NON_ADVERTISABLE_LOCATIONS.some(excluded => location.includes(excluded));
}

export async function GET() {
  try {
    const response = await fetch(VMG_API_URL, { next: { revalidate: 900 } });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch inventory from VMG" },
        { status: response.status }
      );
    }

    const vehicles: VmgVehicle[] = await response.json();
    if (!Array.isArray(vehicles)) {
      return NextResponse.json(
        { error: "Unexpected VMG payload: expected an array" },
        { status: 502 }
      );
    }

    const rows = vehicles
      .filter(isAdvertisable)
      .map(toFeedRow)
      .filter((row): row is string => row !== null);

    const csv = [FEED_COLUMNS.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'inline; filename="king-cars-meta-catalog.csv"',
        "Cache-Control": "public, max-age=900, s-maxage=900",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error building catalogue feed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
