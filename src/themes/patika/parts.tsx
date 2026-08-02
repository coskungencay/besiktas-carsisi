/**
 * Patika'ya OZEL parcalar — "konser afisi / sticker" dili.
 *
 * NEDEN AYRI DOSYA: bu temanin imzasi kalin kenarlik + tam yuvarlak rozet +
 * dev buyuk harf baslik. Ayni ucluyu her bolumde elle yazmak yerine burada tek
 * yerde tutuyoruz; boylece token degisince (radius, border-width) tum tema
 * birlikte kayiyor.
 *
 * Butun olculer var(--brand-*) ya da tokens.css'teki pk-* siniflari uzerinden:
 * sabit renk/radius/font YOK.
 */

/**
 * Afis kenar boslugu. Genis ekranda 40px — tasarimdaki header/section
 * padding'i ile ayni; boylece ust serit ile hero ayni dikey cizgide baslar.
 */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-10 lg:px-10";

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

/*
 * Tasarimdaki rozet olcusu: 9px/16px ic bosluk, 12.5px yazi, 2px kenarlik ve
 * TAM yuvarlak kose (100px) — kart radius'undan bagimsiz kendi token'i var.
 */
const pillBase =
  "inline-flex items-center gap-2 rounded-[var(--brand-radius-pill)] border-[length:var(--brand-border-width)] px-4 py-[0.5625rem] text-[0.78125rem] font-medium leading-none";

/** Notr rozet: hero kunyeleri, ikincil etiketler. */
export const pillLine = `${pillBase} border-[var(--brand-border)] text-[var(--brand-ink)]`;

/** Vurgu rozeti: one cikan urun etiketi — neon kenarlik. */
export const pillAccent = `${pillBase} border-[var(--brand-primary)] text-[var(--brand-primary)]`;

/** Dolu rozet: cagri butonlari. */
export const pillSolid = `${pillBase} border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]`;

/**
 * Ust seritteki nav linki: rozetin daha kucuk, BUYUK HARF ve genis harf
 * aralikli hali (tasarim: 12px / 8px-14px ic bosluk / .06em).
 */
const navBase =
  "pk-caps-sm inline-flex items-center rounded-[var(--brand-radius-pill)] border-[length:var(--brand-border-width)] px-3.5 py-2 leading-none transition-colors";

export const navLink = `${navBase} border-[var(--brand-border)] text-[var(--brand-ink)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]`;

export const navCta = `${navBase} border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)] hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]`;

/** Kalin cerceveli blok — menu karti, iletisim karti, form kutusu. */
export const card = "brand-frame bg-[var(--brand-surface-alt)] p-6";

/* -------------------------------------------------------------------------- */
/*                                Bolum basligi                                */
/* -------------------------------------------------------------------------- */

/**
 * Afis basligi: ustte neon eyebrow, altinda DEV buyuk harf baslik; genis
 * ekranda sagda tabana hizalanmis kisa bir aciklama.
 *
 * NEDEN SOLA DAYALI: tasarimda butun bolumler ayni sol cizgiden basliyor,
 * sagdaki aciklama tabana oturuyor (align-items:flex-end). Ortalama yok —
 * ritmi bu tek hizalama tasiyor.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  note,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
      <div>
        <p className="pk-eyebrow text-[var(--brand-primary)]">{eyebrow}</p>
        <h2 id={titleId} className="pk-h2 mt-3 text-balance">
          {title}
        </h2>
      </div>

      {note ? (
        <p className="pk-body max-w-[26rem] text-pretty text-[var(--brand-ink-muted)]">
          {note}
        </p>
      ) : null}
    </div>
  );
}
