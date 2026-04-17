import { NextResponse } from "next/server";

const VMG_API_URL =
  "https://vmgplay.co.za/api/v3/view_stock_complete_with_data?company_id=in.(133,209,153,154)";

export async function GET() {
  try {
    const response = await fetch(VMG_API_URL, {
      next: { revalidate: 300 }, // Cache for 5 minutes server-side
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch inventory from VMG" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error fetching inventory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
