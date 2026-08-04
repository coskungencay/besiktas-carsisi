import type { ReactNode } from "react";

import type { MenuItem } from "@/themes/types";

/**
 * Mera'ya OZEL parcalar — bir yemek dergisinin ic sayfasi.
 *
 * NEDEN AYRI DOSYA: bu temanin imzasi "kutu yok, sadece cizgi" kurali, dergi
 * kunyesi hissi veren kucuk etiketler ve solda 220px'lik dar kunye kolonu olan
 * bolum izgarasi. Baska temalar bunlari kullanmaz; ortak katmana tasinirsa
 * tasarimlar birbirine benzemeye baslar.
 *
 * Olculer tasarim dosyasindan birebir alindi (1440px genislik referansi):
 * bolum ust boslugu 120px, ayirici cizgi sonrasi 40px, kunye kolonu 220px,
 * kolon araligi 64px, govde kolonu en fazla 900px.
 */

/** Dergi sayfasinin ic marjlari — tasarimda 56px, tum bolumlerde ayni. */
export const page =
  "mx-auto w-full max-w-[var(--brand-container)] px-5 sm:px-14 lg:px-14";

/** Bolum kabugu: zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Bolum ust boslugu. Tasarimda bolumlerin ALT dolgusu yok: her bolum kendi
 * ayirici cizgisiyle basliyor, bir sonrakine kadar 120px bosluk kaliyor.
 * Bu yuzden simetrik `brand-section` (padding-block) yerine yalnizca ust dolgu.
 */
export const sectionPad =
  "pt-[var(--brand-section-py)] lg:pt-[var(--brand-section-py-lg)]";

/**
 * Ayirici cizgi + altindaki 40px'lik nefes.
 *
 * Cizgi rengi --brand-border DEGIL --mera-rule: tasarim cizgileri murekkebin
 * %16 opakligiyla ciziyor, kenarlik token'i bunun yaninda gorunmeyecek kadar
 * soluk kaliyordu (bkz. tokens.css).
 */
export const ruled = "border-t border-[var(--mera-rule)] pt-[var(--mera-rule-gap)]";

/**
 * Baglanti rengi.
 *
 * Tasarimin global stili `a { color:#A9502F } a:hover { color:#1A1714 }` —
 * yani sayfadaki TUM baglantilar marka renginde, ustune gelince mureekkebe
 * doner. Tek istisna ust cubuk navigasyonu: orada renk inline olarak soluk
 * griye eziliyor. Inline style'larda gorunmedigi icin kolayca atlanan bir
 * kural oldugundan tek yerde toplandi.
 */
export const link =
  "text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-ink)]";

/**
 * Kunye etiketi: 11.5px, genis harf araligi (token'dan gelir).
 *
 * Renksiz surum ayri duruyor: iki `text-[var(--…)]` sinifi ayni sinifta
 * bulusursa hangisinin kazandigi uretilen CSS sirasina kalir; renk degistirmek
 * isteyen (buton, vurgulu link) `labelBase` kullanip rengi kendi verir.
 */
export const labelBase = "brand-body brand-eyebrow text-[0.72rem] leading-none";
export const label = `${labelBase} text-[var(--brand-ink-muted)]`;
/** Bolum isaretcisi — tasarimda daima marka rengi. */
export const labelAccent = `${labelBase} text-[var(--brand-primary)]`;
/**
 * Kolon basligi (tasarimda "Saatler" / "Ulasin"): ayni olcek ve aralik, ama
 * bolum isaretcisiyle karismasin diye en soluk tonda — kapanis bolumunde
 * marka rengi yalnizca basligin kendisine ait.
 */
export const labelSoft = `${labelBase} text-[var(--brand-ink-faint)]`;
/** Fotograf altyazisi: en soluk ton, 11px, tasarimda .18em aralik. */
export const labelFaint =
  "brand-body mera-caption text-[0.6875rem] leading-none text-[var(--brand-ink-faint)]";
