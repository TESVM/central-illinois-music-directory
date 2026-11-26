import "server-only";
import { headers } from "next/headers";

/**
 * Rate limiting for the public submission endpoints.
 *
 * Every form on this site triggers an outbound email, and none of them require
 * an account. Without a limit, one script can empty the Resend monthly quota
 * and bury real enquiries in the owner's inbox.
 *
 * Two backends:
 *
 *  - **Upstash Redis** over its REST API when `UPSTASH_REDIS_REST_URL` and
 *    `UPSTASH_REDIS_REST_TOKEN` are set. This is the correct production
 *    choice, because Vercel runs many instances and a per-instance counter
 *    does not actually limit anything.
 *  - **In-memory**, per instance, otherwise. It is a real limit for a single
 *    instance and a speed bump across several. It is a fallback, not a
 *    substitute; `rateLimitBackend()` reports which one is live so this is
 *    never silently assumed to be stronger than it is.
 *
 * Fails open: if the limiter itself errors, the submission proceeds. Losing a
 * genuine enquiry is worse than allowing an extra request.
 */

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the caller may retry. Zero when allowed. */
  retryAfterSeconds: number;
  backend: "upstash" | "memory";
};

type Bucket = { count: number; resetAt: number };

// Module scope survives between invocations on a warm instance.
const memoryBuckets = new Map<string, Bucket>();

function upstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function rateLimitBackend(): "upstash" | "memory" {
  return upstashConfig() ? "upstash" : "memory";
}

/**
 * Best-effort client identifier. Vercel sets `x-forwarded-for`; the left-most
 * entry is the client. Falls back to a constant so a missing header produces
 * one shared bucket rather than an unlimited free pass.
 */
export async function clientKey(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]!.trim();
    return h.get("x-real-ip") ?? "unknown-client";
  } catch {
    return "unknown-client";
  }
}

async function upstashIncrement(key: string, windowSeconds: number) {
  const cfg = upstashConfig()!;
  // Pipeline INCR + EXPIRE(NX) so the window starts on the first hit and the
  // key cannot live forever if a later call fails.
  const response = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSeconds), "NX"],
      ["TTL", key]
    ]),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`upstash ${response.status}`);

  const payload = (await response.json()) as Array<{ result: number }>;
  return { count: Number(payload[0]?.result ?? 0), ttl: Number(payload[2]?.result ?? windowSeconds) };
}

function memoryIncrement(key: string, windowSeconds: number) {
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + windowSeconds * 1000 };
    memoryBuckets.set(key, bucket);
    // Opportunistic cleanup so the map cannot grow without bound.
    if (memoryBuckets.size > 5000) {
      for (const [k, v] of memoryBuckets) if (v.resetAt <= now) memoryBuckets.delete(k);
    }
    return { count: 1, ttl: windowSeconds };
  }

  existing.count += 1;
  return { count: existing.count, ttl: Math.ceil((existing.resetAt - now) / 1000) };
}

export async function checkRateLimit(
  action: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number }
): Promise<RateLimitResult> {
  const backend = rateLimitBackend();
  const key = `ratelimit:${action}:${await clientKey()}`;

  try {
    const { count, ttl } = backend === "upstash"
      ? await upstashIncrement(key, windowSeconds)
      : memoryIncrement(key, windowSeconds);

    return count > limit
      ? { allowed: false, retryAfterSeconds: Math.max(ttl, 1), backend }
      : { allowed: true, retryAfterSeconds: 0, backend };
  } catch (error) {
    console.error("[rate-limit] check failed, allowing request", error);
    return { allowed: true, retryAfterSeconds: 0, backend };
  }
}

/** Human-readable wait, for the message shown to a limited user. */
export function describeRetry(seconds: number): string {
  if (seconds <= 90) return `${Math.max(seconds, 1)} seconds`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
