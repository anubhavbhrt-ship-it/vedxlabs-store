"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  User,
  Mail,
  Phone,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface CheckoutFormProps {
  product: Product;
}

export function CheckoutForm({ product }: CheckoutFormProps) {
  const router = useRouter();

  // Customer Input Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Validation & Submission States
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Client-side validation function
  const validateFields = (): boolean => {
    const errs: { name?: string; email?: string; phone?: string } = {};

    if (!name.trim()) {
      errs.name = "Full name is required for order verification.";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = "Email address is required to receive digital downloads.";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address (e.g., name@domain.com).";
    }

    if (phone.trim()) {
      const cleanDigits = phone.replace(/\D/g, "");
      if (cleanDigits.length !== 10) {
        errs.phone = "Please enter a valid 10-digit mobile number (or leave blank).";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          productSlug: product.slug,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || "Unable to proceed to payment. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push(`/pay/${data.orderId}`);
      }
    } catch (err: unknown) {
      console.error("Payment initiation error:", err);
      setSubmitError("Network connection interrupted. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError && (
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {submitError}
        </div>
      )}

      {/* ── STEP 1: Customer Contact Credentials ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E5EB] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F5]">
          <span className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
            1. Your Details
          </span>
          <span className="text-[11px] text-[#707082]">Digital file delivery</span>
        </div>

        {/* Customer Full Name Field */}
        <div>
          <label
            htmlFor="customer-name"
            className="block text-xs font-bold text-[#0B0B0E] mb-1.5"
          >
            Full Name <span className="text-[#7F1D1D]">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#A2A2B0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="customer-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g. Rahul Sharma"
              className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm text-[#0B0B0E] placeholder:text-[#A2A2B0] bg-white transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-[#EF4444] focus:ring-[#EF4444]"
                  : "border-[#E5E5EB] focus:ring-[#F59E0B] focus:border-[#F59E0B]"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
            </p>
          )}
        </div>

        {/* Customer Email Address */}
        <div>
          <label
            htmlFor="customer-email"
            className="block text-xs font-bold text-[#0B0B0E] mb-1.5"
          >
            Email Address <span className="text-[#7F1D1D]">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#A2A2B0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="customer-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="name@example.com"
              className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm text-[#0B0B0E] placeholder:text-[#A2A2B0] bg-white transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-[#EF4444] focus:ring-[#EF4444]"
                  : "border-[#E5E5EB] focus:ring-[#F59E0B] focus:border-[#F59E0B]"
              }`}
            />
          </div>
          <p className="text-[11px] text-[#707082] mt-1 font-normal">
            Your download credentials and receipt will be sent here.
          </p>
          {errors.email && (
            <p className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>

        {/* Optional Mobile Phone */}
        <div>
          <label
            htmlFor="customer-phone"
            className="block text-xs font-bold text-[#0B0B0E] mb-1.5"
          >
            WhatsApp / Mobile Number{" "}
            <span className="text-[#707082] font-normal">(Optional)</span>
          </label>
          <div className="relative flex items-center">
            <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-[#E5E5EB] bg-[#F2F2F5] text-xs font-bold text-[#4C4C5B]">
              +91
            </span>
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-[#A2A2B0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="customer-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="98765 43210"
                className={`w-full rounded-r-xl border pl-10 pr-3.5 py-2.5 text-sm text-[#0B0B0E] placeholder:text-[#A2A2B0] bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#E5E5EB] focus:ring-[#F59E0B] focus:border-[#F59E0B]"
                }`}
              />
            </div>
          </div>
          <p className="text-[11px] text-[#707082] mt-1 font-normal">
            Optional for receiving WhatsApp download confirmation.
          </p>
          {errors.phone && (
            <p className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* ── STEP 2: Payment Process Notice ── */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E5EB] shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F2F2F5]">
          <span className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider">
            2. Payment Method
          </span>
          <span className="text-[11px] font-mono font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
            Direct UPI
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] flex items-start gap-3">
          <QrCode className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-[#0B0B0E]">Simple 2-Step Manual UPI Payment</p>
            <p className="text-[#4C4C5B] leading-relaxed">
              On the next screen, you&apos;ll scan our direct UPI QR code with any app (GPay, PhonePe, Paytm, CRED) and enter your reference ID for verification.
            </p>
          </div>
        </div>
      </div>

      {/* ── Trust & Security Micro Badges ── */}
      <div className="flex items-center justify-between text-xs text-[#707082] px-1 font-normal">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#0B0B0E]" />
          <span>Direct Creator Verification</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Instant Download Upon Approval</span>
        </div>
      </div>

      {/* ── Primary Action CTA: "Continue to Payment" ── */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Continue to Payment — {formatPrice(product.price)}
      </Button>

      <p className="text-[11px] text-center text-[#707082] font-normal">
        By clicking Continue to Payment, you will receive full lifetime access and future updates.
      </p>
    </form>
  );
}
