import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getPersistentData, setPersistentData } from "./storage";

export const ADMIN_COOKIE_NAME = "vedx_admin_token";

// Sole authorized admin email
export const AUTHORIZED_ADMIN_EMAIL = "anubhavbhrt@gmail.com";

const ADMIN_AUTH_KEY = "admin_auth";

// Path to persistent admin credentials hash file
const AUTH_STORE_PATH = path.join(process.cwd(), "data", ".admin_auth.json");

/**
 * In-memory failed login attempts tracker for rate limiting.
 * Key: IP or identifier, Value: { count: number, resetAt: number }
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const failedAttempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if a client IP/identifier is rate limited.
 */
export function checkRateLimit(clientId: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = failedAttempts.get(clientId);

  if (!record) {
    return { limited: false };
  }

  if (now > record.resetAt) {
    failedAttempts.delete(clientId);
    return { limited: false };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { limited: true, retryAfterSeconds };
  }

  return { limited: false };
}

/**
 * Register a failed login attempt for rate limiting.
 */
export function recordFailedAttempt(clientId: string): void {
  const now = Date.now();
  const record = failedAttempts.get(clientId);

  if (!record || now > record.resetAt) {
    failedAttempts.set(clientId, {
      count: 1,
      resetAt: now + LOCKOUT_WINDOW_MS,
    });
  } else {
    record.count += 1;
  }
}

/**
 * Clear rate limit on successful authentication.
 */
export function clearRateLimit(clientId: string): void {
  failedAttempts.delete(clientId);
}

/**
 * Strong password hashing using Node.js crypto.scryptSync with 16-byte cryptographically random salt.
 * Stored format: `${saltHex}:${hashHex}`
 */
