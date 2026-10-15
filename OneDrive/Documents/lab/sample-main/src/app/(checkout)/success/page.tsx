"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, Mail, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const productSlug = searchParams.get("product") || "master-ai-in-28-days";
  const orderId = searchParams.get("orderId");

  const handleDownload = () => {
    window.open(`/api/download/${productSlug}`, "_self");
  };

  return (
    <div className="container-padded max-w-xl mx-auto text-center py-12">
      {/* Verified Status Pill */}
      <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mx-auto mb-5 shadow-2xs">
        <CheckCircle2 className="w-8 h-8 text-[#15803D]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold mb-3 border border-[#FDE68A]">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Payment &amp; Enrollment Confirmed
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-[#0B0B0E] tracking-tight mb-2">
        You&apos;re Officially Enrolled!
      </h1>
      {orderId && (
        <p className="font-mono text-xs text-[#707082] mb-3">
          Reference: <span className="font-bold text-[#0B0B0E]">{orderId}</span>
        </p>
      )}
      <p className="text-[#4C4C5B] text-sm leading-relaxed mb-8 max-w-md mx-auto font-normal">
        Your access credentials for <strong className="text-[#0B0B0E] font-semibold">Master AI in 28 Days</strong> have been issued to <span className="font-semibold text-[#0B0B0E] bg-white px-2 py-0.5 rounded-lg border border-[#E5E5EB]">{email}</span>.
      </p>

      {/* Info Card */}
      <Card variant="default" padding="md" className="text-left mb-6 bg-white border border-[#E5E5EB]">
        <div className="space-y-4 text-xs sm:text-sm text-[#4C4C5B]">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#707082] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#0B0B0E]">Check your inbox</p>
              <p className="text-[#707082] text-xs">Look for an email from Anubhav Bharti / vedxlabs with your credentials.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-3 border-t border-[#F2F2F5]">
            <Download className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#0B0B0E]">Instant Onboarding Handbook</p>
              <p className="text-[#707082] text-xs">You can download the starter pack right now to review Day 1 foundations.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownload}
          icon={<Download className="w-4 h-4" />}
          iconPosition="left"
        >
          Download Starter Kit
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Community note */}
      <div className="p-4 rounded-xl bg-white border border-[#E5E5EB] text-xs text-[#707082] flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium text-[#0B0B0E]">
          <MessageCircle className="w-4 h-4 text-[#15803D]" /> Creator Support Channel
        </span>
        <a
          href="https://instagram.com/vedxlabs"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#0B0B0E] hover:text-[#F59E0B] transition-colors"
        >
          DM @vedxlabs →
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center py-12">
      <Suspense fallback={<div className="text-center text-sm text-[#A2A2B0]">Loading confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
