import "server-only";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { rateLimits } from "@/db/schema";

const WINDOW_SECONDS = 60 * 60; // 1 saat

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Pencerenin sifirlanacagi epoch saniye. */
  resetAt: number;
};

/**
 * Sabit pencereli sayac. Tek container/tek SQLite dosyasi varsayimiyla
 * calisir ve restart'a dayaniklidir (bellek yerine DB'de tutulur).
 */
export function hit(bucket: string, limit: number): RateLimitResult {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % WINDOW_SECONDS);

  const result = db.transaction((tx) => {
    const existing = tx
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.bucket, bucket))
      .get();

    // Yeni pencere: sayaci sifirla.
    if (!existing || existing.windowStart !== windowStart) {
      tx.insert(rateLimits)
        .values({ bucket, hits: 1, windowStart })
        .onConflictDoUpdate({
          target: rateLimits.bucket,
          set: { hits: 1, windowStart },
        })
        .run();
      return { allowed: true, used: 1 };
    }

    // Limit dolmus: sayaci daha fazla artirma, sadece reddet.
    if (existing.hits >= limit) {
      return { allowed: false, used: existing.hits };
    }

    tx.update(rateLimits)
      .set({ hits: sql`${rateLimits.hits} + 1` })
      .where(eq(rateLimits.bucket, bucket))
      .run();
    return { allowed: true, used: existing.hits + 1 };
  });

  return {
    allowed: result.allowed,
    remaining: Math.max(0, limit - result.used),
    resetAt: windowStart + WINDOW_SECONDS,
  };
}

/** Reverse proxy (Traefik) arkasindaki gercek istemci IP'si. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Eski pencerelerin kayitlarini temizler (gunluk calistirmak yeterli). */
export function pruneRateLimits(): void {
  const cutoff = Math.floor(Date.now() / 1000) - WINDOW_SECONDS * 24;
  db.delete(rateLimits).where(sql`${rateLimits.windowStart} < ${cutoff}`).run();
}
