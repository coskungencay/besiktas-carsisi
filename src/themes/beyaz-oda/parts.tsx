import type { ReactNode } from "react";

import { closedDayLabels, hasMenu, hoursRange } from "@/themes/_shared/data";
import type { Highlight, SiteContent } from "@/themes/types";

/**
 * Beyaz Oda'ya OZEL kucuk parcalar.
 *
 * Bu dosya bilerek tema klasorunun icinde: bastaki bolum numarasi, ince ayrac
 * ve 12'li izgara bu tasarimin imzasi. Baska temalar bunlari kullanmaz.
 *
 * Olculer tasarimdan birebir: 12 kolon, 24px gap (gap-6), 48px yan bosluk
 * (sm:px-12), bolum ustu 118px + ince cizgi + 34px.
 */

/** Tasarimin ic kenar boslugu — tum bolumlerde ayni. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-12";

/** Bolum kabugu: zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Monospace kunye yazisi (SAAT · 08–18 gibi) — tasarimda 11.5px / 300.
 * Agirlik burada yaziliyor cunku .bo-mono bilerek agirliksiz (bkz. tokens.css).
 */
export const meta = "bo-mono font-light text-[11.5px] text-[var(--brand-ink-muted)]";

/**
 * Liste satirlarinin bastaki sira numarasi (menu 01, 02...).
 *
 * .bo-index DEGIL: tasarimda bolum indeksleri ("— 01") acikca 300, buna karsilik
 * liste numaralari agirlik yazmadigi icin 400. Iki kademe ayni mono ailede.
 */
export const rowNumber = "bo-mono text-[11px] text-[var(--brand-ink-faint)]";

/**
 * Bolum ust boslugu. Tasarimda bolumler 118px bosluk sonrasi ince bir cizgiyle
 * baslar; cizgi ile icerik arasinda 34px vardir. Bu yuzden dikey bosluk
 * brand-section gibi simetrik degil, yalnizca USTTEdir.
 */
export const sectionTop =
  `${shell} pt-[var(--brand-section-py)] sm:pt-[var(--brand-section-py-lg)]`;

/**
 * Bolum govdesi. Artik 12 kolonluk sol-indeksli izgara DEGIL.
 *
 * NEDEN DEGISTI: tasarim sol kenarda kucuk bir mono etiket ("— 02 MAGAZALAR")
 * ve sagda icerik seklindeydi. Hero'nun ortalanmis, buyuk kelime-markasindan
 * sonra sayfanin geri kalani bu duzende "sonmus" duruyordu — ust ustte iki
 * farkli sayfa gibi. Simdi her bolum de hero gibi: ortada kucuk etiket,
 * altinda buyuk baslik, altinda icerik.
 */
export const sectionGrid = "border-t border-[var(--brand-border)] pt-[34px]";

/**
 * Kunye satirlarinin hero ile hakkimizda arasinda paylastirilmasi.
 *
 * Tasarimda IKI ayri kunye blogu var ve ikisi ayni veriyi tasimiyor:
 *   - hero'daki uc satir saatten turer ("SAAT · 08—18", "KAPALI · PAZAR"),
 *   - hakkimizdanin sagindaki tablo isletmenin sayisal kunyesidir
 *     (MENU KALEMI 5, METREKARE 18 ...) — bizde "one cikanlar".
 *
 * Bolme TEK yerde yapiliyor ki iki bolum ayni satirlari iki kez basmasin.
 * Saat girilmemisse hero bos kalmasin diye one cikanlar hero'ya gecer; o
 * durumda hakkimizdaki tablo hic basilmaz.
 */
export function metaColumns(content: SiteContent): {
  hero: Highlight[];
  about: Highlight[];
} {
  const hours: Highlight[] = [];

  const range = hoursRange(content.openingHours);
  if (range) hours.push({ label: content.t.hours.label, value: range });

  const closed = closedDayLabels(content.openingHours);
  if (closed.length > 0) {
    hours.push({ label: content.t.hours.closed, value: closed.join(", ") });
  }

  if (hours.length === 0) return { hero: content.highlights, about: [] };
  return { hero: hours, about: content.highlights };
}

/**
 * Hakkimizda bolumu basilacak mi?
 *
 * Header'daki nav ile About.tsx AYNI kosulu kullanmali; yoksa bolum kendini
 * basmadiginda ust seritte hicbir yere gitmeyen kirik bir capa kalir.
 */
export function hasAboutSection(content: SiteContent): boolean {
  return content.about !== "" || metaColumns(content).about.length > 0;
}

