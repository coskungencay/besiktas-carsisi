import "server-only";

import { asc, eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "@/db";
import {
  faqs,
  galleryImages,
  menuCategories,
  menuItems,
  openingHours,
  siteSettings,
  testimonials,
  translations,
  type SiteSettingsRow,
  type TranslationNamespace,
} from "@/db/schema";
import { getMessages } from "@/i18n";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  LOCALES,
  isLocale,
  type Locale,
} from "@/i18n/config";
import {
  dayLabel,
  formatPrice,
  instagramHandle,
  instagramHref,
  localityFrom,
  telHref,
  thumbUrl,
  whatsappHref,
} from "@/lib/format";
import { SOCIAL_PLATFORMS } from "@/lib/social";
import { normalizeHiddenSections } from "@/lib/sections";
import { MAX_HIGHLIGHTS } from "@/lib/validators";
import { resolveThemeSlug } from "@/themes/registry";
import type { LocaleOption, SiteContent } from "@/themes/types";

const EMPTY_SETTINGS: SiteSettingsRow = {
  id: SINGLETON_ID,
  name: "İşletme Adı",
  tagline: "",
  about: "",
  heroHeadline: "",
  heroSubline: "",
  highlights: [],
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  lat: null,
  lng: null,
  mapsUrl: "",
  instagram: "",
  logoUrl: "",
  heroImageUrl: "",
  brandColors: {},
  themeSlug: "placeholder",
  enabledLocales: [],
  announcement: "",
  socialLinks: [],
  hiddenSections: [],
  updatedAt: new Date(0),
};

/** site_settings tekil satirini getirir; yoksa olusturur. */
export function getSettings(): SiteSettingsRow {
  const row = db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();

  if (row) return row;

  const inserted = db
    .insert(siteSettings)
    .values({ ...EMPTY_SETTINGS, updatedAt: new Date() })
    .onConflictDoNothing()
    .returning()
    .get();

  return inserted ?? EMPTY_SETTINGS;
}

/* -------------------------------------------------------------------------- */
/*                                   Diller                                    */
/* -------------------------------------------------------------------------- */

/**
 * Sitede acik olan diller. Ilk eleman varsayilan dildir.
 * Panelde hic dil secilmemisse yalnizca varsayilan dil aciktir.
 */
export function getEnabledLocales(settings?: SiteSettingsRow): Locale[] {
  const raw = (settings ?? getSettings()).enabledLocales;
  const cleaned = Array.isArray(raw) ? raw.filter(isLocale) : [];

  if (cleaned.length === 0) return [DEFAULT_LOCALE];

  // Varsayilan dil her zaman acik ve her zaman ilk sirada olmali.
  const ordered = [
    DEFAULT_LOCALE,
    ...LOCALES.filter((l) => l !== DEFAULT_LOCALE && cleaned.includes(l)),
  ];
  return ordered;
}

export function isLocaleEnabled(locale: string): locale is Locale {
  return isLocale(locale) && getEnabledLocales().includes(locale);
}

/* -------------------------------------------------------------------------- */
/*                                  Ceviriler                                  */
/* -------------------------------------------------------------------------- */

type TranslationMap = Map<string, string>;

function translationKey(
  namespace: TranslationNamespace,
  refId: number,
  field: string,
): string {
  return `${namespace}:${refId}:${field}`;
}

/** Bir dile ait tum cevirileri tek sorguda okur. */
export function getTranslations(locale: Locale): TranslationMap {
  const map: TranslationMap = new Map();
  if (locale === DEFAULT_LOCALE) return map;

  const rows = db
    .select()
    .from(translations)
    .where(eq(translations.locale, locale))
    .all();

  for (const row of rows) {
    if (row.value.trim().length === 0) continue;
    map.set(
      translationKey(row.namespace as TranslationNamespace, row.refId, row.field),
      row.value,
    );
  }
  return map;
}

/** Ceviri varsa onu, yoksa varsayilan dildeki asil degeri dondurur. */
function tr(
  map: TranslationMap,
  namespace: TranslationNamespace,
  refId: number,
  field: string,
  fallback: string,
): string {
  return map.get(translationKey(namespace, refId, field)) ?? fallback;
}

/* -------------------------------------------------------------------------- */
/*                                DB okuyuculari                               */
/* -------------------------------------------------------------------------- */

export function getOpeningHours() {
  return db
    .select()
    .from(openingHours)
    .orderBy(asc(openingHours.dayOfWeek))
    .all();
}

export function getMenuCategories() {
  return db
    .select()
    .from(menuCategories)
    .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.id))
    .all();
}

export function getMenuItems() {
  return db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.id))
    .all();
}

export function getTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id))
    .all();
}

export function getFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.isActive, true))
    .orderBy(asc(faqs.sortOrder), asc(faqs.id))
    .all();
}

export function getGalleryImages() {
  return db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id))
    .all();
}

/* -------------------------------------------------------------------------- */
/*                          Temalarin gordugu tek veri                         */
/* -------------------------------------------------------------------------- */

/**
 * DB satirlarini sunuma hazir SiteContent'e cevirir.
 * Ceviriler burada uygulanir; tema kodu ne DB'ye ne de ceviri tablosuna dokunur.
 */
