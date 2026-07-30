import type { MetadataRoute } from "next";

import { getEnabledLocales, getSettings } from "@/lib/content";
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

  return locales.map((locale, index) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.8,
    alternates: { languages },
  }));
}
