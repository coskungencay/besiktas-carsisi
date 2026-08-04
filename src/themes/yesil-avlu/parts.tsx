import type { ReactNode } from "react";

/**
 * Yesil Avlu'ya OZEL kucuk parcalar.
 *
 * Bu tasarimin imzasi ORTALANMIS bir avlu duzeni: her bolum ortadan baslar,
 * baslikla icerik arasinda nefes alan bir ayrac durur. Kolon genisligi
 * bilerek dar tutuluyor; genis satirlar bu sakin ritmi bozuyordu.
 */

/**
 * Tum bolumlerin ortak ic kenar boslugu.
 * Genis ekrandaki 52px tasarimdan geliyor; --brand-gutter uzerinden okunuyor
 * ki tek yerden degistirilebilsin.
 */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-[var(--brand-gutter)]";

/** Okuma kolonu: metin bloklarinin genisligi hicbir yerde bunu asmaz. */
export const column = "mx-auto w-full max-w-2xl";

/** Bolum kabugu: zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/** Genis harf arali kucuk etiket (gun adi, alan adi, kunye). */
export const eyebrow =
  "brand-body brand-eyebrow text-[0.71875rem] text-[var(--brand-ink-muted)]";

/**
 * Bolum ustu etiket. Tasarimda bu satir govde griden DEGIL, yesil accent'ten
 * okunuyor; bolum baslangicini isaretleyen tek renkli oge o.
 */
export const sectionEyebrow =
  "brand-body brand-eyebrow text-[0.71875rem] text-[var(--brand-accent)]";

/**
 * Govde metni olcegi: tasarimda 16px / 1.8 satir yuksekligi ve 300 agirlik.
 * Uzun paragraflarin havadar durmasi bu ucluye bagli.
 *
 * Renk --ya-prose: tasarimdaki paragraf tonu (#4A5C4F) etiket griyle DEGIL,
 * murekkeple etiket arasindaki bir tonla veriliyor (bkz. tokens.css).
 */
export const bodyText =
  "text-base font-light leading-[1.8] text-pretty text-[var(--ya-prose)]";

/** Bolum basliklarinin hizasi. Tasarimda menu ortali, hikaye ve ziyaret sola dayali. */
export type Align = "center" | "start";

/**
 * Botanik ayrac: iki ince cizgi ve ortasinda kucuk bir yaprak (dondurulmus kare).
 * Yalnizca dekoratif oldugu icin erisilebilirlik agacindan gizli.
 *
 * Yaprak ayri bir sarmalayicidan salinir (yaSway): donme animasyonu ile
 * yapragin 45 derecelik durusu ayni transform'u paylasamazdi.
 *
 * Hiza className ile DEGIL prop ile veriliyor: justify-* siniflari ayni
 * ozelligi yazar, hangisinin kazandigi sinif sirasina degil uretilen CSS
 * sirasina bagli olurdu.
 */
export function Sprig({
  className = "",
  align = "center",
}: {
  className?: string;
  align?: Align;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 ${
        align === "start" ? "justify-start" : "justify-center"
      } ${className}`}
    >
      <span className="h-px w-10 bg-[var(--brand-border)]" />
      <span className="ya-sway flex">
        <span className="size-1.5 rotate-45 bg-[var(--brand-accent)]" />
      </span>
      <span className="h-px w-10 bg-[var(--brand-border)]" />
    </div>
  );
}

/**
 * Bolum basligi: etiket, serif baslik, opsiyonel giris ve ayrac.
 * Tum bolumler ayni ritmi tutsun diye tek yerde tanimli.
 *
 * Baslik olcegi tasarimdaki 56-62px araligindan geliyor; satir yuksekligi
 * 1.1 ve harf araligi -.01em (Cormorant genis ovalleri sikilastirilmali).
 *
 * HIZA: tasarimda yalnizca menu basligi ORTALI; hikaye ve ziyaret bolumleri
 * iki kolonlu ve baslik sola dayali. Onceki hali her bolumu ortaliyordu, bu da
 * tasarimin asimetrik ritmini duz bir sutuna ceviriyordu.
 */
export function SectionHeading({
  eyebrowText,
  title,
  titleId,
  lead,
  align = "center",
  children,
}: {
  eyebrowText?: string;
  title: string;
  titleId: string;
  lead?: string;
  align?: Align;
  children?: ReactNode;
}) {
  const isStart = align === "start";

  return (
    <div className={isStart ? "text-start" : "text-center"}>
      {eyebrowText ? <p className={sectionEyebrow}>{eyebrowText}</p> : null}

      <h2
        id={titleId}
        className={`brand-display mt-4 max-w-3xl text-[clamp(2.1rem,5vw,3.625rem)] leading-[1.1] tracking-[-0.01em] text-balance ${
          isStart ? "" : "mx-auto"
        }`}
      >
        {title}
      </h2>

      {lead ? (
        <p className={`${bodyText} mt-6 max-w-xl ${isStart ? "" : "mx-auto"}`}>
          {lead}
        </p>
      ) : null}

      {children}

      <Sprig className="mt-8" align={align} />
    </div>
  );
}
