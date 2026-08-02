/**
 * Patika'ya OZEL parcalar — "konser afisi / sticker" dili.
 *
 * NEDEN AYRI DOSYA: bu temanin imzasi kalin kenarlik + yuvarlak kose + rozet
 * ucgeni. Ayni ucluyu her bolumde elle yazmak yerine burada tek yerde tutuyoruz;
 * boylece token degisince (radius, border-width) tum tema birlikte kayiyor.
 *
 * Butun olculer var(--brand-*) uzerinden: sabit renk/radius/font YOK.
 */

/** Afis kenar boslugu — dar ekranda daha az, cunku bloklar zaten kalin. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-8";

/** Bolum kabugu: koyu zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Tek kenar cizgileri. Tailwind'in `border-b` sinifi 1px sabitler; bu tema
 * kalinligi token'dan okumak zorunda, o yuzden [length:] ipucu kullaniliyor.
 */
export const edgeTop =
  "border-t-[length:var(--brand-border-width)] border-[var(--brand-border)]";
export const edgeBottom =
  "border-b-[length:var(--brand-border-width)] border-[var(--brand-border)]";

/* -------------------------------------------------------------------------- */
/*                                   Rozetler                                  */
/* -------------------------------------------------------------------------- */

const pillBase =
  "inline-flex items-center gap-2 brand-rounded px-4 py-2 text-xs brand-eyebrow";

/** Notr rozet: nav linkleri, ikincil etiketler. */
export const pillLine = `${pillBase} border-[length:var(--brand-border-width)] border-[var(--brand-border)] text-[var(--brand-ink-muted)]`;

/** Vurgu rozeti: hero kunyeleri, bolum eyebrow'lari — neon kenarlik. */
export const pillAccent = `${pillBase} border-[length:var(--brand-border-width)] border-[var(--brand-primary)] text-[var(--brand-primary)]`;

/** Dolu rozet: cagri butonlari ve fiyat etiketi. */
export const pillSolid = `${pillBase} bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]`;

/** Kalin cerceveli blok — menu karti, iletisim karti, form kutusu. */
export const card = "brand-frame bg-[var(--brand-surface-alt)] p-5";

/* -------------------------------------------------------------------------- */
/*                                Bolum basligi                                */
/* -------------------------------------------------------------------------- */

/**
 * Afis basligi: ustte neon rozet, altinda DEV kalin baslik.
 *
 * `centered` bilerek prop: About ve Menu ortalanmis, Contact ve Gallery
 * sola dayali basliyor — bolumler arasi ritmi bu fark tasiyor.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  centered?: boolean;
}) {
  return (
    <div
      className={
        centered
          ? "flex flex-col items-center text-center"
          : "flex flex-col items-start text-start"
      }
    >
      <p className={pillAccent}>{eyebrow}</p>
      <h2
        id={titleId}
        className="brand-display mt-5 text-[clamp(2rem,7vw,4rem)] leading-[0.92] text-balance"
      >
        {title}
      </h2>
    </div>
  );
}
