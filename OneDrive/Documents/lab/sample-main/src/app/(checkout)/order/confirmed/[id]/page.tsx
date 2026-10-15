import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Mail,
  ShieldCheck,
  FileText,
  ExternalLink,
  MessageCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { getOrderById } from "@/lib/orders";
import { getPlatformSettings } from "@/lib/settings";
import { buildDeliveryPackage } from "@/lib/delivery";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Order Confirmed — Download Your Digital Guide",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrderById(id),
    getPlatformSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const brand = settings.brand;
  const delivery = await buildDeliveryPackage(order);

  const isFulfilled = order.status === "PAID" || order.status === "DELIVERED";

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-10 sm:py-16 selection:bg-[#F59E0B] selection:text-[#0B0B0E]">
      <div className="container-padded max-w-2xl mx-auto space-y-8">
        {/* Status Hero Card */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-8 h-8 text-[#15803D]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold border border-[#FDE68A]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            Verified &amp; Fulfilled
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#0B0B0E] tracking-tight">
            Your order is confirmed.
          </h1>

          <p className="text-sm text-[#707082] max-w-md mx-auto">
            Order Reference: <strong className="font-mono text-[#0B0B0E]">{order.id}</strong> · Delivered to{" "}
            <strong className="text-[#0B0B0E]">{order.customerEmail}</strong>
          </p>
        </div>

        {/* Product Delivery Card */}
        <Card variant="bordered" padding="lg" className="bg-white border-[#E5E5EB] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F2F2F5]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0B0B0E] text-[#F59E0B] flex items-center justify-center font-black text-sm shrink-0 border border-[#252532]">
                AI
              </div>
              <div>
                <p className="text-xs font-semibold text-[#707082] uppercase tracking-wider">
                  Purchased Guide
                </p>
                <h2 className="text-lg font-black text-[#0B0B0E]">
                  {order.productTitle}
                </h2>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-[#707082] block">Amount Paid</span>
              <span className="text-lg font-black text-[#0B0B0E] font-mono">
                {formatPrice(order.amount)}
              </span>
            </div>
          </div>

          {/* Download Action Area */}
          <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EB] space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-sm font-bold text-[#0B0B0E]">
                    Digital Edition &amp; Handbook
                  </span>
                </div>
                <p className="text-xs text-[#707082] leading-relaxed">
                  Cryptographically verified single-user edition. Ready for immediate download.
                </p>
              </div>

              <Badge variant="green" size="xs">
                Ready
              </Badge>
            </div>

            {isFulfilled ? (
              <a
                href={delivery.downloadUrl}
                download
                className="block"
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Download className="w-4 h-4" />}
                  iconPosition="left"
                  className="py-3.5 text-sm font-black shadow-sm"
                >
                  Download your guide
                </Button>
              </a>
            ) : (
              <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E]">
                Payment verification pending. As soon as the admin verifies your transaction, this download will activate immediately.
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#707082] pt-1">
              <span>File format: {delivery.filename}</span>
              <span>Downloads recorded: {order.downloadCount || 0}</span>
            </div>
          </div>

          {/* Interactive Notion Hub (Complementary Access) */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#15803D]" />
                <span className="text-xs font-bold text-[#0B0B0E]">
                  Interactive 28-Day Notion Hub
                </span>
              </div>
              <p className="text-[11px] text-[#707082]">
                Duplicate prompt vaults, checklists, and day-by-day exercises to your Notion.
              </p>
            </div>

            <a
              href={`https://notion.so/vedxlabs/${order.productSlug}-hub`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button
                variant="outline"
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Open Notion
              </Button>
            </a>
          </div>

          {/* Security & Email Notice */}
          <div className="pt-2 border-t border-[#F2F2F5] space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-[#707082]">
              <Mail className="w-4 h-4 text-[#707082] shrink-0 mt-0.5" />
              <span>
                A receipt and access record have been logged for{" "}
                <strong className="text-[#0B0B0E]">{order.customerEmail}</strong>. You can re-access this page anytime from your orders library.
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#707082]">
              <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>
                Secure token protection active. Direct static file URLs are blocked.
              </span>
            </div>
          </div>
        </Card>

        {/* Footer Support & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href={`/orders/${order.id}`}
            className="text-xs font-semibold text-[#707082] hover:text-[#0B0B0E] transition-colors"
          >
            ← View Order Status Details
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                Browse More Guides
              </Button>
            </Link>
            <a
              href={`mailto:${brand.supportEmail || "contact@anubhavbharti.dev"}`}
              className="text-xs font-semibold text-[#0B0B0E] hover:text-[#F59E0B] transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" /> Contact Creator Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
