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

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return priceFormatter.format(value);
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
