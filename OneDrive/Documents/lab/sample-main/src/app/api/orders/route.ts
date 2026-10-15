import { NextResponse } from "next/server";
import { getAllOrders, createOrder } from "@/lib/orders";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const isAuth = await isServerAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const orders = await getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch orders";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerEmail || !body.productId) {
      return NextResponse.json(
        { success: false, error: "customerEmail and productId are required" },
        { status: 400 }
      );
    }

    const newOrder = await createOrder(body);
    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
