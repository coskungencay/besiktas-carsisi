import type { ReactNode } from "react";

/**
 * Yesil Avlu'ya OZEL kucuk parcalar.
 *
 * Bu tasarimin imzasi ORTALANMIS bir avlu duzeni: her bolum ortadan baslar,
 * baslikla icerik arasinda nefes alan bir ayrac durur. Kolon genisligi
 * bilerek dar tutuluyor; genis satirlar bu sakin ritmi bozuyordu.
 */

/** Tum bolumlerin ortak ic kenar boslugu. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10";

/** Okuma kolonu: metin bloklarinin genisligi hicbir yerde bunu asmaz. */
export const column = "mx-auto w-full max-w-2xl";

/** Bolum kabugu: zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/** Genis harf arali kucuk etiket (bolum ustu, gun adi, alan adi). */
export const eyebrow =
  "brand-body brand-eyebrow text-[0.65rem] text-[var(--brand-ink-muted)]";

/**
 * Botanik ayrac: iki ince cizgi ve ortasinda kucuk bir yaprak (dondurulmus kare).
 * Yalnizca dekoratif oldugu icin erisilebilirlik agacindan gizli.
 */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-px w-10 bg-[var(--brand-border)]" />
      <span className="size-1.5 rotate-45 bg-[var(--brand-accent)]" />
      <span className="h-px w-10 bg-[var(--brand-border)]" />
    </div>
  );
}

/**
 * Ortalanmis bolum basligi: etiket, serif baslik, opsiyonel giris ve ayrac.
 * Tum bolumler ayni ritmi tutsun diye tek yerde tanimli.
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
      {eyebrowText ? <p className={eyebrow}>{eyebrowText}</p> : null}

      <h2
        id={titleId}
        className="brand-display mx-auto mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.2] text-balance"
      >
        {title}
      </h2>

      {lead ? (
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
          {lead}
        </p>
      ) : null}

      {children}

      <Sprig className="mt-8" />
    </div>
  );
}
