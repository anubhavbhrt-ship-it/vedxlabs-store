import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, verifyAndApproveOrder } from "@/lib/orders";
import { buildDeliveryPackage, dispatchDeliveryEmail } from "@/lib/delivery";
import { isServerAdminAuthenticated } from "@/lib/auth";
import type { OrderStatus } from "@/types/order";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isServerAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    let updated;
    let deliveryPackage = null;
    if (status === "PAID") {
      updated = await verifyAndApproveOrder(id);
      if (updated) {
        // Trigger delivery package generation & modular email dispatch
        deliveryPackage = await buildDeliveryPackage(updated);
        await dispatchDeliveryEmail(updated, deliveryPackage);
      }
    } else if (status) {
      updated = await updateOrderStatus(id, status as OrderStatus);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      delivery: deliveryPackage,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
