import type { ReactNode } from "react";

/**
 * Sicak Firin'a OZEL kucuk parcalar.
 *
 * Bu tasarimin imzasi "yumusak kart": kenarlik yerine sicak tonlu ikincil zemin
 * ve tema yaricapi. Tek cizgi turu var, o da kesik/noktali ayrac — tezgahtaki
 * el yazisi tabela hissi. Butun olculer tokens.css'ten okunur.
 */

/** Tasarimin ic kenar boslugu — tum bolumlerde ayni (genis ekranda 48px). */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-12";

/** Bolum kabugu: ana zemin + govde rengi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/** Yumusak kart yuzeyi: kenarliksiz, dolgulu, yuvarlak (20px). */
export const soft = "brand-rounded bg-[var(--brand-surface-alt)]";

/** Buyuk bolum paneli: ayni yuzey, daha genis yaricap (26px). */
export const panel =
  "rounded-[var(--brand-radius-panel)] bg-[var(--brand-surface-alt)]";

/**
 * Kucuk kunye yazisi (eyebrow).
 *
 * Tasarimda bu etiketler kutu icinde DEGIL: 12.5px, genis harf aralikli,
 * bal tonunda duz metin. Rozet gorunumu yalnizca hero'daki tek bir satirda var.
 */
export const metaText =
  "brand-body brand-eyebrow text-[length:var(--brand-text-meta)] font-medium text-[var(--brand-eyebrow-color)]";

/**
 * Form alani etiketi.
 *
 * Eyebrow ile ayni bicim ama marka renginde: etiketler krem PANELIN uzerinde
 * duruyor ve bal tonu orada 12.5px icin yeterli kontrast vermiyor.
 */
export const fieldLabel =
  "brand-body brand-eyebrow text-[length:var(--brand-text-meta)] font-medium text-[var(--brand-primary)]";

/** Hero'daki hap rozet: ikincil zemin + tam yuvarlak kenar. */
export const chip =
  "inline-flex items-center gap-2.5 rounded-[var(--brand-radius-pill)] bg-[var(--brand-surface-alt)] px-4 py-2 text-[length:var(--brand-text-meta)] font-medium text-[var(--brand-primary)]";

/** Hap buton — dolu (birincil eylem). */
export const pillSolid =
  "inline-flex items-center gap-2 rounded-[var(--brand-radius-pill)] bg-[var(--brand-primary)] px-7 py-4 text-sm font-medium text-[var(--brand-primary-contrast)] transition-colors hover:bg-[var(--brand-accent)]";

/** Hap buton — ince kenarlikli (ikincil eylem). Tasarimda kenar %40 opak. */
export const pillGhost =
  "inline-flex items-center gap-2 rounded-[var(--brand-radius-pill)] border border-[var(--brand-hairline-strong)] px-7 py-4 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--brand-surface-alt)]";

/** Govde paragrafi: 17px / 1.75, hafif agirlik — tasarimin okuma tonu. */
export const lead =
  "text-[length:var(--brand-lead)] leading-[var(--brand-lead-leading)] font-light text-[var(--brand-ink-soft)]";

/** Kesik cizgili ayrac; menu ve saat satirlarinin arasinda (tasarimda %30). */
export const dashedRow =
  "border-b border-dashed border-[var(--brand-hairline-row)] last:border-b-0";

/**
 * Ad ile fiyati birbirine baglayan noktali kilavuz cizgi.
 *
 * Tasarimda bu cizgi satir ayracindan KOYU (%40): tezgah tabelasinda gozun
 * takip ettigi asil iz o. Ayni tonu kullanmak fiyati aditan kopariyordu.
 */
export const leaderLine =
  "mb-1 hidden h-0 flex-1 border-b border-dotted border-[var(--brand-hairline-strong)] sm:block";

/**
 * Bolum basligi: ustte harf araligi genis kucuk etiket, altinda slab baslik.
 *
 * ORTALAMA YOK: tasarimda tek bir ortalanmis metin bile yok — butun basliklar,
 * paragraflar ve satirlar sol kenardan hizali. Vitrin bolumlerini (menu,
 * galeri, yorumlar) ortalamak tasarimin "tezgah tabelasi" dilini bozup sayfayi
 * genel gecer bir sablona benzetiyordu.
 *
 * `size` tasarimin iki basamakli baslik olcegini tasiyor: anlatim bolumleri
 * 46px ("lg"), vitrin bolumleri 38px ("md"). Tek olcek kullanmak sayfayi
 * duzlestiriyordu.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  intro,
  size = "lg",
  children,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  intro?: string;
  size?: "lg" | "md";
  children?: ReactNode;
}) {
  const titleScale =
    size === "md"
      ? "text-[length:var(--brand-h3)] tracking-[var(--brand-h3-tracking)]"
      : "text-[length:var(--brand-h2)] tracking-[var(--brand-h2-tracking)]";

  return (
    <div className="flex flex-col items-start text-start">
      <p className={metaText}>{eyebrow}</p>

      <h2
        id={titleId}
        className={`brand-display mt-3 leading-[var(--brand-h2-leading)] text-balance ${titleScale}`}
      >
        {title}
      </h2>

      {intro ? (
        // Tasarimda bolum girisleri 380px'te kesiliyor; daha uzun satir
        // basligin yanindaki dengeyi bozuyordu.
        <p className={`${lead} mt-6 max-w-[23.75rem] text-pretty`}>{intro}</p>
      ) : null}

      {children}
    </div>
  );
}
