import type { PlatformSettings } from "@/types/settings";
import { loadJsonFile, getPersistentData, setPersistentData } from "./storage";

const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS: PlatformSettings = {
  brand: {
    creatorName: "Anubhav Bharti",
    avatarUrl: "/images/anubhav.png",
    brandTagline: "AI Enthusiast, Web Developer & Digital Creator",
    supportEmail: "contact@anubhavbharti.dev",
    bio: "Building practical AI guides, production toolkits, and modern web products. Helping learners across India master AI workflows.",
    location: "India",
    twitterHandle: "@vedxlabs",
    instagramHandle: "@vedxlabs",
    githubHandle: "vedxlabs",
    youtubeHandle: "@vedxlabs",
    accentColor: "#F59E0B",
  },
  homepage: {
    heroEyebrow: "A PRACTICAL GUIDE FOR BEGINNERS",
    heroHeadline: "Master AI in 28 Days",
    heroSubheadline: "From Zero to Confident With AI",
    heroDescription: "A practical, beginner-friendly roadmap to understand AI, use AI effectively and start building with it.",
    aboutHeading: "Building honest, practical tools for the new generation of creators.",
    aboutText: "I created Master AI in 28 Days as the practical, honest manual I wished existed: zero gatekeeping, tested prompts, clear frameworks, and affordable for every learner at just ₹99.",
    featuredProductSlug: "master-ai-in-28-days",
    guaranteeText: "100% Satisfaction Guarantee",
    accentColor: "#F59E0B",
    faqs: [
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
    ],
  },
  manualPayment: {
    enabled: true,
    paymentIdentifier: "anubhav@upi",
    payeeName: "Anubhav Bharti",
    qrImageUrl: "/images/payment-qr.svg",
    instructions:
      "1. Open any UPI application (Google Pay, PhonePe, Paytm, CRED, BHIM).\n2. Scan the QR code or enter the UPI ID provided.\n3. Verify the recipient name matches 'Anubhav Bharti'.\n4. Pay the exact order amount.\n5. Copy the 12-digit UPI Reference / UTR Number, upload the confirmation screenshot, and click 'I've completed payment'.",
    supportEmail: "contact@anubhavbharti.dev",
  },
  updatedAt: new Date().toISOString(),
};

function mergeSettings(loaded: Partial<PlatformSettings>): PlatformSettings {
  return {
    brand: { ...DEFAULT_SETTINGS.brand, ...(loaded.brand || {}) },
    homepage: { ...DEFAULT_SETTINGS.homepage, ...(loaded.homepage || {}) },
    manualPayment: { ...DEFAULT_SETTINGS.manualPayment, ...(loaded.manualPayment || {}) },
    updatedAt: loaded.updatedAt || DEFAULT_SETTINGS.updatedAt,
  };
}

// In-memory cache for fast response times
const globalForSettings = globalThis as unknown as { __SETTINGS_STORE__?: PlatformSettings };
if (!globalForSettings.__SETTINGS_STORE__) {
  const raw = loadJsonFile<Partial<PlatformSettings>>("settings.json", { ...DEFAULT_SETTINGS });
  globalForSettings.__SETTINGS_STORE__ = mergeSettings(raw);
}

/** Get current platform, homepage, and manual payment settings */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  // Read through persistent adapter (handles Redis/KV or fallback disk)
  const persisted = await getPersistentData<Partial<PlatformSettings>>(SETTINGS_KEY, DEFAULT_SETTINGS);
  const merged = mergeSettings(persisted);
  globalForSettings.__SETTINGS_STORE__ = merged;
  return merged;
}

/** Update platform settings */
export async function updatePlatformSettings(
  partial: Partial<PlatformSettings>
): Promise<PlatformSettings> {
  const current = await getPlatformSettings();
  const updated: PlatformSettings = {
    brand: {
      ...current.brand,
      ...(partial.brand || {}),
    },
    homepage: {
      ...current.homepage,
      ...(partial.homepage || {}),
    },
    manualPayment: {
      ...current.manualPayment,
      ...(partial.manualPayment || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  globalForSettings.__SETTINGS_STORE__ = updated;
  await setPersistentData(SETTINGS_KEY, updated);
  return updated;
}
