"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { BrandSettings } from "@/types/settings";

const NAV_LINKS = [
  { href: "/#products", label: "Products" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/orders", label: "Track Order" },
];

interface PublicNavProps {
  transparent?: boolean;
  brand?: BrandSettings;
}

export function PublicNav({ transparent = false, brand }: PublicNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const creatorName = brand?.creatorName || "Anubhav Bharti";
  const avatarUrl = brand?.avatarUrl || "/images/anubhav.png";
  const tagline = brand?.brandTagline || "Master AI in 28 Days";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-[#E5E5EB]"
      )}
    >
      <div className="container-padded flex h-16 items-center justify-between">
        {/* ── Creator Brand Mark ── */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label={`${creatorName} — Home`}
        >
          <div className="relative w-9 h-9 rounded-full ring-2 ring-[#F59E0B] overflow-hidden bg-[#F59E0B] shadow-2xs group-hover:scale-105 transition-transform duration-200">
            <Image
              src={avatarUrl}
              alt={creatorName}
              width={36}
              height={36}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[#0B0B0E] tracking-tight text-sm leading-tight group-hover:text-black">
              {creatorName}
            </span>
            <span className="text-[11px] text-[#707082] font-medium leading-none truncate max-w-[180px]">
              {tagline}
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-[#4C4C5B] hover:text-[#0B0B0E] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/#products">
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Get Guide
            </Button>
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden p-2 rounded-xl text-[#121217] hover:bg-[#F2F2F5] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[#E5E5EB] bg-white shadow-[0_12px_32px_rgba(11,11,14,0.08)]">
          <nav className="container-padded py-5 flex flex-col gap-1.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#32323D] hover:text-[#0B0B0E] py-2.5 px-3 rounded-xl hover:bg-[#F2F2F5] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-[#F2F2F5]">
              <Link href="/#products" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" fullWidth>
                  Get Guide
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
