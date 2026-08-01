import type { ReactNode } from "react";

/**
 * Kırk Yıl'a OZEL parcalar.
 *
 * NEDEN AYRI: bu tasarimin imzasi eski bir kahvehane tabelasi — cift cizgi,
 * ortalanmis her sey ve gorsellerin cevresindeki passe-partout cerceve.
 * Bunlar baska hicbir temada kullanilmadigi icin ortak katmana konmadi.
 */

/** Sayfa kabugu; tum bolumlerde ayni kenar boslugu. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10";

/**
 * Tabela/menu karti hissi ortalanmis DAR bir kolon ister; genis ekranda metin
 * kenardan kenara yayilirsa klasik duzen dagilir.
 */
export const column = "mx-auto w-full max-w-3xl";

export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";
export const surfaceAlt = "bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]";

/** Kunye yazisi: kucuk, genis harf arali, soluk. */
export const meta =
  "brand-body brand-eyebrow text-xs text-[var(--brand-ink-muted)]";

/**
 * Cift cizgi: tabelalarin ust/alt kenari.
 * Tek elemana border-y verip aralarinda 1px yukseklik birakiyoruz; iki ayri
 * <hr> yerine bu, dikey ritmi bozmadan ayni etkiyi verir.
 */
export function DoubleRule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-[3px] border-y border-[var(--brand-primary)] ${className}`}
    />
  );
}

/** Basliklarin altindaki kisa, ortalanmis ayrac (ortada elmas). */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex w-24 items-center gap-2 ${className}`}
    >
      <span className="h-px flex-1 bg-[var(--brand-accent)]" />
      <span className="size-1.5 rotate-45 border border-[var(--brand-accent)]" />
      <span className="h-px flex-1 bg-[var(--brand-accent)]" />
    </div>
  );
}

/** Ortalanmis bolum basligi: kunye + h2 + ayrac. */
export function SectionTitle({
  eyebrow,
  title,
  titleId,
  children,
}: {
  eyebrow?: string;
  title: string;
  titleId: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-center">
      {eyebrow ? <p className={meta}>{eyebrow}</p> : null}

      <h2
        id={titleId}
        className="brand-display mt-4 text-3xl leading-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>

      <Ornament className="mt-6" />

      {children ? (
        <div className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Iki yaninda cizgi olan kategori basligi — eski fiyat listelerinin imzasi.
 * Cizgiler flex-1 oldugu icin baslik daima tam ortada kalir, RTL'de de.
 */
export function CategoryHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--brand-border)]" />
      <h3 className="brand-display brand-eyebrow text-sm text-[var(--brand-primary)]">
        {children}
      </h3>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--brand-border)]" />
    </div>
  );
}

/**
 * Passe-partout: cerceve + ic bosluk + ikinci ince cizgi.
 * Gorseller bu temada asla ciplak basilmaz; cerceve tabela estetiginin parcasi.
 */
export function Passepartout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`brand-frame bg-[var(--brand-surface-alt)] p-2 sm:p-3 ${className}`}
    >
      <div className="border border-[var(--brand-border)]">{children}</div>
    </div>
  );
}
