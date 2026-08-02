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
 */
export const bodyText =
  "text-base font-light leading-[1.8] text-pretty text-[var(--brand-ink-muted)]";

/**
 * Botanik ayrac: iki ince cizgi ve ortasinda kucuk bir yaprak (dondurulmus kare).
 * Yalnizca dekoratif oldugu icin erisilebilirlik agacindan gizli.
 *
 * Yaprak ayri bir sarmalayicidan salinir (yaSway): donme animasyonu ile
 * yapragin 45 derecelik durusu ayni transform'u paylasamazdi.
 */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
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
 * Ortalanmis bolum basligi: etiket, serif baslik, opsiyonel giris ve ayrac.
 * Tum bolumler ayni ritmi tutsun diye tek yerde tanimli.
 *
 * Baslik olcegi tasarimdaki 56-62px araligindan geliyor; satir yuksekligi
 * 1.1 ve harf araligi -.01em (Cormorant genis ovalleri sikilastirilmali).
 */
export function SectionHeading({
  eyebrowText,
  title,
  titleId,
  lead,
  children,
}: {
  eyebrowText?: string;
  title: string;
  titleId: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-center">
      {eyebrowText ? <p className={sectionEyebrow}>{eyebrowText}</p> : null}

      <h2
        id={titleId}
        className="brand-display mx-auto mt-4 max-w-3xl text-[clamp(2.1rem,5vw,3.625rem)] leading-[1.1] tracking-[-0.01em] text-balance"
      >
        {title}
      </h2>

      {lead ? (
        <p className={`${bodyText} mx-auto mt-6 max-w-xl`}>{lead}</p>
      ) : null}

      {children}

      <Sprig className="mt-8" />
    </div>
  );
}
