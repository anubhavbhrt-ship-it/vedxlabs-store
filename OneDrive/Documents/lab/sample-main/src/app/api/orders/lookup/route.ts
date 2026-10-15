import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Order Number (ORD-XXXX) or Email address." },
        { status: 400 }
      );
    }

    const clean = query.trim().toLowerCase();
    const orders = await getAllOrders();

    const matches = orders.filter((o) => {
      const matchId = o.id.toLowerCase() === clean;
      const matchEmail = o.customerEmail.toLowerCase() === clean;
      return matchId || matchEmail;
    });

    return NextResponse.json({ success: true, data: matches });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
