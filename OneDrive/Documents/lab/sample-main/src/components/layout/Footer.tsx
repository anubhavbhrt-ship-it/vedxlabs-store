import Link from "next/link";
import Image from "next/image";
import type { BrandSettings } from "@/types/settings";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/#about", label: "About Creator" },
  { href: "/orders", label: "Track Order & Downloads" },
];

interface FooterProps {
  brand?: BrandSettings;
}

export function Footer({ brand }: FooterProps) {
  const creatorName = brand?.creatorName || "Anubhav Bharti";
  const avatarUrl = brand?.avatarUrl || "/images/anubhav.png";
  const bio =
    brand?.bio ||
    "Building practical AI guides, production toolkits, and modern web products. Helping learners across India master AI workflows.";
  const tagline = brand?.brandTagline || "vedxlabs • Creator Brand";

  const socialLinks: { href: string; label: string }[] = [];
  if (brand?.instagramHandle) {
    socialLinks.push({
      href: `https://instagram.com/${brand.instagramHandle.replace("@", "")}`,
      label: "Instagram",
    });
  }
  if (brand?.youtubeHandle) {
    const handle = brand.youtubeHandle.startsWith("@")
      ? brand.youtubeHandle
      : `@${brand.youtubeHandle}`;
    socialLinks.push({
      href: `https://youtube.com/${handle}`,
      label: "YouTube",
    });
  }
  if (brand?.twitterHandle) {
    socialLinks.push({
      href: `https://twitter.com/${brand.twitterHandle.replace("@", "")}`,
      label: "Twitter / 𝕏",
    });
  }
  if (brand?.githubHandle) {
    socialLinks.push({
      href: `https://github.com/${brand.githubHandle.replace("@", "")}`,
      label: "GitHub",
    });
  }

  // Fallback defaults if no socials entered
  if (socialLinks.length === 0) {
    socialLinks.push(
      { href: "https://instagram.com/vedxlabs", label: "Instagram" },
      { href: "https://youtube.com/@vedxlabs", label: "YouTube" },
      { href: "https://twitter.com/vedxlabs", label: "Twitter / 𝕏" },
      { href: "https://github.com/vedxlabs", label: "GitHub" }
    );
  }

  return (
    <footer className="bg-[#0B0B0E] text-white mt-auto border-t border-[#1E1E26]">
      <div className="container-padded py-16 sm:py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* ── Brand & Creator Identity ── */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full ring-2 ring-[#F59E0B] overflow-hidden bg-[#F59E0B] shrink-0">
              <Image
                src={avatarUrl}
                alt={creatorName}
                width={36}
                height={36}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                {creatorName}
              </span>
              <span className="text-[11px] text-[#A2A2B0] font-medium">
                {tagline}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A2A2B0] leading-relaxed max-w-sm font-normal">
            {bio}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {socialLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-[#24242F] bg-[#141419] text-[#A2A2B0] text-xs font-semibold hover:text-[#F59E0B] hover:border-[#F59E0B]/40 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="md:col-span-3 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#707082]">
            Navigation
          </p>
          <ul className="space-y-2 text-xs">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[#A2A2B0] hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Product Spotlight ── */}
        <div className="md:col-span-3 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#707082]">
            Featured Guide
          </p>
          <div className="p-3.5 rounded-xl border border-[#24242F] bg-[#141419] text-xs space-y-2">
            <p className="font-bold text-white">Master AI in 28 Days</p>
            <p className="text-[11px] text-[#A2A2B0]">Daily action curriculum for beginners.</p>
            <Link
              href="/#products"
              className="inline-block text-[11px] font-bold text-[#F59E0B] hover:underline"
            >
              Explore all guides →
            </Link>
          </div>
        </div>
      </div>

      <div className="container-padded py-6 border-t border-[#1E1E26] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707082]">
        <p>© 2026 {creatorName}. All rights reserved.</p>
        <p className="text-[11px]">
          Direct digital access • Personal Creator Store
        </p>
      </div>
    </footer>
  );
}
