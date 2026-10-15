import React from "react";
import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getProductById, getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product = await getProductById(id);

  if (!product) {
    const all = await getAllProducts();
    product = all.find((p) => p.slug === id) || null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0B0B0E] tracking-tight">
          Edit Product: {product.title}
        </h1>
        <p className="text-sm text-[#707082]">
          Update pricing, descriptions, digital assets, or store publication status.
        </p>
      </div>

      <ProductEditor initialProduct={product} isNew={false} />
    </div>
  );
}
