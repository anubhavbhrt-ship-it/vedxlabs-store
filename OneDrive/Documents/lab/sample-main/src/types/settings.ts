export interface ManualPaymentSettings {
  enabled: boolean;
  paymentIdentifier: string;
  payeeName: string;
  qrImageUrl: string;
  instructions: string;
  supportEmail?: string;
}

export interface BrandSettings {
  creatorName: string;
  avatarUrl: string;
  brandTagline: string;
  supportEmail: string;
  bio: string;
  location?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  githubHandle?: string;
  youtubeHandle?: string;
  accentColor?: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface HomepageContentSettings {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  aboutHeading?: string;
  aboutText?: string;
  featuredProductSlug: string;
  guaranteeText: string;
  accentColor?: string;
  faqs?: FAQItem[];
}

export interface PlatformSettings {
  brand: BrandSettings;
  homepage: HomepageContentSettings;
  manualPayment: ManualPaymentSettings;
  updatedAt?: string;
}
