import type { ReactNode } from "react";

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

/** Monospace kunye yazisi (SAAT · 08–18 gibi) — tasarimda 11.5px. */
export const meta = "bo-mono text-[11.5px] text-[var(--brand-ink-muted)]";

/**
 * Bolum ust boslugu. Tasarimda bolumler 118px bosluk sonrasi ince bir cizgiyle
 * baslar; cizgi ile icerik arasinda 34px vardir. Bu yuzden dikey bosluk
 * brand-section gibi simetrik degil, yalnizca USTTEdir.
 */
export const sectionTop =
  `${shell} pt-[var(--brand-section-py)] sm:pt-[var(--brand-section-py-lg)]`;

/** Cizgi + 34px + 12 kolonluk izgara. */
export const sectionGrid =
  "grid gap-6 border-t border-[var(--brand-border)] pt-[34px] lg:grid-cols-12";

/**
 * Bolum indeksi + baslik.
 *
 * Tasarimda bolumun basligi sol kenardaki iki satirlik mono etiketten ibaret:
 * "— 01" ustte, bolum adi altta. Buyuk puntolu baslik YOK; sayfadaki tek buyuk
 * tipografi hero (60px) ve iletisim (40px) metnidir. h2 semantik olarak burada
 * duruyor (aria-labelledby ona bagli), gorsel olarak kucuk mono etiket.
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
    <>
      <div className="bo-index tracking-[0.04em] lg:col-span-2">
        <p aria-hidden="true">— {index}</p>
        <h2 id={titleId} className="brand-eyebrow">
          {title}
        </h2>
      </div>

      <div className="lg:col-span-10 lg:col-start-3">{children}</div>
    </>
  );
}
