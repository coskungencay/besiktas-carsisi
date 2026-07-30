/**
 * Ortam degiskenlerinin tek okuma noktasi.
 * Hicbir env eksikse uygulama patlamamali; makul varsayilanlara duser.
 */

export const IS_PROD = process.env.NODE_ENV === "production";

/**
 * `next build` sirasinda NODE_ENV zaten "production" olur ama calisma
 * ortaminin gizli anahtarlari HENUZ yoktur (ve olmamalidir — imaja sir gomulmez).
 * Bu yuzden "zorunlu env" kontrolleri build asamasinda atlanir, container
 * ayaga kalkarken ilk import'ta uygulanir.
 */
const IS_BUILD_PHASE = process.env.NEXT_PHASE === "phase-production-build";

export function appUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.BETTER_AUTH_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function uploadsDir(): string {
  return process.env.UPLOADS_DIR?.trim() || "./data/uploads";
}

export function authSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;

  if (IS_PROD && !IS_BUILD_PHASE) {
    throw new Error(
      "BETTER_AUTH_SECRET tanimli degil (en az 16 karakter olmali). .env dosyanizi kontrol edin.",
    );
  }

  if (IS_BUILD_PHASE) {
    // Build ciktisina gomulmez; container calisirken gercek deger okunur.
    return "build-phase-placeholder-secret-not-used-at-runtime";
  }

  return "development-only-insecure-secret-change-me";
}

export function contactRateLimitPerHour(): number {
  const parsed = Number.parseInt(
    process.env.CONTACT_RATE_LIMIT_PER_HOUR ?? "",
    10,
  );
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
};

/** SMTP env'i eksikse null doner; bu durumda mail gonderimi sessizce atlanir. */
export function smtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!host || !to) return null;

  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10) || 587;
  return {
    host,
    port,
    secure: port === 465,
    user: process.env.SMTP_USER?.trim() || undefined,
    pass: process.env.SMTP_PASSWORD?.trim() || undefined,
    from: process.env.SMTP_FROM?.trim() || `no-reply@${host}`,
    to,
  };
}
