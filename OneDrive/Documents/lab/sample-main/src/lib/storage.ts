import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const DATA_DIR = path.join(process.cwd(), "data");

// Detect Upstash Redis or Vercel KV environment variables
const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL;

const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN;

let redisClient: Redis | null = null;
if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  } catch (err) {
    console.error("[STORAGE_ADAPTER] Redis initialization error:", err);
  }
}

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // In serverless environments fs.mkdirSync may fail if read-only
    }
  }
}

/**
 * Synchronous local disk read for cold initializations.
 */
export function loadJsonFile<T>(filename: string, fallbackData: T): T {
  try {
    ensureDirectoryExists();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return fallbackData;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    return fallbackData;
  }
}

/**
 * Synchronous local disk write.
 */
export function saveJsonFile<T>(filename: string, data: T): void {
  try {
    ensureDirectoryExists();
    const filePath = path.join(DATA_DIR, filename);
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    // In serverless, local write can silently fail or be skipped if Redis is primary
  }
}

/**
 * Async Universal Storage Reader:
 * First checks Upstash Redis / Vercel KV if connected, falls back to local disk / default data.
 */
export async function getPersistentData<T>(key: string, fallbackData: T): Promise<T> {
  const filename = key.endsWith(".json") ? key : `${key}.json`;

  if (redisClient) {
    try {
      const data = await redisClient.get<T>(key);
      if (data !== null && data !== undefined) {
        return data;
      }
    } catch (err) {
      console.error(`[STORAGE_ADAPTER] Redis read error for ${key}:`, err);
    }
  }

  // Fallback to disk
  return loadJsonFile<T>(filename, fallbackData);
}

/**
 * Async Universal Storage Writer:
 * Persists data to Upstash Redis / Vercel KV and to local disk.
 */
export async function setPersistentData<T>(key: string, data: T): Promise<void> {
  const filename = key.endsWith(".json") ? key : `${key}.json`;

  // Always write to local disk (for dev & Render persistent volume)
  saveJsonFile<T>(filename, data);

  // Write to Upstash Redis / Vercel KV if available (for Vercel serverless)
  if (redisClient) {
    try {
      await redisClient.set(key, data);
    } catch (err) {
      console.error(`[STORAGE_ADAPTER] Redis write error for ${key}:`, err);
    }
  }
}

/**
 * Helper to check whether cloud storage is active
 */
export function isCloudStorageEnabled(): boolean {
  return redisClient !== null;
}
