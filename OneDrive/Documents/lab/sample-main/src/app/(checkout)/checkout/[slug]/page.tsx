import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ProductCover } from "@/components/product/ProductCover";
import { getProductBySlug } from "@/lib/products";
import { getPlatformSettings } from "@/lib/settings";
import { formatPrice, discountPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Secure Checkout",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getPlatformSettings(),
  ]);
  if (!product) notFound();

  const brand = settings.brand;

  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-8 sm:py-14">
      {/* ── Top Back Navigation ── */}
      <div className="container-padded max-w-5xl mx-auto mb-6">
        <Link
          href="/#products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707082] hover:text-[#0B0B0E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>
      </div>

      <div className="container-padded max-w-5xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Checkout Customer Form ── */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold mb-2.5 border border-[#FDE68A]">
                <Lock className="w-3 h-3 text-[#F59E0B]" />
                Secure Checkout &amp; Instant Access
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0E] tracking-tight mb-2">
                Complete Your Enrollment
              </h1>
              <p className="text-xs sm:text-sm text-[#4C4C5B] font-normal leading-relaxed">
                Enter your details to receive your personalized guide, access credentials, and daily learning roadmap.
              </p>
            </div>

            <CheckoutForm product={product} />
          </div>

          {/* ── Right Column: Order Summary & Product Showcase ── */}
          <div className="md:col-span-5 md:sticky md:top-20 space-y-4">
            <Card variant="elevated" padding="lg" className="bg-white border border-[#E5E5EB]">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F2F2F5]">
                <p className="text-[11px] font-bold text-[#707082] uppercase tracking-[0.14em]">
                  Order Summary
                </p>
                <span className="text-[10px] font-mono font-medium text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                  Verified Digital Product
                </span>
              </div>

              {/* Product Cover Showcase */}
              <div className="my-5">
                {product.slug === "master-ai-in-28-days" ? (
                  <ProductCover compact className="mb-4" />
                ) : (
                  <div className="rounded-xl bg-[#0B0B0E] text-white p-5 border border-[#1E1E26] mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="yellow" size="xs">
                        {product.category}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#A2A2B0]">EDITION 2026</span>
                    </div>
                    <h3 className="font-bold text-base text-white tracking-tight">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-[#A2A2B0] mt-1 line-clamp-2">
                      {product.tagline || product.shortDescription}
                    </p>
                  </div>
                )}

                {/* Product Name & Short Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-black text-[#0B0B0E] tracking-tight leading-snug">
                      {product.title}
                    </h2>
                    {discount > 0 && (
                      <Badge variant="burgundy" size="xs" className="shrink-0">
                        {discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#707082] leading-relaxed">
                    {product.shortDescription || product.tagline}
                  </p>
                </div>
              </div>

              {/* Price Line Items */}
              <div className="space-y-2.5 text-xs text-[#4C4C5B] py-4 border-y border-[#F2F2F5]">
                <div className="flex items-center justify-between">
                  <span>Regular Price</span>
                  <span className="text-[#A2A2B0] line-through font-mono">
                    {product.originalPrice
                      ? formatPrice(product.originalPrice)
                      : formatPrice(product.price)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-[#7F1D1D] font-medium">
                    <span>Creator Launch Savings</span>
                    <span className="font-mono">
                      -{formatPrice((product.originalPrice || product.price) - product.price)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Digital Delivery &amp; Notion Access</span>
                  <span className="text-[#15803D] font-semibold">Included (₹0)</span>
                </div>
              </div>

              {/* Final Amount Due */}
              <div className="flex items-baseline justify-between py-4 border-b border-[#F2F2F5]">
                <div>
                  <span className="font-extrabold text-[#0B0B0E] text-sm block">
                    Final Amount
                  </span>
                  <span className="text-[10px] text-[#707082]">One-time payment</span>
                </div>
                <span className="text-3xl font-black text-[#0B0B0E] tracking-tight font-mono">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Trust & Guarantee */}
              <div className="pt-4 space-y-2 text-[11px] text-[#707082]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>256-bit SSL encrypted • Instant delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Free lifetime updates included</span>
                </div>
              </div>
            </Card>

            {/* Creator Trust Endorsement Badge */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-[#F59E0B] overflow-hidden bg-[#FAFAFC] shrink-0">
                <Image
                  src={brand.avatarUrl || "/images/anubhav.png"}
                  alt={brand.creatorName || "Creator"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#0B0B0E]">Direct from {brand.creatorName || "Anubhav Bharti"}</p>
                <p className="text-[11px] text-[#707082]">
                  {brand.brandTagline || "Digital Creator"} • Questions? Reach {brand.supportEmail || "support"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
