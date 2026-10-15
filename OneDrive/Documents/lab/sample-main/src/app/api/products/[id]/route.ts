import { NextResponse } from "next/server";
import { getProductById, saveProduct, deleteProduct, getAllProducts } from "@/lib/products";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let product = await getProductById(id);

  if (!product) {
    const all = await getAllProducts();
    product = all.find((p) => p.slug === id) || null;
  }

  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: product });
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

    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const updated = await saveProduct({
      ...existing,
      ...body,
      id: existing.id,
      price: typeof body.price === "number" ? body.price : parseInt(body.price, 10) * 100,
      originalPrice: body.originalPrice
        ? typeof body.originalPrice === "number"
          ? body.originalPrice
          : parseInt(body.originalPrice, 10) * 100
        : undefined,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
  const deleted = await deleteProduct(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Product deleted" });
}
