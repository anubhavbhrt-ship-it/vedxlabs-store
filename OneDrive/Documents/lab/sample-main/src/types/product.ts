/**
 * Product — the core reusable entity of the storefront.
 * Fully decoupled data structure supporting any digital product, ebook, template, or course.
 */

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description?: string;
  lessons?: string[];
  day?: number;
}

export interface ProductMetadata {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  tags?: string[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  /** Backward-compatible alias */
  tagline?: string;
  fullDescription: string;
  /** Backward-compatible alias */
  description?: string;
  /** Price in paise (INR × 100). e.g. ₹99 = 9900 */
  price: number;
  /** Original (crossed-out) price in paise */
  originalPrice?: number;
  coverImage: string;
  galleryImages?: string[];
  category: "Guide" | "Course" | "Template" | "Prompt Pack" | "Blueprint";
  features: string[];
  whatsIncluded: string[];
  /** Reference identifier or file asset key for digital delivery */
  fileReference: string;
  curriculum?: CurriculumModule[];
  faqs?: ProductFAQ[];
  isPublished: boolean;
  isFeatured: boolean;
  metadata?: ProductMetadata;
  createdAt: string;
  updatedAt: string;
}

/** Lightweight summary used for listing cards & grids */
export interface ProductCard {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  category: string;
  features?: string[];
  isFeatured: boolean;
  isPublished: boolean;
}