export function getSiteContent(locale: Locale = DEFAULT_LOCALE): SiteContent {
  const settings = getSettings();
  const hours = getOpeningHours();
  const categories = getMenuCategories();
  const items = getMenuItems();
  const gallery = getGalleryImages();
  const reviews = getTestimonials();
  const questions = getFaqs();
  const map = getTranslations(locale);

  const enabled = getEnabledLocales(settings);
  const locales: LocaleOption[] = enabled.map((code) => ({
    locale: code,
    label: LOCALE_META[code].nativeLabel,
    href: `/${code}`,
    isActive: code === locale,
  }));

  const name = tr(map, "settings", 0, "name", settings.name) || "İşletme Adı";
  const handle = instagramHandle(settings.instagram);

  // Panelde bos birakildiysa isletme adina duser; tema icin asla bos gelmez.
  const heroHeadline =
    tr(map, "settings", 0, "heroHeadline", settings.heroHeadline) || name;

  // Bozuk/eski JSON'a karsi savunma: dizi degilse yok say, bos satirlari at.
  const rawHighlights = Array.isArray(settings.highlights)
    ? settings.highlights
    : [];
  const highlights = rawHighlights
    .map((highlight, index) => ({
      label: tr(map, "highlight", index, "label", highlight?.label ?? ""),
      value: tr(map, "highlight", index, "value", highlight?.value ?? ""),
    }))
    .filter((highlight) => highlight.label || highlight.value)
    .slice(0, MAX_HIGHLIGHTS);

  // Bilinmeyen platform ya da bos url panelde de kaydedilmiyor; yine de
  // elle bozulmus JSON'a karsi burada bir kez daha suzuluyor.
  const rawSocials = Array.isArray(settings.socialLinks)
    ? settings.socialLinks
    : [];
  const socialLinks = rawSocials
    .map((link) => ({
      platform: String(link?.platform ?? ""),
      url: String(link?.url ?? "").trim(),
    }))
    .filter(
      (link) =>
        link.url.length > 0 &&
        SOCIAL_PLATFORMS.some((p) => p.key === link.platform),
    )
    .map((link) => ({
      ...link,
      label:
        SOCIAL_PLATFORMS.find((p) => p.key === link.platform)?.label ??
        link.platform,
    }));

  /*
   * Bolum gorunurlugu TEK yerde karara baglanir: panelden kapatilmis mi, ve
   * gosterilecek icerigi var mi. Tema yalnizca isVisible(key) sorar; her temada
   * ayni kosulu tekrar yazmak (ve unutmak) gerekmez.
   */
  const hidden = new Set(normalizeHiddenSections(settings.hiddenSections));
  const hasContent: Record<string, boolean> = {
    yorumlar: reviews.length > 0,
    sss: questions.length > 0,
    // Koordinat da yeter: Konum bolumu adres olmadan da yol tarifi uretebiliyor.
    konum: Boolean(
      settings.address.trim() ||
        settings.mapsUrl.trim() ||
        (settings.lat !== null && settings.lng !== null),
    ),
    galeri: gallery.length > 0,
    whatsapp: Boolean(settings.whatsapp.trim()),
    duyuru: Boolean(settings.announcement.trim()),
  };
  const isVisible = (key: string): boolean => {
    if (hidden.has(key)) return false;
    return hasContent[key] ?? true;
  };

  return {
    locale,
    dir: LOCALE_META[locale].dir,
    t: getMessages(locale),
    locales,

    name,
    tagline: tr(map, "settings", 0, "tagline", settings.tagline),
    about: tr(map, "settings", 0, "about", settings.about),
    heroHeadline,
    heroSubline: tr(map, "settings", 0, "heroSubline", settings.heroSubline),
    highlights,
    logoUrl: settings.logoUrl,
    heroImageUrl: settings.heroImageUrl,
    contact: {
      phone: settings.phone,
      phoneHref: telHref(settings.phone),
      whatsapp: settings.whatsapp,
      whatsappHref: whatsappHref(settings.whatsapp),
      email: settings.email,
      address: tr(map, "settings", 0, "address", settings.address),
      locality: localityFrom(tr(map, "settings", 0, "address", settings.address)),
      lat: settings.lat,
      lng: settings.lng,
      mapsUrl: settings.mapsUrl,
      instagram: handle,
      instagramHref: instagramHref(handle),
    },
    openingHours: hours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      dayLabel: dayLabel(h.dayOfWeek, locale),
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
    menu: categories.map((category) => ({
      id: category.id,
      name: tr(map, "menu_category", category.id, "name", category.name),
      items: items
        .filter((item) => item.categoryId === category.id && item.isActive)
        .map((item) => ({
          id: item.id,
          name: tr(map, "menu_item", item.id, "name", item.name),
          description: tr(
            map,
            "menu_item",
            item.id,
            "description",
            item.description,
          ),
          price: formatPrice(item.price, locale),
          priceValue: item.price,
          imageUrl: item.imageUrl,
          thumbUrl: thumbUrl(item.imageUrl),
          isFeatured: item.isFeatured,
        })),
    })),
    gallery: gallery.map((image) => ({
      id: image.id,
      url: image.url,
      thumbUrl: thumbUrl(image.url),
      alt: tr(map, "gallery", image.id, "alt", image.alt),
    })),
    testimonials: reviews.map((review) => ({
      id: review.id,
      author: tr(map, "testimonial", review.id, "author", review.author),
      text: tr(map, "testimonial", review.id, "text", review.text),
      // 1-5 disina cikan degerler (elle DB duzenlemesi) yildiz yerine bos gecer.
      rating:
        review.rating !== null && review.rating >= 1 && review.rating <= 5
          ? review.rating
          : null,
    })),
    faq: questions.map((item) => ({
      id: item.id,
      question: tr(map, "faq", item.id, "question", item.question),
      answer: tr(map, "faq", item.id, "answer", item.answer),
    })),
    socialLinks: socialLinks,
    announcement: tr(map, "settings", 0, "announcement", settings.announcement),
    isVisible,
    brandColors: settings.brandColors ?? {},
    themeSlug: resolveThemeSlug(settings.themeSlug),
  };
}
