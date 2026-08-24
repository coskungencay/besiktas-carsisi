/**
 * Temalarin paylastigi MANTIK katmani.
 *
 * KURAL: Bu dosyada hicbir gorsel karar olamaz — renk, boyut, izgara, siniflar
 * temaya aittir. Buraya yalnizca "veriyi sunuma hazirlayan" saf fonksiyonlar
 * girer. Boylece 8 tasarim birbirine benzemeden ayni mantigi paylasir.
 */

import type {
  GalleryImage,
  MenuCategory,
  MenuItem,
  OpeningHour,
  SiteContent,
} from "@/themes/types";

/* -------------------------------------------------------------------------- */
/*                                  Gorseller                                  */
/* -------------------------------------------------------------------------- */

/**
 * Yer tutucu gorseller.
 *
 * DIKKAT: Koyu temalar (scheme: "dark") *_DARK surumlerini kullanmali. Acik gri
 * yer tutucu koyu zeminde parlayan bir dikdortgene donusuyor ve musteri gorsel
 * yuklemeden once sayfanin en dikkat ceken ogesi oluyor.
 */
export const HERO_FALLBACK = "/placeholders/hero.svg";
export const HERO_FALLBACK_DARK = "/placeholders/hero-dark.svg";
export const SQUARE_FALLBACK = "/placeholders/square.svg";
export const SQUARE_FALLBACK_DARK = "/placeholders/square-dark.svg";

/** Bos URL'i yerel placeholder'a dusurur; `next/image` bos src ile patlar. */
export function imageOrFallback(url: string, fallback = HERO_FALLBACK): string {
  return url.trim() || fallback;
}

/* -------------------------------------------------------------------------- */
/*                                    Menu                                     */
/* -------------------------------------------------------------------------- */

/** Urunu olmayan kategoriler elenir; bos menu tamamen gizlenebilsin diye. */
export function menuWithItems(content: SiteContent): MenuCategory[] {
  return content.menu.filter((category) => category.items.length > 0);
}

/**
 * MAGAZALAR sayfasinin adresi.
 *
 * Carsi uyarlamasi: sablonun "menu" alan adi korunuyor (DB tablolari ve
 * upstream ile birlesme bozulmasin diye) ama kullaniciya gorunen her sey
 * magaza dilinde. Adres dile bagli oldugu icin tek yerden uretiliyor;
 * temalarda elle "/tr/magazalar" yazmak dil degisince kirilirdi.
 */
export function menuHref(content: SiteContent): string {
  return `/${content.locale}/magazalar`;
}

export function hasMenu(content: SiteContent): boolean {
  return menuWithItems(content).length > 0;
}

/** Tum kategorilerdeki urunler tek listede (sirasi korunur). */
export function allMenuItems(content: SiteContent): MenuItem[] {
  return content.menu.flatMap((category) => category.items);
}

/** "One cikan" isaretli urunler; tasarimlarin vitrin bolumleri icin. */
export function featuredItems(content: SiteContent, limit = 3): MenuItem[] {
  return allMenuItems(content)
    .filter((item) => item.isFeatured)
    .slice(0, limit);
}

/**
 * Menude urun fotograflari gosterilsin mi?
 *
 * Musteri panelden kapatabilir; hicbir urunde fotograf yoksa icerik katmani
 * zaten false dondurur (bkz. lib/content.ts). Temalar bu tek soruyu sorar.
 */
export function showMenuImages(content: SiteContent): boolean {
  return content.isVisible("menuGorselleri");
}

/**
 * Bir urunun kucuk onizleme gorseli — YOKSA null.
 *
 * null donmesi onemli: tasarimlar "fotografi olan urun" ile "olmayan urun"
 * arasinda duzeni degistirmemeli. Fotografsiz urun, fotograf ozelligi hic
 * yokmus gibi gorunmeli; yoksa yarisi resimli yarisi bos bir liste cikar.
 */
export function itemThumb(
  content: SiteContent,
  item: MenuItem,
): string | null {
  if (!showMenuImages(content)) return null;
  return item.thumbUrl.trim() || null;
}

/** Ayni kural, buyuk gosterim icin tam boy gorsel. */
export function itemImage(
  content: SiteContent,
  item: MenuItem,
): string | null {
  if (!showMenuImages(content)) return null;
  return item.imageUrl.trim() || null;
}

