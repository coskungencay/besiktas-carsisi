import "server-only";

import { asc, eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "@/db";
import {
  galleryImages,
  menuCategories,
  menuItems,
  openingHours,
  siteSettings,
  type SiteSettingsRow,
} from "@/db/schema";
import {
  DAY_LABELS,
  formatPrice,
  instagramHandle,
  instagramHref,
  telHref,
  thumbUrl,
  whatsappHref,
} from "@/lib/format";
import { resolveThemeSlug } from "@/themes/registry";
import type { SiteContent } from "@/themes/types";

const EMPTY_SETTINGS: SiteSettingsRow = {
  id: SINGLETON_ID,
  name: "İşletme Adı",
  tagline: "",
  about: "",
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

export function getGalleryImages() {
  return db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id))
    .all();
}

/**
 * Temalarin gordugu tek veri kaynagi.
 * Burasi DB satirlarini sunuma hazir SiteContent'e cevirir; tema kodu
 * hicbir zaman DB'ye dokunmaz.
 */
export function getSiteContent(): SiteContent {
  const settings = getSettings();
  const hours = getOpeningHours();
  const categories = getMenuCategories();
  const items = getMenuItems();
  const gallery = getGalleryImages();

  const handle = instagramHandle(settings.instagram);

  return {
    name: settings.name || "İşletme Adı",
    tagline: settings.tagline,
    about: settings.about,
    logoUrl: settings.logoUrl,
    heroImageUrl: settings.heroImageUrl,
    contact: {
      phone: settings.phone,
      phoneHref: telHref(settings.phone),
      whatsapp: settings.whatsapp,
      whatsappHref: whatsappHref(settings.whatsapp),
      email: settings.email,
      address: settings.address,
      lat: settings.lat,
      lng: settings.lng,
      mapsUrl: settings.mapsUrl,
      instagram: handle,
      instagramHref: instagramHref(handle),
    },
    openingHours: hours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      dayLabel: DAY_LABELS[h.dayOfWeek] ?? "",
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
    menu: categories.map((category) => ({
      id: category.id,
      name: category.name,
      items: items
        .filter((item) => item.categoryId === category.id && item.isActive)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: formatPrice(item.price),
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
      alt: image.alt,
    })),
    brandColors: settings.brandColors ?? {},
    themeSlug: resolveThemeSlug(settings.themeSlug),
  };
}
