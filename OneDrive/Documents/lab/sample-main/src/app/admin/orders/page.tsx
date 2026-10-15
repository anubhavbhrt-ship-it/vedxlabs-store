import React from "react";
import { ShoppingCart, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const totalPaid = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingVerification = orders.filter(
    (o) => o.status === "PENDING_PAYMENT_VERIFICATION"
  ).length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B0B0E] tracking-tight">
            Orders &amp; Manual Verification
          </h1>
          <p className="text-sm text-[#707082]">
            Review payment UTR receipts, view uploaded screenshots, and approve access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingVerification > 0 && (
            <div className="px-3 py-1.5 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] text-xs font-bold text-[#92400E] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {pendingVerification} Needs Approval
            </div>
          )}
          <div className="px-3.5 py-2 bg-white rounded-xl border border-[#E5E5EB] text-xs font-semibold text-[#0B0B0E]">
            Volume: <span className="text-[#15803D] font-mono font-bold">{formatPrice(totalPaid)}</span>
          </div>
        </div>
      </div>

      {/* ── Orders Table Card ── */}
      <Card variant="default" padding="none" className="overflow-hidden bg-white border border-[#E5E5EB]">
        <div className="p-4 border-b border-[#F2F2F5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#0B0B0E]" />
            <span className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
              Recorded Orders ({orders.length})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#707082]">
            <span className="font-bold text-[#0B0B0E]">{orders.length} Total</span>
            <span>•</span>
            <span className="text-[#15803D] font-semibold">Live System Sync</span>
          </div>
        </div>

        <AdminOrdersTable initialOrders={orders} />
      </Card>
    </div>
  );
}
