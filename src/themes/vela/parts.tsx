import type { ReactNode } from "react";

/**
 * Vela'ya OZEL kucuk parcalar.
 *
 * NEDEN AYRI DOSYA: bu temanin imzasi uc seyde: cok genis harf arali altin
 * etiketler, saydam altin ince cizgiler ve serif basliklar. Bunlar her bolumde
 * tekrar ettigi icin tek yerde tanimlandi; baska temalar kullanmaz.
 *
 * Buradaki olculer tasarim dosyasindan birebir alindi (11px / 11.5px / 13px /
 * 14.5px / 15px). rem karsiliklari 16px taban uzerinden hesaplandi.
 */

/**
 * Ic kenar boslugu.
 * Tasarim 1440px'de saglı sollu 60px bosluk kullaniyor; lg kiriliminda birebir
 * o degere gecilir (kucuk ekranlarda 60px cok fazla olurdu).
 */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10 lg:px-[3.75rem]";

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

/**
 * Meta satiri: tasarimdaki 11.5px / .22em olcusu (nav, saat notu, buton).
 * Eyebrow'dan biraz daha dar aralikli oldugu icin ayri bir token kullanir.
 */
const metaBase =
  "brand-body text-[0.71875rem] leading-[1.6] uppercase tracking-[var(--brand-nav-tracking)]";

export const meta = `${metaBase} text-[var(--brand-primary)]`;
export const metaMuted = `${metaBase} text-[var(--brand-ink-muted)]`;
export const metaInk = `${metaBase} text-[var(--brand-ink)]`;

/** Govde metni: tasarimda 15px / 1.8 ve kisilmis kontrast. */
export const prose =
  "text-[0.9375rem] leading-[1.8] text-pretty text-[var(--brand-ink-muted)]";

/** Kart ici govde: tasarimda 14.5px / 1.85. */
export const proseSm =
  "text-[0.90625rem] leading-[1.85] text-pretty text-[var(--brand-ink-muted)]";

/** Dipnot olcusu (urun aciklamasi, saat notu): tasarimda 13px. */
export const proseFine =
  "text-[0.8125rem] leading-[1.75] text-pretty text-[var(--brand-ink-muted)]";

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
 * Yorum yildizi.
 *
 * NEDEN ORTAK IKON DOSYASINDA DEGIL: bu yildiz Vela'nin ince cizgi diline
 * gore cizildi (dolu = altin govde, bos = sac teli kontur). Baska tema ayni
 * yildizi ayni incelikte istemez.
 *
 * Cagiran taraf renk vermez: yildiz her zaman icinde bulundugu metnin
 * rengini alir (currentColor), yani panelden altin tonu degisince o da kayar.
 */
export function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.2"
      // Tasarimdaki kucuk meta olcusu (13px) ile ayni yukseklik.
      className={`size-[0.8125rem] shrink-0 ${filled ? "" : "opacity-35"}`}
    >
      <path
        d="M12 3.1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.6l6.4-.6z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Bolum basligi.
 *
 * Tasarimda basliklar ORTALANMIS DEGIL: solda buyuk serif baslik, sagda dar
 * bir aciklama kolonu ve ikisi ayni taban cizgisinde duruyor. Baslik olcusu
 * tasarimdaki 46px'e (2.875rem) kadar cikiyor.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-baseline lg:justify-between lg:gap-16">
      <div>
        <p className={label}>{eyebrow}</p>
        <h2
          id={titleId}
          className="brand-display mt-5 text-[clamp(2rem,4.5vw,2.875rem)] leading-[1.1] tracking-[-0.005em] text-balance"
        >
          {title}
        </h2>
      </div>

      {note ? (
        <p className="max-w-[26.25rem] text-[0.875rem] leading-[1.75] text-pretty text-[var(--brand-ink-muted)]">
          {note}
        </p>
      ) : null}

      {children}
    </div>
  );
}
