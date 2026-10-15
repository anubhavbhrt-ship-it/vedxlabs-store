import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProductCover } from "@/components/product/ProductCover";
import { getProductBySlug, getPublishedProducts } from "@/lib/products";
import { getPlatformSettings } from "@/lib/settings";
import { formatPrice, discountPercent } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.metadata?.seoTitle ?? `${product.title} — By Anubhav Bharti`,
    description: product.metadata?.seoDescription ?? (product.shortDescription || product.tagline),
  };
}

export default async function DynamicProductPage({
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
    <div className="bg-[#FAFAFC] min-h-screen">
      {/* ── Breadcrumb & Creator Topline ── */}
      <div className="bg-white border-b border-[#E5E5EB]">
        <div className="container-padded py-3.5 flex items-center justify-between text-xs text-[#707082]">
          <div className="flex items-center">
            <Link href="/" className="hover:text-[#0B0B0E] transition-colors font-medium">Home</Link>
            <span className="mx-2 text-[#A2A2B0]">›</span>
            <Link href="/products" className="hover:text-[#0B0B0E] transition-colors font-medium">Products</Link>
            <span className="mx-2 text-[#A2A2B0]">›</span>
            <span className="text-[#0B0B0E] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.title}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-5 h-5 rounded-full ring-1 ring-[#F59E0B] overflow-hidden bg-[#F59E0B]">
              <Image
                src={brand.avatarUrl || "/images/anubhav.png"}
                alt={brand.creatorName || "Creator"}
                width={20}
                height={20}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="font-bold text-[#0B0B0E]">{brand.creatorName || "Anubhav Bharti"}</span>
          </div>
        </div>
      </div>

      <div className="container-padded py-10 sm:py-14">
        {/* Category & Status Pill */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707082] hover:text-[#0B0B0E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Products
          </Link>

          <Badge variant="yellow" size="xs">
            {product.category}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 max-w-5xl mx-auto">
          {/* ══════════════ LEFT COLUMN — Product Details ══════════════ */}
          <div className="lg:col-span-7 space-y-10">
            {/* Visual Cover: Architectural Cover Component or Dynamic Card */}
            {product.slug === "master-ai-in-28-days" ? (
              <ProductCover title={product.title} />
            ) : (
              <div className="rounded-2xl bg-[#0B0B0E] text-white p-6 sm:p-8 border border-[#1E1E26] shadow-xl relative overflow-hidden min-h-[280px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Badge variant="yellow" size="xs">
                    {product.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#A2A2B0]">EDITION 2026</span>
                </div>

                <div className="my-6">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] block mb-1">
                    By Anubhav Bharti
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {product.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#D4D4DE] max-w-md">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1E1E26] flex items-center justify-between text-xs text-[#A2A2B0]">
                  <span>Instant Digital Download</span>
                  <span className="text-white font-bold">vedxlabs</span>
                </div>
              </div>
            )}

            {/* Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="gray" size="xs">{product.category}</Badge>
                {discount > 0 && (
                  <Badge variant="burgundy" size="xs">{discount}% OFF</Badge>
                )}
                <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Digital Asset
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#0B0B0E] tracking-tight mb-3">
                {product.title}
              </h1>
              <p className="text-base text-[#4C4C5B] leading-relaxed font-normal">
                {product.shortDescription || product.tagline}
              </p>
            </div>

            {/* Full Detailed Description */}
            <div className="bg-white border border-[#E5E5EB] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-[#0B0B0E] tracking-tight">
                About this digital product
              </h2>
              <div className="text-sm text-[#4C4C5B] leading-relaxed whitespace-pre-line font-normal">
                {product.fullDescription || product.description}
              </div>
            </div>

            {/* Key Benefits & Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white border border-[#E5E5EB] rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-black text-[#0B0B0E] tracking-tight">
                  Key Benefits &amp; Core Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {product.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#32323D]">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            {product.whatsIncluded && product.whatsIncluded.length > 0 && (
              <div className="bg-white border border-[#E5E5EB] rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-black text-[#0B0B0E] tracking-tight">
                  What&apos;s Included in Your Download
                </h2>
                <div className="space-y-2.5 pt-2">
                  {product.whatsIncluded.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFC] border border-[#E5E5EB] text-xs sm:text-sm font-medium text-[#0B0B0E]">
                      <FileText className="w-4 h-4 text-[#F59E0B] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Roadmap (if applicable) */}
            {product.curriculum && product.curriculum.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-[#0B0B0E] tracking-tight">
                  Curriculum Breakdown
                </h2>
                <div className="space-y-3">
                  {product.curriculum.map((mod) => (
                    <Card key={mod.id} variant="bordered" padding="md" className="bg-white">
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#92400E] font-black text-xs flex items-center justify-center shrink-0">
                          {mod.lessons?.length || "•"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0B0B0E] text-sm mb-1">{mod.title}</h3>
                          {mod.description && (
                            <p className="text-xs text-[#707082] mb-3 leading-relaxed">{mod.description}</p>
                          )}
                          {mod.lessons && (
                            <ul className="grid sm:grid-cols-2 gap-1.5 pt-2 border-t border-[#F2F2F5]">
                              {mod.lessons.map((lesson) => (
                                <li key={lesson} className="flex items-center gap-1.5 text-xs text-[#32323D]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                                  <span>{lesson}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Creator Information Section */}
            <div className="bg-white border border-[#E5E5EB] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-[#0B0B0E] tracking-tight">
                About the Creator
              </h2>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#F59E0B] ring-2 ring-[#F59E0B] shrink-0 shadow-sm">
                  <Image
                    src="/images/anubhav.png"
                    alt="Anubhav Bharti"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-extrabold text-base text-[#0B0B0E]">Anubhav Bharti</h3>
                    <Badge variant="yellow" size="xs">Creator &amp; AI Dev</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4C4C5B] leading-relaxed">
                    Young developer and creator who specializes in modern web development, prompt engineering scaffolds, and practical AI implementation. All products are personally tested and continually updated.
                  </p>
                </div>
              </div>
            </div>

            {/* Product FAQs */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-[#0B0B0E] tracking-tight">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {product.faqs.map(({ question, answer }) => (
                    <Card key={question} variant="bordered" padding="md" className="bg-white">
                      <h4 className="font-bold text-sm text-[#0B0B0E] mb-1.5 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                        <span>{question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4C4C5B] leading-relaxed pl-6 font-normal">
                        {answer}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ══════════════ RIGHT COLUMN — Sticky Purchase Panel ══════════════ */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <Card variant="elevated" padding="lg" className="bg-white">
              {/* Pricing Header */}
              <div className="mb-6 pb-6 border-b border-[#F2F2F5]">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-4xl font-black text-[#0B0B0E] tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-[#A2A2B0] line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discount > 0 && (
                    <Badge variant="burgundy" size="xs">Save {discount}%</Badge>
                  )}
                </div>
                <p className="text-xs text-[#707082]">
                  One-time payment • Lifetime updates included • Instant email delivery
                </p>
              </div>

              {/* Instant Purchase CTA */}
              <Link href={`/checkout/${product.slug}`} className="block mb-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Buy Now — {formatPrice(product.price)}
                </Button>
              </Link>

              <p className="text-[11px] text-center text-[#707082] mb-6">
                ⚡ Delivered directly to your email inbox
              </p>

              {/* Deliverables Checklist */}
              <div className="space-y-3 pt-5 border-t border-[#F2F2F5] text-xs text-[#32323D]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Immediate access to file asset</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Lifetime access &amp; free revision updates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Direct creator support from Anubhav</span>
                </div>
              </div>

              {/* Author Stamp */}
              <div className="border-t border-[#F2F2F5] mt-6 pt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full ring-2 ring-[#F59E0B] overflow-hidden bg-[#F59E0B] shrink-0">
                  <Image
                    src={brand.avatarUrl || "/images/anubhav.png"}
                    alt={brand.creatorName || "Creator"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-black text-[#0B0B0E]">{brand.creatorName || "Anubhav Bharti"}</p>
                    <span className="text-[10px] text-[#F59E0B]">✓</span>
                  </div>
                  <p className="text-[11px] text-[#707082]">{brand.brandTagline || "Creator & AI Developer"}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
