import type { MetadataRoute } from "next";

import { getEnabledLocales, getMenuItems, getSettings } from "@/lib/content";
import { appUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl();
  const settings = getSettings();
  const locales = getEnabledLocales(settings);
  const lastModified = settings.updatedAt ?? new Date();

  // Her dil ayri bir URL; hepsi birbirinin alternatifi olarak isaretlenir.
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${base}/${locale}`]),
  );

  const home: MetadataRoute.Sitemap = locales.map((locale, index) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.8,
    alternates: { languages },
  }));

  /*
   * Menu sayfasi yalnizca gercekten urun varken sitemap'e girer; urun
   * yokken o adres 404 donuyor ve arama motoruna olmayan bir sayfa
   * bildirmek istemeyiz.
   */
  const hasMenuItems = getMenuItems().some((item) => item.isActive);
  if (!hasMenuItems) return home;

  const menuLanguages = Object.fromEntries(
    locales.map((locale) => [locale, `${base}/${locale}/menu`]),
  );

  const menu: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${base}/${locale}/menu`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: { languages: menuLanguages },
  }));

  return [...home, ...menu];
}
