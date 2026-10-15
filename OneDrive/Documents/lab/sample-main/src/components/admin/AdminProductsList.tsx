"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AdminProductsListProps {
  initialProducts: Product[];
}

export function AdminProductsList({ initialProducts }: AdminProductsListProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Filter products by search text and published status
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "PUBLISHED") return p.isPublished === true;
    if (statusFilter === "DRAFT") return !p.isPublished;
    return true;
  });

  // Toggle publish / unpublish
  const handleTogglePublish = async (product: Product) => {
    setLoadingActionId(product.id);
    try {
      const updatedStatus = !product.isPublished;
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isPublished: updatedStatus } : item
        )
      );
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not toggle publish status");
    } finally {
      setLoadingActionId(null);
    }
  };

  // Delete / archive product
  const handleDeleteProduct = async (product: Product) => {
    if (
      !confirm(
        `Are you sure you want to delete "${product.title}"? This will remove it from the catalog and storefront.`
      )
    ) {
      return;
    }

    setLoadingActionId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not delete product");
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B0B0E] tracking-tight">
            Products Catalog
          </h1>
          <p className="text-sm text-[#707082]">
            Create, edit, toggle visibility, and organize digital guides and toolkits.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Create Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="default" padding="sm" className="bg-white border border-[#E5E5EB]">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#707082] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, slug, or category..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5E5EB] bg-[#FAFAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-[#0B0B0E]"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(
              [
                { key: "ALL", label: `All (${products.length})` },
                {
                  key: "PUBLISHED",
                  label: `Published (${products.filter((p) => p.isPublished).length})`,
                },
                {
                  key: "DRAFT",
                  label: `Draft (${products.filter((p) => !p.isPublished).length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === tab.key
                    ? "bg-[#0B0B0E] text-white"
                    : "bg-[#FAFAFC] text-[#707082] hover:text-[#0B0B0E] border border-[#E5E5EB]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products Table Card */}
      <Card variant="default" padding="none" className="overflow-hidden bg-white border border-[#E5E5EB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAFC] text-[11px] font-bold text-[#707082] uppercase tracking-wider border-b border-[#E5E5EB]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F5]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#707082]">
                    No products match your current search and filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLoading = loadingActionId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAFAFC] transition-colors">
                      {/* Title & Slug */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0B0B0E] text-[#F59E0B] font-mono flex items-center justify-center font-black text-xs shrink-0 border border-[#252532]">
                            AI
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-[#0B0B0E]">{p.title}</p>
                              {p.isFeatured && (
                                <Badge variant="yellow" size="xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs font-mono text-[#707082]">
                              /products/{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-xs font-medium text-[#707082]">
                        {p.category || "Guide"}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-mono">
                        <span className="font-black text-[#0B0B0E]">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-[#707082] line-through ml-1.5">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Publication Status & Toggle Button */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          disabled={isLoading}
                          title="Click to toggle publish status"
                          className="group text-left cursor-pointer"
                        >
                          {p.isPublished ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707082] bg-[#F2F2F5] px-2.5 py-1 rounded-full border border-[#E5E5EB] hover:bg-[#E5E5EB] transition-colors">
                              <Clock className="w-3.5 h-3.5" /> Draft
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Public View */}
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-[#707082] hover:text-[#0B0B0E] hover:bg-[#FAFAFC] transition-colors"
                            title="View Public Storefront Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#0B0B0E] hover:bg-[#1E1E26] text-white transition-colors"
                          >
                            <Edit className="w-3 h-3 text-[#F59E0B]" /> Edit
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            disabled={isLoading}
                            className="p-2 rounded-lg text-[#707082] hover:text-[#7F1D1D] hover:bg-[#FFF1F2] transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
