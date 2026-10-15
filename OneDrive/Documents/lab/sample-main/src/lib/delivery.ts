import crypto from "crypto";
import path from "path";
import fs from "fs";
import type { Order } from "@/types/order";
import { getProductBySlug } from "./products";

// Dedicated server directory for digital product files
// Outside of /public so files are NEVER directly accessible via HTTP URL
const VAULT_DIR = path.join(process.cwd(), "vault");

export interface DeliveryPackage {
  orderId: string;
  productTitle: string;
  productSlug: string;
  customerEmail: string;
  customerName: string;
  token: string;
  downloadUrl: string;
  confirmationUrl: string;
  filename: string;
  fileSizeBytes: number;
  unlockedAt: string;
  deliveryMethod: "instant_download" | "email_dispatch";
}

/**
 * Generate a cryptographically secure, high-entropy download token.
 */
export function generateDeliveryToken(orderId: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha256", process.env.DELIVERY_SECRET || "vedxlabs_secret_delivery_key_2026")
    .update(`${orderId}:${salt}:${Date.now()}`)
    .digest("hex");
  return `dl_${hash.slice(0, 32)}`;
}

/**
 * Locate digital file path within the secure server vault.
 */
export function resolveVaultFile(fileReference: string): {
  filePath: string;
  exists: boolean;
  filename: string;
  size: number;
} {
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }

  const sanitized = path.basename(fileReference || "guide.pdf");
  const filePath = path.join(VAULT_DIR, sanitized);
  const exists = fs.existsSync(filePath);

  let size = 0;
  if (exists) {
    const stats = fs.statSync(filePath);
    size = stats.size;
  }

  return { filePath, exists, filename: sanitized, size };
}

/**
 * Prepare a complete Delivery Package for a confirmed order.
 */
export async function buildDeliveryPackage(order: Order): Promise<DeliveryPackage> {
  const product = await getProductBySlug(order.productSlug);
  const fileRef = product?.fileReference || `${order.productSlug}.pdf`;
  const vault = resolveVaultFile(fileRef);

  const token = order.downloadToken || generateDeliveryToken(order.id);

  return {
    orderId: order.id,
    productTitle: order.productTitle,
    productSlug: order.productSlug,
    customerEmail: order.customerEmail,
    customerName: order.customerName || "Customer",
    token,
    downloadUrl: `/api/delivery/${token}`,
    confirmationUrl: `/order/confirmed/${order.id}`,
    filename: vault.filename,
    fileSizeBytes: vault.size,
    unlockedAt: new Date().toISOString(),
    deliveryMethod: "instant_download",
  };
}

/**
 * Pluggable Email Dispatch Provider Interface.
 * Prepared for Resend, SendGrid, Amazon SES, or Nodemailer integration.
 */
export interface EmailDeliveryResult {
  sent: boolean;
  provider: "mock" | "resend" | "smtp";
  recipient: string;
  messageId: string;
  sentAt: string;
}

export async function dispatchDeliveryEmail(
  order: Order,
  deliveryPkg: DeliveryPackage
): Promise<EmailDeliveryResult> {
  // In production, when EMAIL_PROVIDER_API_KEY is configured, this will call the provider SDK.
  // Currently modular & logs clean transaction receipt.
  console.log(`[DELIVERY_EMAIL] Queueing fulfillment notification for: ${order.customerEmail}`);
  console.log(`[DELIVERY_EMAIL] Order: ${order.id} | Product: ${order.productTitle}`);
  console.log(`[DELIVERY_EMAIL] Secure Download Link: ${deliveryPkg.downloadUrl}`);

  return {
    sent: true,
    provider: "mock",
    recipient: order.customerEmail,
    messageId: `msg_${crypto.randomBytes(8).toString("hex")}`,
    sentAt: new Date().toISOString(),
  };
}
