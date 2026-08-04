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

import type { ReactNode } from "react";

/**
 * Afis kenar boslugu. Genis ekranda 40px — tasarimdaki header/section
 * padding'i ile ayni; boylece ust serit ile hero ayni dikey cizgide baslar.
 */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-10 lg:px-10";

/** Bolum kabugu: koyu zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Ust seridin alt cizgisi. Tailwind'in `border-b` sinifi 1px sabitler; bu tema
 * kalinligi token'dan okumak zorunda, o yuzden [length:] ipucu kullaniliyor.
 * (Ust cizgi karsiligi yok: tasarimda sayfayi kapatan ayrac lime blogun kendisi.)
 */
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

/*
 * Notr rozet: hero kunyeleri, ikincil etiketler.
 *
 * Kenarlik BILEREK kart kenarligindan acik: tasarimda kartlar #2C2C24,
 * hero rozetleri #3A3A33. Koyu zeminde ince bir rozet kart kenarligiyla ayni
 * tonda olunca kaybolmus gibi duruyor.
 */
export const pillLine = `${pillBase} border-[var(--brand-border-soft)] text-[var(--brand-ink)]`;

/** Dolu rozet: cagri butonlari. */
export const pillSolid = `${pillBase} border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]`;

/**
 * Ust seritteki nav linki: rozetin daha kucuk, BUYUK HARF ve genis harf
 * aralikli hali (tasarim: 12px / 8px-14px ic bosluk / .06em).
 *
 * Yatay ic bosluk BASE'DE YOK, iki turevde ayri ayri yaziliyor: ayni sinif
 * dizisinde px-3.5 ve px-4 birlikte bulunursa hangisinin kazanacagini
 * Tailwind'in ic siralamasi belirler, olcu o siralamaya emanet edilmemeli.
 */
const navBase =
  "pk-caps-sm inline-flex items-center rounded-[var(--brand-radius-pill)] border-[length:var(--brand-border-width)] py-2 leading-none transition-colors";

export const navLink = `${navBase} border-[var(--brand-border)] px-3.5 text-[var(--brand-ink)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]`;

/* Dolu cagri rozeti tasarimda bir tik daha genis: 8px/16px ic bosluk. */
export const navCta = `${navBase} border-[var(--brand-primary)] bg-[var(--brand-primary)] px-4 text-[var(--brand-primary-contrast)] hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]`;

/* -------------------------------------------------------------------------- */
/*                                Bolum basligi                                */
/* -------------------------------------------------------------------------- */

/**
 * Afis basligi: TEK KAT — dev buyuk harf baslik ve yanina istege bagli kucuk
 * bir baglanti.
 *
 * NEDEN ACIKLAMA SATIRI YOK: tasarimda menu basliginin sagina bir cumlelik
 * tanitim metni dusuyor, ama o metnin veri karsiligi yok — sozluk arayuz
 * kromu tasir, musteri icerigi de bolum basina aciklama alani icermez. Bos
 * kalacak bir slot birakmak yerine baslik tek basina duruyor.
 *
 * NEDEN EYEBROW YOK: tasarimda bolum basliklarinin ustunde kucuk etiket satiri
 * YOK; tek eyebrow hero'daki semt satiri. Her bolume bir etiket + bir baslik
 * koymak basligin vurusunu bolup sayfayi katmanli gosteriyordu.
 *
 * NEDEN IKI OLCU: tasarimda tek bir dev baslik var (menu, 76px); mekan bolumu
 * 56px. Butun bolumler 76px olursa "en yuksek ses" kalmiyor, hepsi ayni tonda
 * bagiriyor. Bu yuzden varsayilan 56px, yalnizca menu `size="lg"`.
 *
 * NEDEN SOLA DAYALI: tasarimda butun bolumler ayni sol cizgiden basliyor,
 * sagdaki aciklama tabana oturuyor (align-items:flex-end). Ortalama yok —
 * ritmi bu tek hizalama tasiyor.
 */
export function SectionHead({
  title,
  titleId,
  size = "md",
  action,
}: {
  title: string;
  titleId: string;
  size?: "md" | "lg";
  action?: ReactNode;
}) {
  return (
    // Baslik ve yanindaki baglanti ayni TABAN CIZGISINDE (tasarim: baseline).
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
      <h2
        id={titleId}
        className={`${size === "lg" ? "pk-h2" : "pk-h3"} text-balance`}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}