/** Menude en az bir urunun fotografi var mi (izgara/duzen kararlari icin). */
export function anyItemHasImage(
  content: SiteContent,
  items: MenuItem[],
): boolean {
  if (!showMenuImages(content)) return false;
  return items.some((item) => item.thumbUrl.trim() !== "");
}

/* -------------------------------------------------------------------------- */
/*                                   Galeri                                    */
/* -------------------------------------------------------------------------- */

export function galleryOrEmpty(content: SiteContent, limit?: number): GalleryImage[] {
  return typeof limit === "number"
    ? content.gallery.slice(0, limit)
    : content.gallery;
}

/* -------------------------------------------------------------------------- */
/*                               Calisma saatleri                              */
/* -------------------------------------------------------------------------- */

/**
 * Haftayi Pazartesi'den baslatir. DB 0 = Pazar tutuyor; tasarimlarin cogu
 * Pazartesi ile basliyor. Eksik gun varsa sessizce atlanir.
 */
export function hoursFromMonday(hours: OpeningHour[]): OpeningHour[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order
    .map((day) => hours.find((h) => h.dayOfWeek === day))
    .filter((h): h is OpeningHour => Boolean(h));
}

/** Acik gunlerin en erken acilis / en gec kapanis araligi, orn. "08–18". */
export function hoursRange(hours: OpeningHour[]): string {
  const open = hours.filter((h) => !h.isClosed);
  if (open.length === 0) return "";

  const earliest = open.reduce(
    (min, h) => (h.openTime < min ? h.openTime : min),
    open[0]!.openTime,
  );
  const latest = open.reduce(
    (max, h) => (h.closeTime > max ? h.closeTime : max),
    open[0]!.closeTime,
  );
  return `${earliest.slice(0, 2)}–${latest.slice(0, 2)}`;
}

/** Kapali gunlerin adlari; "KAPALI · Pazar" gibi kunye satirlari icin. */
export function closedDayLabels(hours: OpeningHour[]): string[] {
  return hours.filter((h) => h.isClosed).map((h) => h.dayLabel);
}

/* -------------------------------------------------------------------------- */
/*                                  Metinler                                   */
/* -------------------------------------------------------------------------- */

/** Bos satirlarla ayrilmis metni paragraflara boler. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*                                 Koordinat                                   */
/* -------------------------------------------------------------------------- */

/**
 * "41.0369°N / 28.9744°E" bicimi. Koordinat girilmemisse bos string doner.
 * Tasarimlarin kunye satirlarinda kullaniliyor; ayri bir DB alani gerektirmez.
 */
export function coordinateLabel(
  lat: number | null,
  lng: number | null,
  digits = 4,
): string {
  if (lat === null || lng === null) return "";
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";

  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(digits)}°${ns} / ${Math.abs(lng).toFixed(digits)}°${ew}`;
}

/**
 * Kucuk kunye damgasi: tasarimlarda header/footer koselerinde duran tek satir.
 *
 * ONCELIK: kurulus yili ("Kurulus 2015") -> koordinat -> bos.
 *
 * NEDEN: koordinat teknik ve soguk bir bilgi; musteriye "40.9903°N" hicbir sey
 * anlatmiyor. Tasarimlarin kendisi de orada kurulus yili kullaniyor
 * ("EST. 1986 · BEYOGLU"). Yil girilmemisse eski davranisa duseriz, boylece
 * mevcut kurulumlarda bosluk olusmaz.
 */
export function placeStamp(content: SiteContent): string {
  const year = content.founded.trim();
  if (year) return `${content.t.site.since} ${year}`;
  return coordinateLabel(content.contact.lat, content.contact.lng);
}

/* -------------------------------------------------------------------------- */
/*                                  Kunyeler                                   */
/* -------------------------------------------------------------------------- */

/**
 * Musteri hic kunye girmediyse calisma saatlerinden makul bir varsayilan uretir.
 * Tasarimin kunye bolumu bos kalmasin diye; musteri panelden yazinca devre disi.
 */
export function highlightsOrDerived(content: SiteContent) {
  if (content.highlights.length > 0) return content.highlights;

  const derived: { label: string; value: string }[] = [];
  const range = hoursRange(content.openingHours);
  if (range) derived.push({ label: content.t.hours.label, value: range });

  const closed = closedDayLabels(content.openingHours);
  if (closed.length > 0) {
    derived.push({ label: content.t.hours.closed, value: closed.join(", ") });
  }
  return derived;
}
