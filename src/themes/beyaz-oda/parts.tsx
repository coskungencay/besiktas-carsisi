import type { ReactNode } from "react";

/**
 * Beyaz Oda'ya OZEL kucuk parcalar.
 *
 * Bu dosya bilerek tema klasorunun icinde: bastaki bolum numarasi, ince ayrac
 * ve 12'li izgara bu tasarimin imzasi. Baska temalar bunlari kullanmaz.
 */

/** Tasarimin ic kenar boslugu — tum bolumlerde ayni. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10";

/** Bolum kabugu: zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/** Monospace kunye yazisi (SAAT · 08–18 gibi). */
export const meta =
  "brand-body text-xs tracking-[0.12em] text-[var(--brand-ink-muted)]";

/**
 * Bolum numarasi + baslik.
 *
 * Tasarimda her bolum sol kenarda "— 01" gibi bir indeksle basliyor; genis
 * ekranda bu indeks metnin soluna tasar, dar ekranda basligin ustune gecer.
 */
export function SectionIndex({
  index,
  title,
  titleId,
  children,
}: {
  index: string;
  title: string;
  titleId: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <p className={`${meta} lg:col-span-2`} aria-hidden="true">
        — {index}
      </p>

      <div className="lg:col-span-10">
        <h2
          id={titleId}
          className="brand-display text-3xl leading-[1.1] text-balance sm:text-4xl"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

/** Bolumleri ayiran ince cizgi. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <hr className={`border-0 border-t border-[var(--brand-border)] ${className}`} />
  );
}
