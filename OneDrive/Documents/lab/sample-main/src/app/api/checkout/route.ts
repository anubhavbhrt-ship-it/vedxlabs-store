import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { createOrder } from "@/lib/orders";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, productSlug } = body;

    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    let cleanPhone = phone ? phone.toString().replace(/\D/g, "") : "";
    if (cleanPhone.length > 10 && cleanPhone.startsWith("91")) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const product = await getProductBySlug(productSlug);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const order = await createOrder({
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      customerEmail: email.trim().toLowerCase(),
      customerName: name.trim(),
      customerPhone: cleanPhone ? `+91 ${cleanPhone}` : undefined,
      amount: product.price,
      currency: "INR",
      status: "PENDING",
      paymentMethod: "Manual UPI / QR",
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      redirectUrl: `/pay/${order.id}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Checkout process error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
