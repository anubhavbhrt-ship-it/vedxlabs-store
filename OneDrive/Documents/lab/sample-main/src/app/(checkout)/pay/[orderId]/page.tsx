import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/orders";
import { getPlatformSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { PaymentInstructionForm } from "@/components/checkout/PaymentInstructionForm";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Complete Payment — Instructions",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function PaymentInstructionPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  const settings = await getPlatformSettings();
  const paymentConfig = settings.manualPayment || {
    enabled: true,
    paymentIdentifier: "anubhav@upi",
    payeeName: "Anubhav Bharti",
    qrImageUrl: "/images/payment-qr.svg",
    instructions:
      "1. Scan the QR code or pay to the UPI ID.\n2. Enter your 12-digit UTR/Reference ID below.\n3. Upload your payment screenshot and submit.",
    supportEmail: "contact@anubhavbharti.dev",
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-8 sm:py-14">
      <div className="container-padded max-w-5xl mx-auto mb-6">
        <Link
          href={`/checkout/${order.productSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707082] hover:text-[#0B0B0E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Checkout
        </Link>
      </div>

      <div className="container-padded max-w-5xl mx-auto space-y-8">
        {/* Page Top Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <Badge variant="yellow" size="xs">
              Order #{order.id}
            </Badge>
            <span className="text-xs text-[#707082]">•</span>
            <span className="text-xs font-mono font-medium text-[#707082]">
              {order.customerEmail}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0E] tracking-tight">
              Payment Instructions for {order.productTitle}
            </h1>
            <div className="text-right">
              <span className="text-xs text-[#707082] block">Total Due</span>
              <span className="text-2xl font-black text-[#0B0B0E] font-mono">
                {formatPrice(order.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Payment Flow Form */}
        <PaymentInstructionForm order={order} paymentConfig={paymentConfig} />
      </div>
    </div>
  );
}
