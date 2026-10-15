"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";
import type { ManualPaymentSettings } from "@/types/settings";

interface PaymentInstructionFormProps {
  order: Order;
  paymentConfig: ManualPaymentSettings;
}

export function PaymentInstructionForm({
  order,
  paymentConfig,
}: PaymentInstructionFormProps) {
  const [copied, setCopied] = useState(false);
  const [paymentReference, setPaymentReference] = useState(
    order.paymentReference || ""
  );
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    order.paymentProofUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(order.status);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(
    order.status === "PENDING_PAYMENT_VERIFICATION"
      ? "Payment submitted successfully. We'll verify your payment and send your product to the email provided."
      : null
  );

  const handleCopyIdentifier = () => {
    navigator.clipboard.writeText(paymentConfig.paymentIdentifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotPreview(null);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!paymentReference.trim()) {
      setError("Please enter your 12-digit UTR, Transaction ID, or UPI Reference.");
      return;
    }

    if (paymentReference.trim().length < 4) {
      setError("Payment Reference ID must be at least 4 characters.");
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/pay/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentReference: paymentReference.trim(),
          paymentProofUrl: screenshotPreview || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit payment details");
      }

      setCurrentStatus("PENDING_PAYMENT_VERIFICATION");
      setSubmittedMessage(
        "Payment submitted successfully. We'll verify your payment and send your product to the email provided."
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // STATE 1: ALREADY SUBMITTED & AWAITING VERIFICATION
  // ══════════════════════════════════════════════════════════════
  if (currentStatus === "PENDING_PAYMENT_VERIFICATION" || submittedMessage) {
    return (
      <Card
        variant="elevated"
        padding="lg"
        className="max-w-xl mx-auto bg-white border border-[#E5E5EB] text-center py-10"
      >
        <div className="w-16 h-16 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center mx-auto mb-5 shadow-2xs">
          <Clock className="w-8 h-8 text-[#D97706]" />
        </div>

        <Badge variant="yellow" size="sm" className="mb-3">
          Verification Pending
        </Badge>

        <h2 className="text-2xl font-black text-[#0B0B0E] tracking-tight mb-3">
          Payment Submitted Successfully
        </h2>

        <p className="text-sm text-[#4C4C5B] leading-relaxed max-w-md mx-auto mb-6 font-normal">
          We&apos;ll verify your payment and send your product to the email provided (
          <strong className="text-[#0B0B0E]">{order.customerEmail}</strong>).
        </p>

        {/* Order Details Receipt Box */}
        <div className="bg-[#FAFAFC] rounded-2xl p-4 sm:p-5 border border-[#E5E5EB] text-left text-xs space-y-3 mb-6">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E5EB]">
            <span className="text-[#707082]">Order Number</span>
            <span className="font-mono font-bold text-[#0B0B0E]">{order.id}</span>
          </div>
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E5EB]">
            <span className="text-[#707082]">Product</span>
            <span className="font-semibold text-[#0B0B0E]">{order.productTitle}</span>
          </div>
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E5EB]">
            <span className="text-[#707082]">Amount Paid</span>
            <span className="font-bold text-[#0B0B0E] font-mono">
              {formatPrice(order.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#707082]">Transaction / UTR Reference</span>
            <span className="font-mono font-bold text-[#15803D]">
              {paymentReference || order.paymentReference || "Submitted"}
            </span>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#15803D] flex items-center justify-center gap-2 mb-6">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Manual verifications are typically reviewed within 15 to 30 minutes.</span>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/order/confirmed/${order.id}`}>
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              View Confirmation &amp; Access Page
            </Button>
          </Link>
          <Link href={`/orders/${order.id}`}>
            <Button variant="outline" size="md">
              Check Live Status
            </Button>
          </Link>
          <a
            href="https://instagram.com/vedxlabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="md"
              icon={<MessageCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              DM @vedxlabs
            </Button>
          </a>
        </div>
      </Card>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STATE 2: ACTIVE PAYMENT INSTRUCTION WORKFLOW
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: QR & UPI Instructions ── */}
      <div className="md:col-span-6 space-y-6">
        <Card variant="elevated" padding="lg" className="bg-white border border-[#E5E5EB] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F5]">
            <span className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
              Step 1: Scan &amp; Pay
            </span>
            <span className="text-[11px] font-mono font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
              Exact Amount: {formatPrice(order.amount)}
            </span>
          </div>

          {/* Dynamic QR Payment Area */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EB]">
            <div className="relative w-56 h-56 bg-white p-3 rounded-2xl border border-[#E5E5EB] shadow-xs flex items-center justify-center">
              <Image
                src={paymentConfig.qrImageUrl || "/images/payment-qr.svg"}
                alt="Payment QR Code"
                width={200}
                height={200}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <p className="text-[11px] text-[#707082] mt-3 font-medium text-center">
              Scan with Google Pay, PhonePe, Paytm, CRED, or BHIM
            </p>
          </div>

          {/* UPI Identifier Box with 1-Click Copy */}
          <div className="bg-[#FAFAFC] rounded-2xl p-4 border border-[#E5E5EB] space-y-3">
            <div>
              <p className="text-[10px] font-bold text-[#707082] uppercase tracking-wider mb-1">
                UPI / Payment Identifier
              </p>
              <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-[#E5E5EB]">
                <span className="font-mono font-bold text-sm text-[#0B0B0E]">
                  {paymentConfig.paymentIdentifier}
                </span>
                <button
                  type="button"
                  onClick={handleCopyIdentifier}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B0B0E] hover:text-[#F59E0B] px-2.5 py-1 rounded-lg bg-[#F2F2F5] hover:bg-[#E5E5EB] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      <span className="text-[#15803D]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#707082] pt-1">
              <span>Payee Account Name:</span>
              <strong className="text-[#0B0B0E]">{paymentConfig.payeeName}</strong>
            </div>
          </div>

          {/* Clear Customer Instructions */}
          <div className="space-y-2 pt-2 border-t border-[#F2F2F5]">
            <p className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
              Payment Guide
            </p>
            <div className="text-xs text-[#4C4C5B] space-y-1.5 leading-relaxed whitespace-pre-line font-normal">
              {paymentConfig.instructions}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Right Column: Payment Verification Form ── */}
      <div className="md:col-span-6 space-y-6">
        <Card variant="elevated" padding="lg" className="bg-white border border-[#E5E5EB]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F5] mb-5">
            <span className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
              Step 2: Submit Payment Details
            </span>
            <span className="text-[11px] text-[#707082]">Order #{order.id}</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitProof} className="space-y-5">
            {/* Payment Reference / UTR Number */}
            <div>
              <label
                htmlFor="payment-reference"
                className="block text-xs font-bold text-[#0B0B0E] mb-1.5"
              >
                Payment Reference / Transaction ID / UTR <span className="text-[#7F1D1D]">*</span>
              </label>
              <input
                id="payment-reference"
                type="text"
                required
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. 429381920194 (12-digit UTR)"
                className="w-full rounded-xl border border-[#E5E5EB] bg-white text-sm text-[#0B0B0E] px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
              />
              <p className="text-[11px] text-[#707082] mt-1 font-normal">
                Found under the payment receipt in your Google Pay, PhonePe, or Paytm app.
              </p>
            </div>

            {/* Payment Screenshot Upload */}
            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] mb-1.5">
                Payment Screenshot <span className="text-[#A2A2B0] font-normal">(Recommended for faster verification)</span>
              </label>

              {screenshotPreview ? (
                <div className="relative rounded-2xl border border-[#E5E5EB] p-3 bg-[#FAFAFC] flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5E5EB] shrink-0 bg-white">
                    <Image
                      src={screenshotPreview}
                      alt="Payment Screenshot Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0B0B0E] truncate">Screenshot Attached</p>
                    <p className="text-[11px] text-[#15803D] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for verification
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="p-1.5 rounded-lg hover:bg-[#F2F2F5] text-[#707082] hover:text-[#0B0B0E] transition-colors"
                    title="Remove screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer border-2 border-dashed border-[#E5E5EB] hover:border-[#F59E0B] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#FAFAFC] hover:bg-white transition-all text-center">
                  <UploadCloud className="w-6 h-6 text-[#707082]" />
                  <div>
                    <span className="text-xs font-bold text-[#0B0B0E]">
                      Click to upload payment screenshot
                    </span>
                    <p className="text-[11px] text-[#707082] mt-0.5">
                      PNG, JPG, or WebP up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Trust and Privacy Note */}
            <div className="p-3.5 rounded-xl bg-[#FAFAFC] border border-[#E5E5EB] text-[11px] text-[#707082] space-y-1">
              <div className="flex items-center gap-1.5 text-[#0B0B0E] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Provider-Agnostic Manual Verification</span>
              </div>
              <p>
                Your reference ID and receipt are checked directly by our team. No personal banking credentials are requested or stored.
              </p>
            </div>

            {/* "I've completed payment" Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              I&apos;ve completed payment
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
