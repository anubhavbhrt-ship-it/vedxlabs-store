import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price from paise to a display string.
 * @example formatPrice(9900) → "₹99"
 * @example formatPrice(49900) → "₹499"
 */
export function formatPrice(paise: number, currency = "INR"): string {
  const amount = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount percentage.
 * @example discountPercent(49900, 9900) → 80
 */
export function discountPercent(originalPaise: number, currentPaise: number): number {
  if (originalPaise <= 0) return 0;
  return Math.round(((originalPaise - currentPaise) / originalPaise) * 100);
}

/**
 * Slugify a string.
 * @example slugify("Master AI in 28 Days") → "master-ai-in-28-days"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/** Format a date string */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}
