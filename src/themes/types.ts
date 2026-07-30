import type { ComponentType } from "react";

import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n";

/* -------------------------------------------------------------------------- */
/*                        Temalarin gordugu TEK veri tipi                       */
/* -------------------------------------------------------------------------- */
/**
 * ONEMLI: Tema kodu ASLA veritabanina dokunmaz. Tum section'lar yalnizca
 * asagidaki tiplerden beslenir. Yeni tema eklemek = sadece gorsel is.
 */

export type OpeningHour = {
  /** 0 = Pazar ... 6 = Cumartesi */
  dayOfWeek: number;
  /** "Pazartesi" gibi Turkce gun adi. */
  dayLabel: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  /** Formatlanmis fiyat, orn. "₺85,00". Bos string = fiyat gosterilmesin. */
  price: string;
  /** Ham sayisal fiyat (siralama/filtre gerekirse). */
  priceValue: number;
  imageUrl: string;
  thumbUrl: string;
  isFeatured: boolean;
};

export type MenuCategory = {
  id: number;
  name: string;
  items: MenuItem[];
};

export type GalleryImage = {
  id: number;
  url: string;
  thumbUrl: string;
  alt: string;
};

export type SiteContact = {
  phone: string;
  /** Tiklanabilir tel: linki, orn. "tel:+905551112233" */
  phoneHref: string;
  whatsapp: string;
  /** Hazir wa.me linki, bos olabilir. */
  whatsappHref: string;
  email: string;
  address: string;
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
  instagram: string;
  instagramHref: string;
};

export type LocaleOption = {
  locale: Locale;
  /** Dilin kendi adi, orn. "Español" */
  label: string;
  /** Bu dile giden yol, orn. "/es" */
  href: string;
  isActive: boolean;
};

export type SiteContent = {
  /** Sayfanin dili. */
  locale: Locale;
  /** "ltr" | "rtl" — Arapca'da "rtl". */
  dir: "ltr" | "rtl";
  /**
   * Arayuz metinleri sozlugu. Tema SABIT METIN YAZMAZ, hepsini buradan alir.
   * Kalip doldurmak icin: fill(t.hero.logoAlt, { name: content.name })
   */
  t: Messages;
  /** Sitede acik olan diller (dil secici bunu render eder). */
  locales: LocaleOption[];

  name: string;
  tagline: string;
  about: string;
  logoUrl: string;
  heroImageUrl: string;
  contact: SiteContact;
  openingHours: OpeningHour[];
  menu: MenuCategory[];
  gallery: GalleryImage[];
  /** CSS degisken adi -> renk. Root'a inline style olarak basilir. */
  brandColors: Record<string, string>;
  themeSlug: string;
};

/* -------------------------------------------------------------------------- */
/*                              Tema sozlesmesi                                 */
/* -------------------------------------------------------------------------- */

export type SectionProps = {
  content: SiteContent;
};

export type SectionKey = "Hero" | "About" | "Menu" | "Gallery" | "Contact";

export type ThemeSections = Record<SectionKey, ComponentType<SectionProps>>;

export type ThemeDefinition = {
  /** Panelde gosterilen okunabilir ad. */
  name: string;
  /** Landing sayfasinda sirayla render edilen bolumler. */
  sections: ThemeSections;
  /** globals.css'e import edilen token dosyasinin repo-koku yolu. */
  tokensPath: string;
};

/** Landing sayfasindaki sabit render sirasi. */
export const SECTION_ORDER: SectionKey[] = [
  "Hero",
  "About",
  "Menu",
  "Gallery",
  "Contact",
];
