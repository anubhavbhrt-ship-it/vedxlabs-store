import { NextResponse } from "next/server";
import { getAllProducts, getPublishedProducts, saveProduct } from "@/lib/products";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  if (all) {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, data: products });
  }

  const products = await getPublishedProducts();
  return NextResponse.json({ success: true, data: products });
}

export async function POST(request: Request) {
  try {
    const isAuth = await isServerAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const saved = await saveProduct({
      ...body,
      price: typeof body.price === "number" ? body.price : parseInt(body.price, 10) * 100,
      originalPrice: body.originalPrice
        ? typeof body.originalPrice === "number"
          ? body.originalPrice
          : parseInt(body.originalPrice, 10) * 100
        : undefined,
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
