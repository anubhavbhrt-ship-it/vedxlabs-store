"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  X,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

interface AdminOrdersTableProps {
  initialOrders: Order[];
}

export function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [viewScreenshotUrl, setViewScreenshotUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        const label =
          newStatus === "PAID"
            ? "Payment verified & marked as PAID"
            : newStatus === "DELIVERED"
            ? "Order marked as DELIVERED to customer"
            : "Order REJECTED / CANCELLED";
        setFeedback(`Order ${orderId}: ${label}.`);
        setTimeout(() => setFeedback(null), 3500);
      } else {
        alert("Failed to update order status.");
      }
    } catch {
      alert("Network error updating order.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.productTitle.toLowerCase().includes(q) ||
      (o.paymentReference && o.paymentReference.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Screenshot Modal Viewer */}
      {viewScreenshotUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewScreenshotUrl(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E5E5EB] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
                Payment Proof Screenshot
              </span>
              <button
                type="button"
                onClick={() => setViewScreenshotUrl(null)}
                className="p-1 rounded-lg hover:bg-[#F2F2F5] text-[#707082] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-auto flex items-center justify-center bg-[#FAFAFC]">
              <Image
                src={viewScreenshotUrl}
                alt="Payment proof screenshot"
                width={500}
                height={700}
                className="max-h-[70vh] w-auto object-contain rounded-lg border border-[#E5E5EB]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Live Feedback Toast */}
      {feedback && (
        <div className="p-3.5 mb-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#15803D] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Search Header */}
      <div className="p-4 border-b border-[#F2F2F5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#707082] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, name, email, or UTR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#E5E5EB] bg-[#FAFAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-[#0B0B0E]"
          />
        </div>

        <span className="text-xs text-[#707082]">
          Showing <strong>{filteredOrders.length}</strong> of {orders.length} orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAFC] text-[11px] font-bold text-[#707082] uppercase tracking-wider border-b border-[#E5E5EB]">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Ref / Proof</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F2F5]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-xs text-[#707082]">
                  No orders matching &ldquo;{searchTerm}&rdquo;
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const isLoading = actionLoadingId === o.id;

                return (
                  <tr key={o.id} className="hover:bg-[#FAFAFC] transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#0B0B0E]">
                      {o.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-xs text-[#0B0B0E]">
                        {o.customerName || "Customer"}
                      </p>
                      <p className="text-[11px] text-[#707082]">{o.customerEmail}</p>
                      {o.customerPhone && (
                        <p className="text-[10px] text-[#A2A2B0] font-mono">{o.customerPhone}</p>
                      )}
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4 text-xs font-medium text-[#4C4C5B]">
                      {o.productTitle}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#0B0B0E]">
                      {formatPrice(o.amount)}
                    </td>

                    {/* Reference / Screenshot */}
                    <td className="py-3.5 px-4">
                      {o.paymentReference ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-bold text-[#0B0B0E] block">
                            {o.paymentReference}
                          </span>
                          {o.paymentProofUrl && (
                            <button
                              type="button"
                              onClick={() => setViewScreenshotUrl(o.paymentProofUrl!)}
                              className="inline-flex items-center gap-1 text-[11px] text-[#1D4ED8] hover:underline font-semibold"
                            >
                              <Eye className="w-3 h-3" /> View Screenshot
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#A2A2B0]">None submitted</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          o.status === "DELIVERED"
                            ? "green"
                            : o.status === "PAID"
                            ? "green"
                            : o.status === "PENDING_PAYMENT_VERIFICATION"
                            ? "yellow"
                            : o.status === "REJECTED"
                            ? "burgundy"
                            : "gray"
                        }
                        size="xs"
                      >
                        {o.status === "PENDING_PAYMENT_VERIFICATION"
                          ? "VERIFICATION NEEDED"
                          : o.status}
                      </Badge>
                    </td>

                    {/* Manual Management Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* 1. Mark as Paid (Verify) */}
                        {o.status !== "PAID" && o.status !== "DELIVERED" && (
                          <Button
                            size="sm"
                            variant="primary"
                            loading={isLoading}
                            onClick={() => handleUpdateStatus(o.id, "PAID")}
                          >
                            Mark Paid
                          </Button>
                        )}

                        {/* 2. Mark as Delivered */}
                        {o.status === "PAID" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={isLoading}
                            onClick={() => handleUpdateStatus(o.id, "DELIVERED")}
                            icon={<Send className="w-3 h-3 text-[#F59E0B]" />}
                          >
                            Mark Delivered
                          </Button>
                        )}

                        {/* 3. Link to Customer Access Page */}
                        {(o.status === "PAID" || o.status === "DELIVERED") && (
                          <Link
                            href={`/order/confirmed/${o.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-1 rounded-lg border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors"
                            title="Open customer confirmed delivery page"
                          >
                            <ExternalLink className="w-3 h-3" /> Access
                          </Link>
                        )}

                        {/* 4. Reject Order */}
                        {o.status !== "REJECTED" && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                              if (confirm(`Reject order ${o.id}?`)) {
                                handleUpdateStatus(o.id, "REJECTED");
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#707082] hover:text-[#7F1D1D] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                            title="Reject / Cancel Order"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
