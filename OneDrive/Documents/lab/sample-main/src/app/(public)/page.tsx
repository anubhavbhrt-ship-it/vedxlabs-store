import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCover } from "@/components/product/ProductCover";
import { getPlatformSettings } from "@/lib/settings";
import { getPublishedProducts } from "@/lib/products";
import { formatPrice, discountPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Anubhav Bharti — Digital Guides & Toolkits",
  description:
    "Practical, beginner-friendly blueprints to understand AI, build digital tools, and master modern workflows.",
};

const FAQS = [
  {
    q: "How does the manual payment and delivery process work?",
    a: "Select your guide, enter your email, scan the creator UPI QR code, and submit your 12-digit transaction UTR number. Once the payment is verified, your personal download link unlocks immediately and is accessible anytime via your Order Reference.",
  },
  {
    q: "Do I need any programming background?",
    a: "None at all. The guides are written in clear, plain language with step-by-step practical actions designed for everyday students, freelancers, and professionals.",
  },
  {
    q: "What format are the digital products delivered in?",
    a: "Clean, high-resolution PDF handbooks and structured resource vaults that you can read on any mobile phone, tablet, or desktop computer.",
  },
  {
    q: "Are updates included with my purchase?",
    a: "Yes. As AI models and prompt techniques evolve, all future guide revisions are delivered to enrolled readers at no extra charge.",
  },
  {
    q: "How can I contact you if I have questions?",
    a: "You can reach out directly to the creator email or social channels listed in the footer of this page.",
  },
];

