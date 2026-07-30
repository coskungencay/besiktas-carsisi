import { LOCALE_META, type Locale } from "@/i18n/config";

/** Yonetim panelinde (her zaman Turkce) kullanilan gun adlari. */
export const DAY_LABELS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
] as const;

/** JSON-LD schema.org gun adlari (index = dayOfWeek). */
export const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const priceFormatters = new Map<string, Intl.NumberFormat>();

function priceFormatter(locale: Locale): Intl.NumberFormat {
  const tag = LOCALE_META[locale].intlTag;
  let formatter = priceFormatters.get(tag);
  if (!formatter) {
    formatter = new Intl.NumberFormat(tag, {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    priceFormatters.set(tag, formatter);
  }
  return formatter;
}

export function formatPrice(value: number, locale: Locale = "tr"): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return priceFormatter(locale).format(value);
}

const dayLabelCache = new Map<string, string>();

/**
 * Gun adini Intl ile uretir — 7 gun x 5 dil elle yazilmaz, dil eklemek bedava.
 * 2024-01-07 bir Pazar gunudur; dayOfWeek 0 = Pazar.
 */
export function dayLabel(dayOfWeek: number, locale: Locale): string {
  const key = `${locale}:${dayOfWeek}`;
  const cached = dayLabelCache.get(key);
  if (cached) return cached;

  const date = new Date(Date.UTC(2024, 0, 7 + dayOfWeek));
  const raw = new Intl.DateTimeFormat(LOCALE_META[locale].intlTag, {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);

  // Bazi diller gun adini kucuk harfle uretir (orn. es: "lunes").
  const label = raw.charAt(0).toLocaleUpperCase(locale) + raw.slice(1);
  dayLabelCache.set(key, label);
  return label;
}

const dateTimeFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

export function formatDateTime(value: Date | number): string {
  const date = value instanceof Date ? value : new Date(value * 1000);
  return dateTimeFormatter.format(date);
}

/** "+90 555 111 22 33" -> "tel:+905551112233" */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

/** WhatsApp numarasini wa.me linkine cevirir (Turkiye varsayilan +90). */
export function whatsappHref(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10) digits = `90${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

/** "@kahveci" / tam URL / "kahveci" -> kullanici adi */
export function instagramHandle(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const fromUrl = trimmed.match(/instagram\.com\/([^/?#]+)/i);
  return (fromUrl?.[1] ?? trimmed).replace(/^@/, "").replace(/\/+$/, "");
}

export function instagramHref(handle: string): string {
  return handle ? `https://instagram.com/${handle}` : "";
}

/** "/api/uploads/abc.webp" -> "/api/uploads/abc.thumb.webp" */
export function thumbUrl(url: string): string {
  if (!url) return "";
  if (!url.startsWith("/api/uploads/")) return url;
  return url.replace(/\.webp$/, ".thumb.webp");
}

/**
 * Tam adresten kisa yer bilgisi cikarir.
 * "Örnek Mah., Kahve Sok. No:12, Kadıköy / İstanbul" -> "Kadıköy / İstanbul"
 */
export function localityFrom(address: string): string {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  return parts.slice(-1)[0] ?? "";
}
