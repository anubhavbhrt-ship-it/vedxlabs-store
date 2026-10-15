import React from "react";
import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getProductById, getAllProducts } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    // If not found by ID, attempt lookup by slug or fallback
    const all = await getAllProducts();
    const fallback = all.find((p) => p.slug === id);
    if (!fallback) notFound();
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Edit Product</h1>
          <p className="text-sm text-[#717171]">
            Update pricing, sales copy, or curriculum details.
          </p>
        </div>
        <ProductEditor initialProduct={fallback} isNew={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Edit Product</h1>
        <p className="text-sm text-[#717171]">
          Update pricing, sales copy, or curriculum details.
        </p>
      </div>

      <ProductEditor initialProduct={product} isNew={false} />
    </div>
  );
}