export default async function HomePage() {
  const [settings, products] = await Promise.all([
    getPlatformSettings(),
    getPublishedProducts(),
  ]);

  const featuredProduct =
    products.find((p) => p.slug === settings.homepage?.featuredProductSlug) ||
    products.find((p) => p.isFeatured) ||
    products[0];

  const featuredSlug = featuredProduct?.slug || "master-ai-in-28-days";
  const featuredPrice = featuredProduct?.price ?? 9900;
  const featuredOriginalPrice = featuredProduct?.originalPrice ?? 49900;

  return (
    <div className="flex flex-col">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: PREMIUM PERSONAL BRAND & FEATURED GUIDE
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#FAFAFC] border-b border-[#E5E5EB]">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#0B0B0E 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="container-padded relative py-16 sm:py-24 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Creator Identity & Pitch */}
            <div className="lg:col-span-7 space-y-6">
              {/* Creator pill */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/admin/login"
                  aria-label="Creator profile"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5EB] shadow-2xs hover:border-[#D1D1DB] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-[#F59E0B] shrink-0">
                    <Image
                      src={settings.brand.avatarUrl || "/images/anubhav.png"}
                      alt={settings.brand.creatorName || "Creator"}
                      width={20}
                      height={20}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0B0B0E]">
                    {settings.brand.creatorName || "Anubhav Bharti"}
                  </span>
                </Link>

                <Badge variant="yellow" size="sm">
                  ⚡ {settings.homepage.heroEyebrow || "A PRACTICAL GUIDE FOR BEGINNERS"}
                </Badge>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B0B0E] tracking-[-0.035em] leading-[1.08] text-balance">
                  {settings.homepage.heroHeadline || "Master AI in 28 Days"}
                </h1>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-[#F59E0B] tracking-tight">
                  {settings.homepage.heroSubheadline || "From Zero to Confident With AI"}
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#4C4C5B] leading-relaxed max-w-xl font-normal">
                {settings.homepage.heroDescription ||
                  "A practical, beginner-friendly roadmap to understand AI, use AI effectively and start building with it."}
              </p>

              {/* Buy & Explore CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link href={`/checkout/${featuredSlug}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Get the Guide — {formatPrice(featuredPrice)}
                  </Button>
                </Link>
                <Link href="#products">
                  <Button variant="outline" size="lg">
                    Explore Guides
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#E5E5EB]/80 flex flex-wrap items-center gap-6 text-xs text-[#707082]">
                <div className="flex items-center gap-1.5 font-medium text-[#121217]">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  <span>Instant Digital Access</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#121217]">
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>Direct Creator Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#121217]">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <span>Verified Manual UPI</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Product Cover Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <ProductCover title={featuredProduct?.title || settings.homepage.heroHeadline} />

                {/* Pricing & Guarantee Bar */}
                <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#E5E5EB] shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    <span className="font-semibold text-[#0B0B0E]">
                      {settings.homepage.guaranteeText || "100% Satisfaction Guarantee"}
                    </span>
                  </div>
                  <span className="font-bold text-[#F59E0B]">
                    {formatPrice(featuredPrice)}{" "}
                    {featuredOriginalPrice > featuredPrice && (
                      <span className="line-through text-[#A2A2B0] font-normal text-[11px] ml-1">
                        {formatPrice(featuredOriginalPrice)}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRODUCTS CATALOG SECTION: DIGITAL PRODUCTS
      ══════════════════════════════════════════════════════════════ */}
      <section id="products" className="bg-white py-20 sm:py-28 border-b border-[#E5E5EB]">
        <div className="container-padded">
          <SectionHeader
            overline="Digital Products"
            title="Handcrafted Guides &amp; Blueprints"
            description="Designed from real building and workflow experience. Direct digital access delivered upon payment verification."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => {
              const discount = product.originalPrice
                ? discountPercent(product.originalPrice, product.price)
                : 0;

              return (
                <Card
                  key={product.slug}
                  variant="default"
                  padding="none"
                  hover
                  className="bg-white border border-[#E5E5EB] flex flex-col justify-between overflow-hidden shadow-2xs"
                >
                  <div>
                    {/* Visual Card Header */}
                    <div className="relative bg-[#0B0B0E] p-6 text-white border-b border-[#1E1E26] min-h-[150px] flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="yellow" size="xs">
                          {product.category || "Guide"}
                        </Badge>
                        {discount > 0 && (
                          <Badge variant="burgundy" size="xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>

                      <div className="my-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A2A2B0]">
                          By {settings.brand.creatorName || "Anubhav Bharti"}
                        </span>
                        <h3 className="text-lg font-black text-white tracking-tight line-clamp-1">
                          {product.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#A2A2B0] font-mono">
                        <span>Digital Edition</span>
                        <span className="text-[#F59E0B] font-bold">Manual Delivery</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-base font-black text-[#0B0B0E] tracking-tight mb-1.5">
                          {product.title}
                        </h4>
                        <p className="text-xs text-[#4C4C5B] leading-relaxed line-clamp-3">
                          {product.shortDescription || product.tagline}
                        </p>
                      </div>

                      {product.features && product.features.length > 0 && (
                        <ul className="space-y-1.5 pt-3 border-t border-[#F2F2F5] text-xs text-[#32323D]">
                          {product.features.slice(0, 3).map((feat) => (
                            <li key={feat} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0 border-t border-[#F2F2F5] bg-[#FAFAFC] mt-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#707082] block">
                        Price
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-[#0B0B0E]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-[#A2A2B0] line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/checkout/${product.slug}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                          iconPosition="right"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT SECTION: CREATOR STORY & BIO
      ══════════════════════════════════════════════════════════════ */}
      <section id="about" className="bg-[#FAFAFC] py-20 sm:py-28 border-b border-[#E5E5EB]">
        <div className="container-padded max-w-4xl mx-auto">
          <div className="bg-white border border-[#E5E5EB] rounded-3xl p-8 sm:p-12 shadow-2xs">
            <div className="grid md:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Creator Photo Column */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <Link
                  href="/admin/login"
                  aria-label="Creator profile"
                  className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-[#F59E0B] ring-4 ring-white shadow-md mb-4 block cursor-pointer transition-transform duration-200 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F59E0B]"
                >
                  <Image
                    src={settings.brand.avatarUrl || "/images/anubhav.png"}
                    alt={settings.brand.creatorName || "Creator"}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover object-top"
                  />
                </Link>
                <h3 className="font-extrabold text-lg text-[#0B0B0E]">
                  {settings.brand.creatorName || "Anubhav Bharti"}
                </h3>
                <p className="text-xs text-[#707082] mb-3">
                  {settings.brand.brandTagline || "AI Enthusiast & Digital Creator"}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Author
                </div>
              </div>

              {/* Creator Narrative Column */}
              <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-[#4C4C5B] leading-relaxed">
                <Badge variant="yellow" size="xs">
                  About the Author
                </Badge>

                <h2 className="text-2xl sm:text-3xl font-black text-[#0B0B0E] tracking-tight leading-snug">
                  {settings.homepage.aboutHeading ||
                    "Building honest, practical tools for the new generation of creators."}
                </h2>

                <p>
                  {settings.homepage.aboutText ||
                    settings.brand.bio ||
                    "Building practical AI guides, production toolkits, and modern web products. Helping learners across India master AI workflows."}
                </p>

                <div className="pt-2 text-xs text-[#707082]">
                  <span>Questions or feedback? Reach me at </span>
                  <a
                    href={`mailto:${settings.brand.supportEmail}`}
                    className="text-[#0B0B0E] font-semibold underline hover:text-[#F59E0B]"
                  >
                    {settings.brand.supportEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ SECTION: CLEAR ANSWERS FOR VISITORS
      ══════════════════════════════════════════════════════════════ */}
      <section id="faq" className="bg-white py-20 sm:py-28 border-b border-[#E5E5EB]">
        <div className="container-padded max-w-3xl mx-auto">
          <SectionHeader
            overline="Clear Answers"
            title="Frequently Asked Questions"
            description="Simple, honest answers to help you get started with confidence."
          />

          <div className="space-y-4">
            {(settings.homepage?.faqs && settings.homepage.faqs.length > 0 ? settings.homepage.faqs : FAQS).map(({ q, a }) => (
              <Card key={q} variant="bordered" padding="lg" className="bg-[#FAFAFC]">
                <h3 className="font-extrabold text-sm sm:text-base text-[#0B0B0E] mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span>{q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#4C4C5B] leading-relaxed font-normal pl-6.5">
                  {a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CALL TO ACTION BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B0B0E] text-white py-20 sm:py-24 relative overflow-hidden">
        <div className="container-padded relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A22] border border-[#2D2D3A] text-xs font-bold text-[#F59E0B]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            INSTANT DIGITAL DELIVERY · VERIFIED CREATOR
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-[-0.03em] leading-tight text-balance">
            Start Your AI Journey Today.
          </h2>

          <p className="text-sm sm:text-base text-[#A2A2B0] max-w-md mx-auto font-normal">
            Get practical daily guidance, tested prompt systems, and direct author delivery.
          </p>

          <div className="pt-2">
            <Link href={`/checkout/${featuredSlug}`}>
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Get {featuredProduct?.title || "the Guide"} — {formatPrice(featuredPrice)}
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#707082]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>{settings.homepage.guaranteeText || "100% Satisfaction Guarantee"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#15803D]" />
              <span>Single-User PDF Edition</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <span>Manual Verification</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