/**
 * Sayfada GERCEKTEN basilan bolumlerin sirasi — tema `index.ts`'teki dizinin
 * aynisi, ama her birinin kendi gorunurluk kosuluyla birlikte.
 *
 * NEDEN TEK YERDE: bolum numaralari ("— 02") tasarimin imzasi. Once her bolum
 * kendi numarasini SABIT tasiyordu; galeri bos ya da yorumlar kapaliyken sayfada
 * "02 → 05" gibi atlayan numaralar kaliyordu ve bu bir hata gibi okunuyordu.
 * Burasi tek dogruluk kaynagi: hem numara buradan uretiliyor hem de bolumun
 * kendi `return null` kosulu buraya bakiyor, ikisi birbirinden kayamaz.
 */
const SECTION_GUARDS: { id: string; shown: (c: SiteContent) => boolean }[] = [
  { id: "hero", shown: () => true },
  { id: "hakkimizda", shown: hasAboutSection },
  { id: "magazalar", shown: hasMenu },
  { id: "galeri", shown: (c) => c.isVisible("galeri") },
  { id: "yorumlar", shown: (c) => c.isVisible("yorumlar") },
  { id: "sss", shown: (c) => c.isVisible("sss") },
  { id: "konum", shown: (c) => c.isVisible("konum") },
  { id: "iletisim", shown: () => true },
];

/** Bir bolum sayfada basiliyor mu? Bolumler kendi `return null` kararini buradan alir. */
export function isSectionShown(content: SiteContent, id: string): boolean {
  return SECTION_GUARDS.find((s) => s.id === id)?.shown(content) ?? true;
}

/**
 * Bolumun sayfadaki SIRA numarasi ("00", "01", …) — yalnizca basilan bolumler
 * sayilir, boylece numaralar her zaman kesintisiz akar.
 */
export function sectionIndex(content: SiteContent, id: string): string {
  const shown = SECTION_GUARDS.filter((s) => s.shown(content));
  const position = shown.findIndex((s) => s.id === id);
  return String(position < 0 ? 0 : position).padStart(2, "0");
}

/**
 * Bolum basligi — ortalanmis, uc kademeli.
 *
 *   — 02            (mono indeks, cok soluk)
 *   MAGAZALAR       (kucuk buyuk-harf etiket)
 *   Carsida kimler var?   (buyuk display baslik)
 *   [istege bagli tek satirlik giris]
 *
 * `title` semantik h2; gorsel olarak da artik GERCEKTEN baslik. Kucuk etiket
 * (`eyebrow`) onun ustunde dekoratif bir kademe.
 */
export function SectionIndex({
  index,
  eyebrow,
  title,
  titleId,
  lead,
  children,
}: {
  index: string;
  /** Kucuk buyuk-harf etiket, orn. "MAGAZALAR". */
  eyebrow: string;
  /** Buyuk baslik, orn. "Carsida kimler var?". */
  title: string;
  titleId: string;
  /** Basligin altinda tek paragraflik giris. Bos birakilabilir. */
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-[62ch] text-center">
        <p className="bo-index" aria-hidden="true">
          — {index}
        </p>
        <p className="bo-index brand-eyebrow mt-1" aria-hidden="true">
          {eyebrow}
        </p>

        {/*
          Baslik display SERIF (bo-title) — kalin grotesk DEGIL.
          Gerekce fonts.ts icinde: kalinlik her bolumde tekrar edince sayfa
          tek notaya dusuyordu. Hiyerarsi artik puntodan ve bosluktan geliyor,
          agirliktan degil; bu yuzden tracking de negatif degil hafif pozitif
          (yuksek kontrastli serif sikisik dizildiginde tirnaklari birbirine
          giriyor).
        */}
        <h2
          id={titleId}
          className="bo-title mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.04] tracking-[-0.012em] text-balance"
        >
          {title}
        </h2>

        {lead ? (
          <p className="mt-6 text-[15px] leading-[1.75] text-pretty text-[var(--brand-ink-soft)] sm:text-[16.5px]">
            {lead}
          </p>
        ) : null}
      </div>

      {/*
        min-w-0 ZORUNLU: iceride yatay kayan bir serit (yorum karuseli) varken
        bu kutunun icerigin altina daralabilmesi gerekiyor; yoksa dar ekranda
        sayfa 390px yerine 417px genisleyip yatay kayiyordu.
      */}
      <div className="mt-14 min-w-0 sm:mt-16">{children}</div>
    </>
  );
}
