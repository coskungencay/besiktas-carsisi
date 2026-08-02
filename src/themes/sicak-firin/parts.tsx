import type { ReactNode } from "react";

/**
 * Sicak Firin'a OZEL kucuk parcalar.
 *
 * Bu tasarimin imzasi "yumusak kart": kenarlik yerine sicak tonlu ikincil zemin
 * ve tema yaricapi. Cizgi/ayrac neredeyse hic yok — mahalle firininin davetkar
 * hissi keskin kenarlardan degil, dolgulu yuzeylerden geliyor.
 */

/** Tasarimin ic kenar boslugu — tum bolumlerde ayni. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-8";

/** Bolum kabugu: ana zemin + govde rengi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/** Yumusak kart yuzeyi: kenarliksiz, dolgulu, yuvarlak. */
export const soft = "brand-rounded bg-[var(--brand-surface-alt)]";

/** Kucuk kunye yazisi (SAAT, Menu, One cikan gibi). */
export const metaText =
  "brand-body brand-eyebrow text-xs text-[var(--brand-ink-muted)]";

/** Yuvarlak rozet kabugu; hero kunyeleri ve bolum etiketleri bunu kullanir. */
export const chip =
  "inline-flex items-center gap-2 brand-rounded bg-[var(--brand-surface-alt)] px-4 py-2";

/**
 * Bolum basligi: ustte yuvarlak rozet icinde etiket, altinda serif baslik.
 *
 * `align` var cunku vitrin niteligindeki bolumler (menu, galeri) ortalanmis,
 * anlatim bolumleri (hakkimizda, iletisim) satir basindan hizali duruyor.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  intro,
  align = "start",
  children,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  intro?: string;
  align?: "start" | "center";
  children?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "flex flex-col items-center text-center"
          : "flex flex-col items-start text-start"
      }
    >
      <p className={`${chip} ${metaText}`}>{eyebrow}</p>

      <h2
        id={titleId}
        className="brand-display mt-5 text-3xl leading-[1.15] text-balance sm:text-4xl"
      >
        {title}
      </h2>

      {intro ? (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
          {intro}
        </p>
      ) : null}

      {children}
    </div>
  );
}
