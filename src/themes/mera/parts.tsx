import type { ReactNode } from "react";

/**
 * Mera'ya OZEL parcalar — bir yemek dergisinin ic sayfasi.
 *
 * NEDEN AYRI DOSYA: bu temanin imzasi "kutu yok, sadece cizgi" kurali ve
 * dergi kunyesi hissi veren kucuk etiketler. Baska temalar bunlari kullanmaz;
 * ortak katmana tasinirsa tasarimlar birbirine benzemeye baslar.
 */

/** Dergi sayfasinin ic marjlari — tum bolumlerde ayni. */
export const page =
  "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-8 lg:px-14";

/** Bolum kabugu: zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Kunye etiketi: cok kucuk, genis harf araligi (token'dan gelir).
 *
 * Renksiz surum ayri duruyor: iki `text-[var(--…)]` sinifi ayni sinifta
 * bulusursa hangisinin kazandigi uretilen CSS sirasina kalir; renk degistirmek
 * isteyen (buton, vurgulu link) `labelBase` kullanip rengi kendi verir.
 */
export const labelBase = "brand-body brand-eyebrow text-[0.68rem] leading-none";
export const label = `${labelBase} text-[var(--brand-ink-muted)]`;

/** Dergi sayfasini bolen sac teli cizgi. */
export function Hairline({ className = "" }: { className?: string }) {
  return (
    <hr
      className={`border-0 border-t border-[var(--brand-border)] ${className}`}
    />
  );
}

/**
 * Bolum baslligi: ustte kucuk kunye, altinda dev serif baslik, en altta
 * sayfayi bastan sona kesen cizgi.
 *
 * Hicbir yerde ortalanmaz — dergide baslik daima sayfanin baslangic kenarina
 * yaslanir; ortalanmis baslik bu tasarimi "kartvizit" gibi gosterirdi.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  lead,
  aside,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  lead?: string;
  aside?: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div className="max-w-3xl">
          <p className={label}>{eyebrow}</p>
          <h2
            id={titleId}
            className="brand-display mt-4 text-3xl leading-[1.05] tracking-[-0.01em] text-balance sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>

      {lead ? (
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
          {lead}
        </p>
      ) : null}

      <Hairline className="mt-8" />
    </div>
  );
}

/**
 * Kunye satiri: baslangicta kucuk etiket, sonda serif deger, altinda cizgi.
 * Kutu yerine yalnizca alt cizgi kullanir; temanin radius'u zaten 0.
 */
export function RuleRow({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-[var(--brand-border)] py-3.5">
      <dt className={label}>{term}</dt>
      <dd className="brand-display text-base text-end">{children}</dd>
    </div>
  );
}
