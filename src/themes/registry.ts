import placeholder from "./placeholder";
import type { ThemeDefinition } from "./types";

/**
 * Yeni tema ekleme:
 *  1) src/themes/<slug>/ klasorunu olustur (tokens.css + sections/* + index.ts)
 *  2) asagiya bir satir ekle
 *  3) src/app/globals.css icine tokens.css import'unu ekle
 * Detay: THEMING.md
 */
export const themeRegistry: Record<string, ThemeDefinition> = {
  placeholder,
};

export const DEFAULT_THEME_SLUG = "placeholder";

export const themeSlugs = Object.keys(themeRegistry);

export function isThemeSlug(slug: string | null | undefined): slug is string {
  return typeof slug === "string" && slug in themeRegistry;
}

export function getTheme(slug: string | null | undefined): ThemeDefinition {
  if (isThemeSlug(slug)) return themeRegistry[slug] as ThemeDefinition;
  return themeRegistry[DEFAULT_THEME_SLUG] as ThemeDefinition;
}

/** Env ile sabitlenmis tema (Docker imajina pinlemek icin). */
export function pinnedThemeSlug(): string | null {
  const raw = process.env.NEXT_PUBLIC_THEME?.trim();
  return isThemeSlug(raw) ? raw : null;
}

/**
 * Aktif tema cozumleme sirasi:
 *   1. NEXT_PUBLIC_THEME (gecerli bir slug ise)  -> imaja pinlenmis tema
 *   2. site_settings.themeSlug                   -> panelden secilen tema
 *   3. "placeholder"                             -> fallback
 */
export function resolveThemeSlug(dbSlug?: string | null): string {
  return pinnedThemeSlug() ?? (isThemeSlug(dbSlug) ? dbSlug : DEFAULT_THEME_SLUG);
}