/**
 * Kapanis seridi: ayni olcek, marka adiyla ayni .16em aralik.
 * Renksiz surum, rengi kendi veren ogeler (baglantilar) icin ayri duruyor —
 * iki `text-[var(--…)]` sinifi ayni elemanda bulusursa hangisinin kazandigi
 * uretilen CSS sirasina kalirdi.
 */
export const labelStripBase =
  "brand-body mera-mark text-[0.6875rem] leading-none";
export const labelStrip = `${labelStripBase} text-[var(--brand-ink-faint)]`;

/**
 * Temanin ANA eylem bicimi.
 *
 * Bu tasarimda dolgulu buton YOK — hero'da bile buton yok, cunku dergi
 * kapaginda dugme olmaz. Tasarimin tek eylem ogesi kapanis bolumundeki
 * "Yol tarifi al →" baglantisi: 12px kunye punto, .18em aralik, marka renginde
 * ALT CIZGI. Menu sayfasina goturen baglantilar da ayni bicimi kullanir ki
 * sayfada iki farkli "buton dili" olusmasin.
 *
 * Ust bosluk verilmez: nerede kullanildigina cagiran karar verir.
 */
export const cta = `${labelBase} ${link} mera-caption inline-flex items-center gap-3 border-b border-[var(--brand-primary)] pb-1 text-[0.75rem]`;

/** Govde metni olcegi: tasarimda 15px / 1.7. */
export const bodyText =
  "text-[0.9375rem] leading-[1.7] text-pretty text-[var(--brand-ink-body)]";

/** Dergi sayfasini bolen sac teli cizgi. */
export function Hairline({ className = "" }: { className?: string }) {
  return (
    <hr className={`border-0 border-t border-[var(--mera-rule)] ${className}`} />
  );
}

/**
 * Bolum basligi — tasarimin ana izgarasi: solda 220px'lik kunye kolonu
 * (kucuk, marka renginde etiket), sagda govde. Baslik dev degil; tasarimda
 * bolum girisi 36px'lik hafif serif bir cumledir, agirlik hero'dadir.
 *
 * `children` sag kolona dusen govdedir; bolumun geri kalani da ayni 220px
 * hizasindan basladigi icin sayfa boyunca tek bir dikey cizgi hissi olusur.
 *
 * Hicbir yerde ortalanmaz — dergide baslik daima sayfanin baslangic kenarina
 * yaslanir; ortalanmis baslik bu tasarimi "kartvizit" gibi gosterirdi.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className={`${ruled} grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16`}
    >
      <div>
        <p className={labelAccent}>{eyebrow}</p>
        {/* Tasarimda kunye kolonunun altindaki kucuk not: 20px asagida. */}
        {aside ? <div className="mt-5">{aside}</div> : null}
      </div>

      <div className="min-w-0">
        {/* Bolum girisi tasarimda 36px, 300 agirlikta ve govde kolonunun
            900px'lik olcusunde kalir. */}
        <h2
          id={titleId}
          className="brand-display max-w-[900px] text-[clamp(1.6rem,3.2vw,2.25rem)] leading-[1.34] tracking-[-0.01em] text-pretty"
        >
          {title}
        </h2>

        {/* Tasarimda giris cumlesi ile govde arasi 30px. */}
        {children ? <div className="mt-[1.875rem]">{children}</div> : null}
      </div>
    </div>
  );
}

/**
 * Tam genislikte baslik satiri: solda kunye etiketi, sagda italik serif not.
 * Tasarimda yalnizca gorsel izgarasi olan bolum boyle acilir — cunku o izgara
 * 220px'lik kolona sigmaz, sayfanin tamamini kaplar.
 */
export function SectionHeadRow({
  eyebrow,
  title,
  titleId,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
}) {
  return (
    <div
      className={`${ruled} flex flex-wrap items-baseline justify-between gap-x-12 gap-y-3`}
    >
      <p className={labelAccent}>{eyebrow}</p>
      {/* mera-regular: tasarimda bu italik notta agirlik yazmiyor, yani 400. */}
      <h2
        id={titleId}
        className="brand-display mera-regular text-[clamp(1.15rem,2.4vw,1.375rem)] italic text-pretty text-[var(--brand-ink-body)] rtl:not-italic"
      >
        {title}
      </h2>
    </div>
  );
}

