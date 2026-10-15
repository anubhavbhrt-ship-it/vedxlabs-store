"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  Upload,
  QrCode,
  User,
  Layout,
  AlertCircle,
  Palette,
  Globe,
  Plus,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { PlatformSettings } from "@/types/settings";
import type { Product } from "@/types/product";

const COLOR_PRESETS = [
  { label: "Signature Amber", hex: "#F59E0B" },
  { label: "Emerald Growth", hex: "#10B981" },
  { label: "Royal Blue", hex: "#2563EB" },
  { label: "Crimson Red", hex: "#DC2626" },
  { label: "Minimalist Black", hex: "#18181B" },
];

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTabOverride, setActiveTabOverride] = useState<"website" | "payment" | null>(null);
  const activeTab = activeTabOverride ?? (tabParam === "payment" ? "payment" : "website");
  const setActiveTab = (tab: "website" | "payment") => setActiveTabOverride(tab);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Products list for selecting featured product
  const [products, setProducts] = useState<Product[]>([]);

  // Brand / Profile
  const [creatorName, setCreatorName] = useState("Anubhav Bharti");
  const [avatarUrl, setAvatarUrl] = useState("/images/anubhav.png");
  const [bio, setBio] = useState("");
  const [brandTagline, setBrandTagline] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [youtubeHandle, setYoutubeHandle] = useState("");

  // Homepage Copy & Customization
  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [featuredProductSlug, setFeaturedProductSlug] = useState("");
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [guaranteeText, setGuaranteeText] = useState("100% Satisfaction Guarantee");
  const [accentColor, setAccentColor] = useState("#F59E0B");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  // Payment Configuration
  const [paymentIdentifier, setPaymentIdentifier] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("/images/payment-qr.svg");
  const [paymentInstructions, setPaymentInstructions] = useState("");

  // Uploading state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/products?all=true"),
        ]);

        if (settingsRes.ok) {
          const s = await settingsRes.json();
          if (s.data) {
            const data: PlatformSettings = s.data;
            if (data.brand) {
              setCreatorName(data.brand.creatorName || "");
              setAvatarUrl(data.brand.avatarUrl || "/images/anubhav.png");
              setBio(data.brand.bio || "");
              setBrandTagline(data.brand.brandTagline || "");
              setSupportEmail(data.brand.supportEmail || "");
              setTwitterHandle(data.brand.twitterHandle || "");
              setInstagramHandle(data.brand.instagramHandle || "");
              setGithubHandle(data.brand.githubHandle || "");
              setYoutubeHandle(data.brand.youtubeHandle || "");
            }

            if (data.homepage) {
              setHeroEyebrow(data.homepage.heroEyebrow || "");
              setHeroHeadline(data.homepage.heroHeadline || "");
              setHeroSubheadline(data.homepage.heroSubheadline || "");
              setHeroDescription(data.homepage.heroDescription || "");
              setFeaturedProductSlug(data.homepage.featuredProductSlug || "");
              setAboutHeading(data.homepage.aboutHeading || "");
              setAboutText(data.homepage.aboutText || "");
              setGuaranteeText(data.homepage.guaranteeText || "100% Satisfaction Guarantee");
              setAccentColor(data.homepage.accentColor || data.brand?.accentColor || "#F59E0B");
              if (data.homepage.faqs && Array.isArray(data.homepage.faqs)) {
                setFaqs(data.homepage.faqs);
              }
            }

            if (data.manualPayment) {
              setPaymentIdentifier(data.manualPayment.paymentIdentifier || "");
              setPayeeName(data.manualPayment.payeeName || "");
              setQrImageUrl(data.manualPayment.qrImageUrl || "/images/payment-qr.svg");
              setPaymentInstructions(data.manualPayment.instructions || "");
            }
          }
        }

        if (productsRes.ok) {
          const p = await productsRes.json();
          setProducts(p.data || []);
        }
      } catch (err: unknown) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUploadFile = async (
    file: File,
    folder: "images" | "vault",
    onSuccess: (urlOrRef: string) => void,
    setLoadingState: (loading: boolean) => void
  ) => {
    setLoadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onSuccess(data.url || data.filename);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setLoadingState(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const payload: Partial<PlatformSettings> = {
      brand: {
        creatorName,
        avatarUrl,
        brandTagline,
        supportEmail,
        bio,
        twitterHandle,
        instagramHandle,
        githubHandle,
        youtubeHandle,
        accentColor,
      },
      homepage: {
        heroEyebrow,
        heroHeadline,
        heroSubheadline,
        heroDescription,
        aboutHeading,
        aboutText,
        featuredProductSlug,
        guaranteeText,
        accentColor,
        faqs,
      },
      manualPayment: {
        enabled: true,
        paymentIdentifier,
        payeeName,
        qrImageUrl,
        instructions: paymentInstructions,
        supportEmail,
      },
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-[#707082]">
        Loading settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B0B0E] tracking-tight">
            Control Center Settings
          </h1>
          <p className="text-sm text-[#707082]">
            Update your creator profile, public homepage copy, and manual payment configuration.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={saving}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> Settings updated successfully! The public website reflects these changes immediately.
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#7F1D1D] text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" /> {errorMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#E5E5EB] gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("website")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "website"
              ? "border-[#F59E0B] text-[#0B0B0E]"
              : "border-transparent text-[#707082] hover:text-[#0B0B0E]"
          }`}
        >
          <Layout className="w-4 h-4" /> Website Customization
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payment")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "payment"
              ? "border-[#F59E0B] text-[#0B0B0E]"
              : "border-transparent text-[#707082] hover:text-[#0B0B0E]"
          }`}
        >
          <QrCode className="w-4 h-4" /> Payment Settings (QR &amp; UPI)
        </button>
      </div>

      {/* ── TAB 1: WEBSITE CUSTOMIZATION ── */}
      {activeTab === "website" && (
        <div className="space-y-6">
          {/* Creator Profile */}
          <Card variant="bordered" padding="lg" className="bg-white space-y-5">
            <h2 className="text-base font-bold text-[#0B0B0E] border-b border-[#F2F2F5] pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#F59E0B]" /> Creator Identity
            </h2>

            {/* Profile Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-2">
                Creator Profile Photo
              </label>
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-full ring-2 ring-[#F59E0B] overflow-hidden bg-[#1E1E26] shrink-0">
                  <Image
                    src={avatarUrl || "/images/anubhav.png"}
                    alt="Creator Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E5EB] bg-[#FAFAFC] hover:bg-white text-xs font-semibold text-[#0B0B0E] cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{uploadingAvatar ? "Uploading..." : "Upload New Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadFile(
                            file,
                            "images",
                            (url) => setAvatarUrl(url),
                            setUploadingAvatar
                          );
                        }
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-[#707082]">
                    Renders across navigation, hero, about section, and footer.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Anubhav Bharti"
                required
              />

              <Input
                label="Tagline / Short Title"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                placeholder="AI Enthusiast, Web Developer & Digital Creator"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
                Creator Bio / Introduction
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of who you are and why you build digital products..."
                className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#F2F2F5]">
              <Input
                label="Contact & Support Email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="contact@anubhavbharti.dev"
              />

              <Input
                label="Instagram Handle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@vedxlabs"
              />

              <Input
                label="Twitter / 𝕏 Handle"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@vedxlabs"
              />

              <Input
                label="YouTube Channel"
                value={youtubeHandle}
                onChange={(e) => setYoutubeHandle(e.target.value)}
                placeholder="@vedxlabs"
              />

              <Input
                label="GitHub Handle"
                value={githubHandle}
                onChange={(e) => setGithubHandle(e.target.value)}
                placeholder="vedxlabs"
              />
            </div>
          </Card>

          {/* Hero Section Customization */}
          <Card variant="bordered" padding="lg" className="bg-white space-y-5">
            <h2 className="text-base font-bold text-[#0B0B0E] border-b border-[#F2F2F5] pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#F59E0B]" /> Hero Section
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Hero Eyebrow Pill"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                placeholder="A PRACTICAL GUIDE FOR BEGINNERS"
              />

              <Input
                label="Hero Supporting Subheadline"
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                placeholder="From Zero to Confident With AI"
              />
            </div>

            <Input
              label="Hero Main Headline"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              placeholder="Master AI in 28 Days"
              required
            />

            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
                Hero Description
              </label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="A practical, beginner-friendly roadmap to understand AI, use AI effectively and start building with it."
                className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
                Featured Product on Hero
              </label>
              <select
                value={featuredProductSlug}
                onChange={(e) => setFeaturedProductSlug(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#707082] mt-1">
                The hero section buy button and cover image will focus on this product.
              </p>
            </div>
          </Card>

          {/* About Section Content */}
          <Card variant="bordered" padding="lg" className="bg-white space-y-5">
            <h2 className="text-base font-bold text-[#0B0B0E] border-b border-[#F2F2F5] pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#F59E0B]" /> About Section Content
            </h2>

            <Input
              label="About Section Headline"
              value={aboutHeading}
              onChange={(e) => setAboutHeading(e.target.value)}
              placeholder="Building honest, practical tools for the new generation of creators."
            />

            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
                About Narrative / Creator Note
              </label>
              <textarea
                rows={4}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Personal background and why you created this digital guide..."
                className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </Card>

          {/* Brand Style & Trust Settings */}
          <Card variant="bordered" padding="lg" className="bg-white space-y-5">
            <h2 className="text-base font-bold text-[#0B0B0E] border-b border-[#F2F2F5] pb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#F59E0B]" /> Brand Accent &amp; Trust
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-2">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => setAccentColor(p.hex)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      accentColor.toLowerCase() === p.hex.toLowerCase()
                        ? "border-[#0B0B0E] bg-[#0B0B0E] text-white shadow-xs"
                        : "border-[#E5E5EB] bg-[#FAFAFC] text-[#4C4C5B] hover:bg-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 max-w-xs">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#E5E5EB] cursor-pointer"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#F59E0B"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#F2F2F5]">
              <Input
                label="Guarantee / Trust Text"
                value={guaranteeText}
                onChange={(e) => setGuaranteeText(e.target.value)}
                placeholder="100% Satisfaction Guarantee"
              />
            </div>

            {/* Dynamic FAQs Section */}
            <div className="pt-4 border-t border-[#F2F2F5] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#0B0B0E] uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Frequently Asked Questions (FAQs)
                  </h3>
                  <p className="text-xs text-[#707082] mt-0.5">
                    Manage the questions and answers shown in the FAQ section on your public landing page.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
                >
                  Add FAQ
                </Button>
              </div>

              {faqs.length === 0 ? (
                <div className="p-4 bg-[#FAFAFC] rounded-xl border border-dashed border-[#DCDCE5] text-center text-xs text-[#707082]">
                  Using default launch FAQs. Click &quot;Add FAQ&quot; above to customize your own questions and answers.
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-3.5 bg-[#FAFAFC] rounded-xl border border-[#E5E5EB] space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0B0B0E]">FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                          className="text-[#DC2626] hover:text-red-700 p-1 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      <Input
                        label="Question"
                        value={faq.q}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[idx].q = e.target.value;
                          setFaqs(updated);
                        }}
                        placeholder="e.g. How do I access the ebook after paying?"
                      />
                      <div>
                        <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
                          Answer
                        </label>
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].a = e.target.value;
                            setFaqs(updated);
                          }}
                          placeholder="e.g. You will receive direct instant delivery on this page..."
                          className="w-full px-3.5 py-2 text-xs bg-white border border-[#E5E5EB] rounded-xl text-[#0B0B0E] focus:outline-none focus:ring-2 focus:ring-[#0B0B0E]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 2: MANUAL PAYMENT ── */}
      {activeTab === "payment" && (
        <Card variant="bordered" padding="lg" className="bg-white space-y-6">
          <div className="border-b border-[#F2F2F5] pb-3">
            <h2 className="text-base font-bold text-[#0B0B0E] flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#F59E0B]" /> Manual Payment Workflow
            </h2>
            <p className="text-xs text-[#707082] mt-0.5">
              Customers scan your QR code or pay directly to your UPI ID, then submit their transaction reference and screenshot for your manual review.
            </p>
          </div>

          {/* QR Code Upload & Preview */}
          <div className="grid sm:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-2">
                Payment QR Code Image
              </label>
              <div className="p-4 bg-[#FAFAFC] rounded-2xl border border-[#E5E5EB] flex flex-col items-center justify-center space-y-3">
                <div className="relative w-44 h-44 bg-white p-2 rounded-xl border border-[#E5E5EB] shadow-2xs flex items-center justify-center overflow-hidden">
                  <Image
                    src={qrImageUrl || "/images/payment-qr.svg"}
                    alt="Payment QR Code"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>

                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E5EB] bg-white hover:bg-[#FAFAFC] text-xs font-semibold text-[#0B0B0E] cursor-pointer shadow-2xs transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{uploadingQR ? "Uploading QR..." : "Upload New QR Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadFile(
                          file,
                          "images",
                          (url) => setQrImageUrl(url),
                          setUploadingQR
                        );
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="UPI / Payment Identifier"
                value={paymentIdentifier}
                onChange={(e) => setPaymentIdentifier(e.target.value)}
                placeholder="anubhav@upi"
                hint="Provided to the customer with a 1-click copy button."
                required
              />

              <Input
                label="Payee / Account Name"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Anubhav Bharti"
                hint="Displayed so the customer verifies the beneficiary before sending."
                required
              />
            </div>
          </div>

          {/* Payment Instructions */}
          <div>
            <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
              Step-by-Step Customer Instructions
            </label>
            <textarea
              rows={5}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              placeholder="1. Scan QR code or enter UPI ID...&#10;2. Pay the exact amount...&#10;3. Copy the 12-digit UTR number and upload screenshot."
              className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-mono text-xs leading-relaxed"
            />
            <p className="text-[11px] text-[#707082] mt-1">
              Displayed on the payment page directly beside the QR code.
            </p>
          </div>
        </Card>
      )}
    </form>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#707082]">Loading settings...</div>}>
      <AdminSettingsContent />
    </Suspense>
  );
}
