import beyazOda from "./beyaz-oda";
import kirkYil from "./kirk-yil";
import mera from "./mera";
import patika from "./patika";
import placeholder from "./placeholder";
import sicakFirin from "./sicak-firin";
import tesviye from "./tesviye";
import vela from "./vela";
import yesilAvlu from "./yesil-avlu";
import type { ThemeDefinition } from "./types";

/**
 * Yeni tema ekleme:
 *  1) src/themes/<slug>/ klasorunu olustur (tokens.css + index.ts)
 *  2) asagiya bir satir ekle
 *  3) src/app/globals.css icine tokens.css import'unu ekle
 * Detay: THEMING.md
 */
export const themeRegistry: Record<string, ThemeDefinition> = {
  placeholder,
  mera,
  patika,
  "yesil-avlu": yesilAvlu,
  "kirk-yil": kirkYil,
  vela,
  "beyaz-oda": beyazOda,
  tesviye,
  "sicak-firin": sicakFirin,
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

/** Bir temanin marka renkleri; panelde form varsayilanlari icin. */
export function themeDefaultColors(slug: string | null | undefined) {
  return getTheme(slug).defaultColors;
}
