import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAllProducts } from "@/lib/products";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingApprovals = orders.filter((o) => o.status === "PENDING_PAYMENT_VERIFICATION").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PENDING_PAYMENT_VERIFICATION").length;
  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const publishedProducts = products.filter((p) => p.isPublished).length;
  const recentOrders = orders.slice(0, 5);

  const STATS = [
    {
      label: "Total Products",
      value: `${products.length}`,
      change: `${publishedProducts} active on storefront`,
      icon: Package,
      color: "text-[#B45309]",
    },
    {
      label: "Published Products",
      value: `${publishedProducts}`,
      change: `${products.length - publishedProducts} draft / unpublished`,
      icon: Package,
      color: "text-[#15803D]",
    },
    {
      label: "Total Orders",
      value: `${orders.length}`,
      change: "Lifetime order volume",
      icon: ShoppingCart,
      color: "text-[#1D4ED8]",
    },
    {
      label: "Pending Orders",
      value: `${pendingOrders}`,
      change: `${pendingApprovals} awaiting manual verification`,
      icon: ShoppingCart,
      color: "text-[#D97706]",
    },
    {
      label: "Paid Orders",
      value: `${paidOrders}`,
      change: "Verified & fulfilled",
      icon: TrendingUp,
      color: "text-[#15803D]",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: "100% verified earnings",
      icon: TrendingUp,
      color: "text-[#0B0B0E]",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-xl font-black text-[#0B0B0E]">Overview</h1>
          <p className="text-sm text-[#707082]">Welcome back, Anubhav · Creator Control Center</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/settings?tab=website">
            <Button variant="outline" size="sm">
              Website Customization
            </Button>
          </Link>
          <Link href="/admin/settings?tab=payment">
            <Button variant="outline" size="sm">
              Payment Settings
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} iconPosition="left">
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {pendingApprovals > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#92400E]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse shrink-0" />
            <p className="text-sm font-semibold">
              You have <span className="font-bold underline">{pendingApprovals} order{pendingApprovals > 1 ? "s" : ""}</span> awaiting manual payment verification (UTR / screenshot submitted).
            </p>
          </div>
          <Link href="/admin/orders">
            <Button variant="secondary" size="sm" className="whitespace-nowrap">
              Review &amp; Approve Orders
            </Button>
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-8">
        {STATS.map(({ label, value, change, icon: Icon, color }) => (
          <Card key={label} variant="default" padding="md">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-[#707082]">{label}</p>
              <div className={`w-8 h-8 rounded-lg bg-[#FAFAFC] border border-[#E5E5EB] flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#0B0B0E] mb-1">{value}</p>
            <p className="text-xs text-[#707082]">{change}</p>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#0B0B0E]">Recent Transactions &amp; Enrollments</h2>
          <Link href="/admin/orders" className="text-xs text-[#707082] hover:text-[#0B0B0E] flex items-center gap-1 transition-colors">
            View all orders <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F2F2F5]">
                {["Order ID", "Product", "Customer", "Amount", "Status", "Date"].map((col) => (
                  <th key={col} className="text-left pb-3 text-xs font-bold text-[#707082] uppercase tracking-wider pr-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F5]">
              {recentOrders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <tr key={order.id} className="hover:bg-[#FAFAFC] transition-colors">
                    <td className="py-3 pr-4 font-mono font-bold text-xs text-[#0B0B0E]">{order.id}</td>
                    <td className="py-3 pr-4 font-medium text-[#0B0B0E] whitespace-nowrap">{order.productTitle}</td>
                    <td className="py-3 pr-4 text-xs text-[#707082]">{order.customerEmail}</td>
                    <td className="py-3 pr-4 font-bold font-mono text-[#0B0B0E]">{formatPrice(order.amount)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={order.status === "PAID" ? "green" : "yellow"} size="xs">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#707082]">{dateStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
