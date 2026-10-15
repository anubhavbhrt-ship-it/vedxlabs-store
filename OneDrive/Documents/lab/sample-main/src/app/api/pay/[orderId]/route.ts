import { NextResponse } from "next/server";
import { getOrderById, submitPaymentProof } from "@/lib/orders";
import { getPlatformSettings } from "@/lib/settings";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const settings = await getPlatformSettings();
    const config = settings.manualPayment || {
      enabled: true,
      paymentIdentifier: "anubhav@upi",
      payeeName: "Anubhav Bharti",
      qrImageUrl: "/images/payment-qr.svg",
      instructions:
        "1. Scan the QR code or pay to the UPI ID.\n2. Enter the transaction reference below.\n3. Upload screenshot and submit.",
      supportEmail: "contact@anubhavbharti.dev",
    };

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        productId: order.productId,
        productSlug: order.productSlug,
        productTitle: order.productTitle,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        amount: order.amount,
        status: order.status,
        paymentReference: order.paymentReference,
        paymentProofUrl: order.paymentProofUrl,
        createdAt: order.createdAt,
      },
      paymentConfig: {
        paymentIdentifier: config.paymentIdentifier || "anubhav@upi",
        payeeName: config.payeeName || "Anubhav Bharti",
        qrImageUrl: config.qrImageUrl || "/images/payment-qr.svg",
        instructions: config.instructions,
        supportEmail: config.supportEmail || "contact@anubhavbharti.dev",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch order instructions";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { paymentReference, paymentProofUrl } = body;

    if (!paymentReference || typeof paymentReference !== "string" || paymentReference.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Payment Reference or UTR / Transaction ID (at least 4 characters)." },
        { status: 400 }
      );
    }

    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const updated = await submitPaymentProof(
      orderId,
      paymentReference.trim(),
      paymentProofUrl || undefined
    );

    return NextResponse.json({
      success: true,
      message:
        "Payment submitted successfully. We'll verify your payment and send your product to the email provided.",
      order: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record payment proof";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
