import type { ReactNode } from "react";

/**
 * Vela'ya OZEL kucuk parcalar.
 *
 * NEDEN AYRI DOSYA: bu temanin imzasi uc seyde: cok genis harf arali altin
 * etiketler, saydam altin ince cizgiler ve ortalanmis serif basliklar. Bunlar
 * her bolumde tekrar ettigi icin tek yerde tanimlandi; baska temalar
 * kullanmaz.
 */

/** Ic kenar boslugu — butik his icin diger temalardan daha genis. */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10 lg:px-16";

/** Bolum kabugu: koyu zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Etiket olculeri — RENKSIZ govde.
 *
 * NEDEN AYRI: rengi cagiran tarafta ikinci bir `text-*` sinifiyla ezmek
 * guvenilir degil; ayni utility'nin iki ornegi arasinda uretilen stil
 * dosyasindaki sira kazanir, sinif dizisindeki sira degil. Bu yuzden her
 * renk kendi hazir varyantini alir.
 */
const labelBase = "brand-body brand-eyebrow text-[0.6875rem] leading-[1.6]";

/** Altin, cok genis harf arali kucuk etiket — temanin en belirgin isareti. */
export const label = `${labelBase} text-[var(--brand-primary)]`;

/** Ayni etiketin soluk (altin olmayan) hali; saat ve iletisim terimleri icin. */
export const labelMuted = `${labelBase} text-[var(--brand-ink-muted)]`;

/** Ayni etiketin tam kontrastli hali; marka adi ve baglanti metinleri icin. */
export const labelInk = `${labelBase} text-[var(--brand-ink)]`;

/** Govde metni: koyu zeminde yorucu olmasin diye soluk ve genis satir araligi. */
export const prose =
  "text-[0.9375rem] leading-[1.9] text-pretty text-[var(--brand-ink-muted)]";

/** Govdenin dipnot olcusu (saat notu gibi); prose'u ezmek yerine kendi sinifi. */
export const proseFine =
  "text-xs leading-[1.9] text-pretty text-[var(--brand-ink-muted)]";

/**
 * Sac teli cizgi.
 *
 * `tone="gold"` hero'daki uzun ayrac icin: tam altin cok parlak kalirdi,
 * opaklik ile kisilir — sabit renk yazmadan ayni etkiyi verir.
 */
export function Hairline({
  className = "",
  tone = "border",
}: {
  className?: string;
  tone?: "border" | "gold";
}) {
  const color =
    tone === "gold"
      ? "bg-[var(--brand-primary)] opacity-40"
      : "bg-[var(--brand-border)]";
  return <div aria-hidden="true" className={`h-px w-full ${color} ${className}`} />;
}

/**
 * Ortalanmis bolum basligi (Menu, Galeri).
 * Etiket ustte, altinda serif baslik, altinda kisa altin cizgi.
 */
export function CenteredHeading({
  eyebrow,
  title,
  titleId,
  children,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className={label}>{eyebrow}</p>
      <h2
        id={titleId}
        className="brand-display mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.25] text-balance"
      >
        {title}
      </h2>
      <Hairline tone="gold" className="mt-8 max-w-24" />
      {children}
    </div>
  );
}
