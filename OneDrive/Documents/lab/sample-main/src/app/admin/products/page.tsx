import React from "react";
import { getAllProducts } from "@/lib/products";
import { AdminProductsList } from "@/components/admin/AdminProductsList";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return <AdminProductsList initialProducts={products} />;
}