/**
 * Menu satiri — basili menulerin "ad ......... fiyat" alistirmasi.
 *
 * NEDEN ORTAK: ayni satir hem ana sayfadaki vitrin bolumunde hem de tam menu
 * sayfasinda geciyor. Iki yerde ayri ayri yazilirsa biri degistiginde digeri
 * geride kalir ve ayni sitede iki farkli menu dili olusur.
 *
 * Noktali dolgu ayri bir <span> olarak esner ve fiyati daima satirin sonuna
 * yaslar. 390px'de GIZLENIR: dar ekranda uzun bir urun adi ile fiyat arasinda
 * zaten yer kalmiyor, dolgu birkac piksele sikisip cizik gibi gorunuyordu.
 * Orada fiyati `ms-auto` sona atar; ad cok uzunsa satir sarar ve fiyat alt
 * satirin sonuna iner — ust uste binme olmaz.
 *
 * Kendisi <li> dondurur: alt cizgiyi kapatan `last:border-0` ancak liste
 * ogesinin KENDISINDE calisir; ara bir sarmalayici konulursa her satir
 * "son cocuk" olur ve tum ayraclar kaybolur.
 */
export function MenuLine({
  item,
  badge,
}: {
  item: MenuItem;
  /** "One cikan" etiketi. Bos birakilirsa basilmaz. */
  badge?: string;
}) {
  return (
    /* Ustune gelince satir isinir (tasarim: marka renginin %5'i). Yatay dolgu
       YOK — tasarimda da zemin satirin tam genisligini kapliyor. */
    <li className="border-b border-[var(--mera-hair-soft)] py-[0.9375rem] transition-colors last:border-0 hover:bg-[var(--mera-row-hover)]">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="min-w-0 text-base">{item.name}</span>

        {badge ? <span className={label}>{badge}</span> : null}

        {/* Noktali dolgu: yalnizca fiyat varsa anlamli. */}
        {item.price ? (
          <>
            <span
              aria-hidden="true"
              className="mb-[5px] hidden min-w-6 flex-1 border-b border-dotted border-[var(--mera-dot)] sm:block"
            />
            {/* dir=ltr: para birimi ve rakam sirasi Arapca'da da bozulmasin.
                shrink-0 + break-normal: fiyat satirin sabit ucudur — ad cok
                uzun oldugunda once ad sarar, fiyat ne daralir ne de rakamin
                ortasindan boluner (menu sayfasinda kagit `break-words`
                mirasini tum icerige veriyor, fiyat bunun disinda kalmali). */}
            <span
              className="ms-auto shrink-0 text-[0.875rem] tabular-nums break-normal text-[var(--brand-ink-body)]"
              dir="ltr"
            >
              {item.price}
            </span>
          </>
        ) : null}
      </div>

      {item.description ? (
        <p className="mt-1.5 max-w-md text-[0.8125rem] leading-[1.6] text-pretty italic text-[var(--brand-ink-faint)] rtl:not-italic">
          {item.description}
        </p>
      ) : null}
    </li>
  );
}

/**
 * Kunye satiri: baslangicta kucuk etiket, sonda deger, altinda cizgi.
 * Tasarimda 13px, hafif harf araligi ve yalnizca 10px alt dolgu; kutu yok
 * (temanin radius'u zaten 0). Son satirda cizgi kapatilir.
 */
export function RuleRow({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <div className="mera-row flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-[var(--mera-hair)] pb-2.5 text-[0.8125rem] last:border-0 last:pb-0">
      <dt className="text-[var(--brand-ink-muted)]">{term}</dt>
      <dd className="text-end text-[var(--brand-ink)]">{children}</dd>
    </div>
  );
}