export function hashPassword(password: string, saltHex?: string): string {
  const salt = saltHex ? Buffer.from(saltHex, "hex") : crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored `salt:hash` string using constant-time comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;
    const [saltHex, expectedHashHex] = parts;
    const salt = Buffer.from(saltHex, "hex");
    const expectedHash = Buffer.from(expectedHashHex, "hex");

    const derivedKey = crypto.scryptSync(password, salt, 64);
    if (derivedKey.length !== expectedHash.length) return false;
    return crypto.timingSafeEqual(derivedKey, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Retrieve the current configured admin credentials hash.
 * Priority:
 * 1. process.env.ADMIN_PASSWORD_HASH (e.g. from Render or .env)
 * 2. process.env.ADMIN_PASSWORD (if set as plaintext in env, auto-hashed with salted scrypt)
 * 3. data/.admin_auth.json (set via secure first-run setup)
 */
/**
 * Retrieve the current configured admin credentials hash.
 * Priority:
 * 1. process.env.ADMIN_PASSWORD_HASH (e.g. from Render or .env)
 * 2. process.env.ADMIN_PASSWORD (if set as plaintext in env, auto-hashed with salted scrypt)
 * 3. Persistent Redis / Vercel KV store (ADMIN_AUTH_KEY)
 * 4. data/.admin_auth.json (set via secure first-run setup)
 */
export async function getStoredAdminAuthAsync(): Promise<{ email: string; passwordHash: string } | null> {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return {
      email: AUTHORIZED_ADMIN_EMAIL,
      passwordHash: process.env.ADMIN_PASSWORD_HASH.trim(),
    };
  }

  if (process.env.ADMIN_PASSWORD) {
    return {
      email: AUTHORIZED_ADMIN_EMAIL,
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD.trim(), "a1b2c3d4e5f60718293a4b5c6d7e8f90"),
    };
  }

  // Check persistent storage (Upstash Redis or local JSON fallback)
  const stored = await getPersistentData<{ email: string; passwordHash: string } | null>(ADMIN_AUTH_KEY, null);
  if (stored && stored.email && stored.passwordHash) {
    return stored;
  }

  // Fallback to local file if exists
  if (fs.existsSync(AUTH_STORE_PATH)) {
    try {
      const content = fs.readFileSync(AUTH_STORE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed.email && parsed.passwordHash) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function getStoredAdminAuth(): { email: string; passwordHash: string } | null {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return {
      email: AUTHORIZED_ADMIN_EMAIL,
      passwordHash: process.env.ADMIN_PASSWORD_HASH.trim(),
    };
  }

  if (process.env.ADMIN_PASSWORD) {
    return {
      email: AUTHORIZED_ADMIN_EMAIL,
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD.trim(), "a1b2c3d4e5f60718293a4b5c6d7e8f90"),
    };
  }

  if (fs.existsSync(AUTH_STORE_PATH)) {
    try {
      const content = fs.readFileSync(AUTH_STORE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed.email && parsed.passwordHash) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Check if the admin account has an initialized password.
 */
export async function isAdminSetupRequired(): Promise<boolean> {
  const auth = await getStoredAdminAuthAsync();
  return auth === null;
}

/**
 * Securely set initial admin password (or change password) and persist the salted hash.
 */
export async function setAdminPassword(newPassword: string): Promise<boolean> {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const passwordHash = hashPassword(newPassword);
  const data = {
    email: AUTHORIZED_ADMIN_EMAIL,
    passwordHash,
    updatedAt: new Date().toISOString(),
  };

  // Persist to Upstash Redis / Vercel KV and disk
  await setPersistentData(ADMIN_AUTH_KEY, data);

  try {
    const dataDir = path.dirname(AUTH_STORE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(AUTH_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Disk write may be skipped in read-only serverless environments
  }

  return true;
}

/**
 * Generate a cryptographically secure session token.
 */
export function generateAdminSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "vedxlabs_admin_super_secret_session_key_2026";
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}:${random}:${AUTHORIZED_ADMIN_EMAIL}`)
    .digest("hex");
  return `vdx_${timestamp}_${random}_${signature}`;
}

/**
 * Verify a session token.
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token || !token.startsWith("vdx_")) return false;
  try {
    const parts = token.split("_");
    if (parts.length !== 4) return false;
    const [, timestamp, random, signature] = parts;
    const secret = process.env.ADMIN_SESSION_SECRET || "vedxlabs_admin_super_secret_session_key_2026";
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}:${random}:${AUTHORIZED_ADMIN_EMAIL}`)
      .digest("hex");

    if (signature !== expected) return false;

    // Check expiration (30 days)
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 30 * 24 * 60 * 60 * 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Authenticates admin credentials.
 * - Only anubhavbhrt@gmail.com is authorized.
 * - Verifies salted scrypt hash.
 */
export async function validateAdminCredentialsAsync(email?: string, password?: string): Promise<boolean> {
  if (!email || !password) return false;

  // Sole authorized admin check
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return false;
  }

  const stored = await getStoredAdminAuthAsync();
  if (!stored) {
    return false;
  }

  return verifyPassword(password, stored.passwordHash);
}

export function validateAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return false;
  }

  const stored = getStoredAdminAuth();
  if (!stored) {
    return false;
  }

  return verifyPassword(password, stored.passwordHash);
}

/**
 * Server Component / API Route auth checker using Next.js cookies()
 */
export async function isServerAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!token?.value) return false;
    return verifyAdminSessionToken(token.value);
  } catch {
    return false;
  }
}

/**
 * Request auth checker for Middleware or Request objects
 */
export function isRequestAdminAuthenticated(request: NextRequest | Request): boolean {
  try {
    let tokenValue = "";
    if ("cookies" in request && typeof request.cookies.get === "function") {
      const token = request.cookies.get(ADMIN_COOKIE_NAME);
      tokenValue = token?.value || "";
    } else {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
      if (match) tokenValue = match[1];
    }

    if (!tokenValue) return false;
    return verifyAdminSessionToken(tokenValue);
  } catch {
    return false;
  }
}
