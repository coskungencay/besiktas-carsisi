import { DEFAULT_LOCALE } from "@/i18n/config";

/**
 * Isletme adinin sekme/ana ekran ikonunda kullanilacak BAS HARFI.
 *
 * NEDEN AYRI DOSYA: ayni harfi hem icon.tsx hem apple-icon.tsx uretiyor; iki
 * yerde yazilsaydi biri degistiginde digeri geride kalir ve sekmedeki harf
 * ile ana ekrandaki harf farkli olabilirdi.
 *
 * NEDEN toLocaleUpperCase: Turkce'de "i" -> "İ" olmali. Duz toUpperCase()
 * "Istanbul Kahve" gibi bir adin bas harfini "I" yapar; o harf Turkce bir
 * markanin ikonunda yanlis durur.
 *
 * Ad bos ya da yalnizca bosluksa "?" doner — ikon uretimi hicbir durumda
 * patlamamali, en kotu ihtimalle notr bir isaret basmali.
 */
export function brandInitial(name: string): string {
  const first = name.trim()[0];
  if (!first) return "?";
  return first.toLocaleUpperCase(DEFAULT_LOCALE);
}
