/**
 * Desteklenen diller.
 *
 * Yeni dil eklemek icin: LOCALES'e slug ekleyin, LOCALE_META'ya bir satir
 * yazin ve src/i18n/messages/<slug>.ts dosyasini olusturun.
 */

export const LOCALES = ["tr", "en", "es", "de", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export type LocaleMeta = {
  /** Dil secicide gosterilen ad (kendi dilinde). */
  nativeLabel: string;
  /** Yonetim panelinde gosterilen Turkce ad. */
  adminLabel: string;
  /** <html dir> degeri. */
  dir: "ltr" | "rtl";
  /** Open Graph locale kodu. */
  ogLocale: string;
  /**
   * Intl API'lerine verilen tam etiket.
   * Arapca'da Latin rakamlari zorlanir (fiyatlar ve saatler okunakli kalsin).
   */
  intlTag: string;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  tr: {
    nativeLabel: "Türkçe",
    adminLabel: "Türkçe",
    dir: "ltr",
    ogLocale: "tr_TR",
    intlTag: "tr-TR",
  },
  en: {
    nativeLabel: "English",
    adminLabel: "İngilizce",
    dir: "ltr",
    ogLocale: "en_US",
    intlTag: "en-US",
  },
  es: {
    nativeLabel: "Español",
    adminLabel: "İspanyolca",
    dir: "ltr",
    ogLocale: "es_ES",
    intlTag: "es-ES",
  },
  de: {
    nativeLabel: "Deutsch",
    adminLabel: "Almanca",
    dir: "ltr",
    ogLocale: "de_DE",
    intlTag: "de-DE",
  },
  ar: {
    nativeLabel: "العربية",
    adminLabel: "Arapça",
    dir: "rtl",
    ogLocale: "ar_AR",
    intlTag: "ar-u-nu-latn",
  },
};

export const DEFAULT_LOCALE: Locale = (() => {
  const raw = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim();
  return isLocale(raw) ? raw : "tr";
})();

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return LOCALE_META[locale].dir;
}

/** Accept-Language basligindan en uygun dili secer. */
export function pickLocale(
  acceptLanguage: string | null,
  enabled: readonly Locale[],
): Locale {
  const pool = enabled.length > 0 ? enabled : [DEFAULT_LOCALE];
  if (!acceptLanguage) return pool[0] as Locale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q) : 1 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0] ?? "";
    const match = pool.find((locale) => locale === base);
    if (match) return match;
  }

  return pool[0] as Locale;
}
