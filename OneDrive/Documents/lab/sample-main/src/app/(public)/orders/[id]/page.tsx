import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import { getOrderById } from "@/lib/orders";
import { getProductBySlug } from "@/lib/products";
import { getPlatformSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Order Status & Downloads",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
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

  const product = await getProductBySlug(order.productSlug);

  const isPaid = order.status === "PAID" || order.status === "DELIVERED";
  const isPendingVerification =
    order.status === "PENDING_PAYMENT_VERIFICATION";

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-10 sm:py-16">
      <div className="container-padded max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5EB]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="yellow" size="xs">
                Order #{order.id}
              </Badge>
              <Badge
                variant={
                  isPaid ? "green" : isPendingVerification ? "yellow" : "gray"
                }
                size="xs"
              >
                {isPaid
                  ? "Delivered & Active"
                  : isPendingVerification
                  ? "Verification Pending"
                  : "Awaiting Payment"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0E] tracking-tight">
              {order.productTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#707082] mt-1 font-normal">
              Purchased by <strong className="text-[#0B0B0E]">{order.customerEmail}</strong>
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-[#707082] block">Total Amount</span>
            <span className="text-2xl font-black text-[#0B0B0E] font-mono">
              {formatPrice(order.amount)}
            </span>
          </div>
        </div>

        {/* ── Status Lifecycle Tracker ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span className="text-xs font-bold text-[#0B0B0E]">1. Order Created</span>
            </div>
            <p className="text-[11px] text-[#707082]">Information captured</p>
          </div>

          <div
            className={`p-4 rounded-2xl border shadow-2xs ${
              isPaid || isPendingVerification
                ? "bg-white border-[#E5E5EB]"
                : "bg-[#FAFAFC] border-dashed border-[#E5E5EB]"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isPaid || isPendingVerification ? (
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              ) : (
                <Clock className="w-4 h-4 text-[#A2A2B0]" />
              )}
              <span className="text-xs font-bold text-[#0B0B0E]">2. Payment Submitted</span>
            </div>
            <p className="text-[11px] text-[#707082]">
              {order.paymentReference
                ? `Ref: ${order.paymentReference}`
                : "Awaiting payment proof"}
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border shadow-2xs ${
              isPaid
                ? "bg-[#F0FDF4] border-[#BBF7D0]"
                : "bg-[#FAFAFC] border-dashed border-[#E5E5EB]"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isPaid ? (
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              ) : (
                <Clock className="w-4 h-4 text-[#A2A2B0]" />
              )}
              <span className="text-xs font-bold text-[#0B0B0E]">3. Verified &amp; Unlocked</span>
            </div>
            <p className="text-[11px] text-[#707082]">
              {isPaid ? "Instant access available" : "Unlocks after review"}
            </p>
          </div>
        </div>

        {/* ── Main Content Area Based on Status ── */}
        {isPaid ? (
          /* UNLOCKED DOWNLOAD & ACCESS HUB */
          <Card variant="elevated" padding="lg" className="bg-white border border-[#E5E5EB] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F2F2F5]">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B0B0E]">
                  Your Learning Materials Are Ready!
                </h2>
                <p className="text-xs text-[#707082]">
                  Payment verified. Download your guide or access the online resource hub below.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Primary Download Button */}
              <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EB] space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-xs font-bold text-[#0B0B0E]">
                    Digital Guide &amp; Handbook (PDF)
                  </span>
                </div>
                <p className="text-[11px] text-[#707082] leading-relaxed">
                  The complete 28-day roadmap, daily mental models, prompt frameworks, and exercise checklist.
                </p>
                <a
                  href={`/api/delivery/${order.downloadToken}`}
                  download
                  className="block"
                >
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    icon={<Download className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Download your guide
                  </Button>
                </a>
              </div>

              {/* Notion / Interactive Workspace */}
              <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EB] space-y-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-[#1D4ED8]" />
                  <span className="text-xs font-bold text-[#0B0B0E]">
                    Interactive Notion Hub
                  </span>
                </div>
                <p className="text-[11px] text-[#707082] leading-relaxed">
                  Duplicate the interactive daily tracker, prompt library, and tool stack to your own Notion workspace.
                </p>
                <a
                  href={`/api/download/${order.productSlug}`}
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    icon={<ExternalLink className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Open Notion Workspace
                  </Button>
                </a>
              </div>
            </div>

            {/* Included Deliverables */}
            {product?.whatsIncluded && (
              <div className="pt-4 border-t border-[#F2F2F5] space-y-2">
                <p className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
                  Included in Your Enrollment:
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-[#4C4C5B]">
                  {product.whatsIncluded.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : isPendingVerification ? (
          /* PENDING VERIFICATION STATE */
          <Card variant="bordered" padding="lg" className="bg-white space-y-6">
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#92400E]">
                  Manual Payment Verification in Progress
                </h3>
                <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
                  Your reference ID (<strong>{order.paymentReference}</strong>) is currently being reviewed by Anubhav Bharti. Verifications are typically completed within 15 to 30 minutes. Once approved, this page will unlock your download automatically.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EB]">
              <div className="text-xs text-[#707082]">
                Need immediate access? You can DM your payment screenshot directly.
              </div>
              <a
                href="https://instagram.com/vedxlabs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="sm"
                  icon={<MessageCircle className="w-4 h-4" />}
                  iconPosition="left"
                >
                  DM @vedxlabs on Instagram
                </Button>
              </a>
            </div>
          </Card>
        ) : (
          /* AWAITING PAYMENT STATE */
          <Card variant="bordered" padding="lg" className="bg-white space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-[#0B0B0E]">
                Payment Instructions Awaiting Completion
              </h3>
            </div>
            <p className="text-xs text-[#707082]">
              You have not yet completed payment or submitted your UTR reference for this order.
            </p>
            <Link href={`/pay/${order.id}`}>
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Complete Payment Now ({formatPrice(order.amount)})
              </Button>
            </Link>
          </Card>
        )}

        {/* ── Creator Brand Support Footer ── */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#F59E0B] bg-[#FAFAFC] shrink-0">
              <Image
                src={brand.avatarUrl || "/images/anubhav.png"}
                alt={brand.creatorName || "Creator"}
                width={40}
                height={40}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#0B0B0E] block">
                Support &amp; Community
              </span>
              <span className="text-[#707082]">
                {brand.creatorName || "Anubhav Bharti"} • {brand.supportEmail || "contact@anubhavbharti.dev"}
              </span>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
