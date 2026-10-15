"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

export default function OrderLookupPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Lookup failed");
      }

      setResults(data.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to look up orders";
      setError(msg);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-12 sm:py-20">
      <div className="container-padded max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="yellow" size="xs" className="mb-1">
            Student Access Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B0B0E] tracking-tight">
            Track Order &amp; Access Guides
          </h1>
          <p className="text-sm text-[#707082] max-w-md mx-auto font-normal">
            Already enrolled? Enter your Order Reference (ORD-XXXX) or Email address to download your guides.
          </p>
        </div>

        {/* Search Card */}
        <Card variant="elevated" padding="lg" className="bg-white border border-[#E5E5EB]">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label
                htmlFor="lookup-input"
                className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5"
              >
                Order ID or Email Address
              </label>
              <div className="flex gap-2">
                <input
                  id="lookup-input"
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. ORD-1452 or your@email.com"
                  className="flex-1 rounded-xl border border-[#E5E5EB] bg-white text-sm text-[#0B0B0E] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  icon={<Search className="w-4 h-4" />}
                >
                  Find Orders
                </Button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </form>
        </Card>

        {/* Results List */}
        {searched && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#707082] uppercase tracking-wider">
              Search Results ({results.length})
            </h2>

            {results.length === 0 ? (
              <Card variant="bordered" padding="lg" className="bg-white text-center py-10">
                <ShoppingBag className="w-8 h-8 text-[#A2A2B0] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0B0B0E]">No orders found</p>
                <p className="text-xs text-[#707082] mt-1">
                  We couldn&apos;t find any orders matching &ldquo;{query}&rdquo;. Please verify your email or order number.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {results.map((o) => {
                  const isPaid = o.status === "PAID";
                  const isPending = o.status === "PENDING_PAYMENT_VERIFICATION";

                  return (
                    <Card
                      key={o.id}
                      variant="bordered"
                      padding="md"
                      className="bg-white hover:border-[#F59E0B]/60 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-xs text-[#0B0B0E]">
                              {o.id}
                            </span>
                            <Badge
                              variant={
                                isPaid
                                  ? "green"
                                  : isPending
                                  ? "yellow"
                                  : "gray"
                              }
                              size="xs"
                            >
                              {isPaid
                                ? "Verified"
                                : isPending
                                ? "Reviewing Payment"
                                : o.status}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-sm text-[#0B0B0E]">
                            {o.productTitle}
                          </h3>
                          <p className="text-[11px] text-[#707082]">
                            Amount: {formatPrice(o.amount)} • {o.customerEmail}
                          </p>
                        </div>

                        <Link href={`/orders/${o.id}`}>
                          <Button
                            variant={isPaid ? "primary" : "outline"}
                            size="sm"
                            icon={<ArrowRight className="w-3.5 h-3.5" />}
                            iconPosition="right"
                          >
                            {isPaid ? "Access Downloads" : "View Status"}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
