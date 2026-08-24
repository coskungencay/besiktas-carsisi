import beyazOda from "./beyaz-oda";
import type { ThemeDefinition } from "./types";

/**
 * Bu repo TEK musteri icindir: tema pinlenmistir ve panelden degistirilemez.
 * Baska bir tema gerekiyorsa sablon repodan yeni bir kopya acin.
 */
export const themeRegistry: Record<string, ThemeDefinition> = {
  "beyaz-oda": beyazOda,
};

export const DEFAULT_THEME_SLUG = "beyaz-oda";

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
 *   1. NEXT_PUBLIC_THEME (gecerli bir slug ise)
 *   2. site_settings.themeSlug
 *   3. DEFAULT_THEME_SLUG
 */
export function resolveThemeSlug(dbSlug?: string | null): string {
  return pinnedThemeSlug() ?? (isThemeSlug(dbSlug) ? dbSlug : DEFAULT_THEME_SLUG);
}

/** Bir temanin marka renkleri; panelde form varsayilanlari icin. */
export function themeDefaultColors(slug: string | null | undefined) {
  return getTheme(slug).defaultColors;
}
