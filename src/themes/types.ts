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
  /**
   * Adresin son iki parcasi, orn. "Kadıköy / İstanbul".
   * Hero'larda tam adres yerine bu kisa satir kullanilir.
   */
  locality: string;
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
  instagram: string;
  instagramHref: string;
};

/**
 * Hero'da veya bolum kenarlarinda gosterilen kisa kunye satiri.
 * Ornek: { label: "SAAT", value: "08–18" }
 */
export type Highlight = {
  label: string;
  value: string;
};

/** Musteri yorumu. */
export type Testimonial = {
  id: number;
  author: string;
  text: string;
  /** 1-5 yildiz; null ise yildiz gosterilmez. */
  rating: number | null;
};

/** Sikca sorulan soru. */
export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

/** Sosyal medya baglantisi. `platform` bilinen bir anahtar (instagram, tiktok...). */
export type SocialLink = {
  platform: string;
  /** Panelde gosterilen okunabilir ad, orn. "Instagram". */
  label: string;
  url: string;
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
  /**
   * Hero'daki buyuk baslik. Musteri panelde bos biraktiysa `name` ile doldurulur,
   * yani tema icin ASLA bos gelmez.
   */
  heroHeadline: string;
  /** Basligin soluk devami, orn. "Fazlasi yok." Bos olabilir. */
  heroSubline: string;
  /** En cok 4 kisa kunye satiri. Bos olabilir. */
  highlights: Highlight[];
  logoUrl: string;
  heroImageUrl: string;
  contact: SiteContact;
  openingHours: OpeningHour[];
  menu: MenuCategory[];
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  socialLinks: SocialLink[];
  /** Kurulus yili, orn. "2015". Bos olabilir. */
  founded: string;
  /** Sayfanin en ustundeki duyuru; bos olabilir. */
  announcement: string;
  /**
   * Bir bolumun basilip basilmayacagi. Hem musterinin panelden kapatmasini
   * hem "icerik yoksa gizle" kuralini TEK yerde birlestirir; tema yalnizca
   * bunu sorar:  if (!content.isVisible("yorumlar")) return null;
   */
  isVisible: (key: string) => boolean;
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

/**
 * Sayfada render edilen tek bir bolum.
 *
 * `id` HTML anchor'i olur (orn. "menu" -> "#menu"); temanin kendi nav'i bu
 * id'lere baglanir. Ayni id iki kez kullanilmamali.
 */
export type ThemeSection = {
  id: string;
  Component: ComponentType<SectionProps>;
};

export type ThemeDefinition = {
  /** Panelde gosterilen okunabilir ad. */
  name: string;
  /** Panelde temayi bir cumlede anlatan aciklama. */
  description: string;
  /** Sayfanin en ustu. Tema istemezse hic header olmaz. */
  Header?: ComponentType<SectionProps>;
  /**
   * Landing sayfasinda sirayla render edilen bolumler.
   * Sayilari ve sirasi TEMANIN karari; ortak bir sablon dayatilmaz.
   */
  sections: ThemeSection[];
  /** Sayfanin en alti. Tema istemezse hic footer olmaz. */
  Footer?: ComponentType<SectionProps>;
  /** globals.css'e import edilen token dosyasinin repo-koku yolu. */
  tokensPath: string;
  /**
   * Temanin tokens.css'indeki 8 marka rengi.
   *
   * NEDEN GEREKLI: admin panelindeki renk secici, musteri henuz renk
   * secmemisken hangi degerleri gosterecegini bilmeli. Bu olmadan tema
   * degistirildiginde form onceki temanin renklerini kaydeder ve yeni
   * temanin paletini ezer.
   *
   * DIKKAT: tokens.css ile ayni tutulmali. (bkz. THEMING.md)
   */
  defaultColors: Record<string, string>;
  /** Panelde kucuk onizleme icin: temanin acik mi koyu mu oldugu. */
  scheme: "light" | "dark";
};
