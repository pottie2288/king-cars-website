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
 * VMG leaves `description` empty on roughly half the stock, so it is always
 * generated rather than passed through — Meta rejects rows without one, and a
 * consistent spec line reads better in an ad than an inconsistent dealer note.
 */
function buildDescription(vehicle: VmgVehicle, branch: string): string {
  const parts: string[] = [];

  if (vehicle.variant?.trim()) parts.push(vehicle.variant.trim());
  if (typeof vehicle.mileage === "number" && vehicle.mileage > 0) {
    parts.push(`${vehicle.mileage.toLocaleString("en-ZA")} km`);
  }

  const transmission = TRANSMISSION_LABELS[vehicle.transmission];
  if (transmission) parts.push(transmission);

  const fuel = FUEL_LABELS[vehicle.fuel_type];
  if (fuel) parts.push(fuel);

  // VMG stores condition inconsistently cased ("Excellent" vs "EXCELLENT");
  // normalise so ad copy never reads as shouting.
  const condition = vehicle.condition?.trim();
  if (condition) {
    const normalised =
      condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
    parts.push(`${normalised} condition`);
  }

  const spec = parts.join(" · ");
  return `${spec}. Available at King Cars ${branch}. Finance available, trade-ins welcome.`;
}

function toFeedRow(vehicle: VmgVehicle): string | null {
  const images = galleryUrls(vehicle);
  // Meta rejects any row without an image_link, so drop rather than emit a
  // broken row that would fail the whole feed's validation stats.
  if (images.length === 0) return null;
  if (!vehicle.stock_id || !(vehicle.selling_price > 0)) return null;

  const branch = branchLabel(vehicle);
  const title = [vehicle.year, vehicle.make, vehicle.series]
    .filter(Boolean)
    .join(" ")
    .slice(0, 200);

  const cells = [
    vehicle.stock_id,
    title,
    buildDescription(vehicle, branch),
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
