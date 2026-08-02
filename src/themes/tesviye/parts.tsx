import type { CSSProperties, ReactNode } from "react";

/**
 * Tesviye'ye OZEL parcalar.
 *
 * Tasarimin imzasi teknik cizim paftasi: her bolum kalin cerceveli TEK bir
 * kutu, kutunun basinda numarali kunye seridi, ic bolmeler yine kalin
 * cizgilerle ayrilmis. Bu kabuk bes bolumde tekrar ettigi icin tek yerde
 * duruyor; boylece cizgi kalinligi ve kunye duzeni bolumler arasinda kaymaz.
 *
 * DIKKAT — punto yazarken `text-[length:var(--ts-...)]` KULLANIN.
 * `text-[var(...)]` yazildiginda Tailwind degerin renk mi olcu mu oldugunu
 * bilemez ve RENK varsayar: kural font-size uretmez, butun puntolar sessizce
 * 16px'e duser. Bu temada dev Anton basliklarin 16px cikmasinin sebebi buydu.
 */

/** Sayfa ic kenar boslugu — paftalar kenara yakin dursun diye dar tutuldu. */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-4 sm:px-6";

/**
 * Monospace teknik etiket: kunye, kategori adi, alan basligi.
 * Tasarim olcusu 11.5px / agirlik 600 / ls .16em (brand-eyebrow'dan gelir).
 */
export const mono =
  "brand-body brand-eyebrow text-[length:var(--ts-label-lg)] leading-[1.4] font-semibold";

/**
 * Kutu ici alan basligi: tasarimda 11px / 600 / ls .18em ve altinda 14px
 * bosluk. mono'dan ayri durmasinin sebebi harf araliginin farkli olmasi.
 */
export const label =
  "brand-body text-[length:var(--ts-label)] leading-[1.4] font-semibold uppercase tracking-[var(--ts-track-label)]";

/**
 * Koyu zeminli tablo basligi seridi: tasarimda 11px / 600 / ls .14em.
 * label'dan (.18em) daha dar — genis harf araligi koyu zeminde metni
 * dagitip okunmaz hale getiriyordu.
 */
export const tableHead =
  "brand-body text-[length:var(--ts-label)] leading-[1.4] font-semibold uppercase tracking-[var(--ts-track-table)]";

/**
 * Serit/kunye satiri: ust bilgi seridi. Tasarimda 12px / agirlik 300 /
 * ls .04em — etiketten daha sakin durur, bilgi tasir vurgu yapmaz.
 */
export const meta =
  "brand-body text-[length:var(--ts-meta)] leading-[1.5] font-light uppercase tracking-[var(--ts-track-meta)]";

/**
 * Teknik ozet tablosu (hero'daki kunye satirlari).
 *
 * meta'dan AYRI: tasarimda ayni harf araligini kullanir ama agirligi 400 ve
 * satir yuksekligi 1.9'dur — satirlar arasinda cetvel gibi genis bir nefes
 * birakir. meta'ya ek sinif yazip ezmek Tailwind'de kaynak sirasina bagli
 * olurdu (font-light vs font-normal), bu yuzden kendi sinifi var.
 */
export const specList =
  "brand-body text-[length:var(--ts-meta)] leading-[1.9] uppercase tracking-[var(--ts-track-meta)]";

/** Govde metni: tasarimda 14px / 1.75 / agirlik 300. */
export const bodyText =
  "text-[length:var(--ts-body)] leading-[var(--ts-body-leading)] font-light text-pretty";

/** Kutu icindeki kisa govde: 13.5px / 1.8 / agirlik 300. */
export const bodyTextSm =
  "text-[length:var(--ts-body-sm)] leading-[var(--ts-body-sm-leading)] font-light text-pretty";

/**
 * Kalin ayrac stilleri.
 *
 * NEDEN inline style: cizgi kalinligi token'dan (--brand-border-width) gelmeli,
 * ama Tailwind `border-t-[var(...)]` yaziminda degerin renk mi kalinlik mi
 * oldugunu tahmin etmek zorunda kalir; yanlis tahminde cizgi sessizce kaybolur.
 * Bu tasarimda cizgiler susleme degil DUZENIN KENDISI, o yuzden riske girilmiyor.
 */
export const edgeTop: CSSProperties = {
  borderTopWidth: "var(--brand-border-width)",
  borderTopStyle: "solid",
  borderTopColor: "var(--brand-border)",
};

export const edgeBottom: CSSProperties = {
  borderBottomWidth: "var(--brand-border-width)",
  borderBottomStyle: "solid",
  borderBottomColor: "var(--brand-border)",
};

/** Satir ici dikey ayrac. Mantiksal kenar: Arapca'da otomatik sola gecer. */
export const edgeEnd: CSSProperties = {
  borderInlineEndWidth: "var(--brand-border-width)",
  borderInlineEndStyle: "solid",
  borderInlineEndColor: "var(--brand-border)",
};

/**
 * Kalin cizgiyle bolunmus izgara.
 *
 * Hucreler arasindaki bosluk, kabin zemininin (cizgi rengi) gorundugu yerdir;
 * boylece komsu hucrelerde cift kenarlik olusmaz. Sutun sayisini cagiran verir
 * ve TAM DOLACAK sekilde secmelidir — eksik hucre koyu bir blok birakir.
 */
export const splitGrid =
  "grid gap-[var(--brand-border-width)] bg-[var(--brand-border)]";

/** splitGrid icindeki hucre: zemini geri kazanir. */
export const cell = "bg-[var(--brand-surface)]";

/**
 * Kutu icindeki ince veri satiri ayraci (kalin cizgilerden ayrilsin diye 1px).
 * Renk --ts-hair: tasarimda bu cizgiler saydam murekkep, duz gri degil.
 */
export const hair = "border-t border-[var(--ts-hair)]";

/**
 * Eylem hucresi metni (hero'nun altindaki serit): tasarimda 12px / 600 /
 * ls .16em. `mono` DEGIL cunku o 11.5px'lik kunye olcusu; burada hucre 96px
 * yuksekliginde ve metin tek basina duruyor, yarim punto fark goze carpiyor.
 */
export const actionLabel =
  "brand-body brand-eyebrow text-[length:var(--ts-meta)] leading-[1.4] font-semibold";

/**
 * Kutu ic dolgusu — metin bolmelerinde ayni kalsin diye.
 * Tasarimda buyuk ekranda 34px (--ts-pad), kucuk kutularda 26px/24px.
 */
export const pad = "px-4 py-6 sm:px-[var(--ts-pad)] sm:py-[var(--ts-pad)]";

/**
 * Kucuk hucre dolgusu — tasarimda ic kutucuklar 26px/24px kullaniyor.
 *
 * NEDEN pad'den ayri: yorum karti ve SSS cevabi gibi dar hucrelerde 34px
 * dolgu metni bogup satiri iki kelimeye dusuruyordu; tasarimin kendi kucuk
 * kutu olcusu bu.
 */
export const padSm = "px-4 py-5 sm:px-6 sm:py-[26px]";

/** Bolum paftasi: kalin cerceve + zemin. */
export function Sheet({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`brand-frame bg-[var(--brand-surface)] ${className}`}>
      {children}
    </div>
  );
}

/**
 * Pafta kunyesi: solda kose numarasi, yaninda monospace etiket, altinda
 * bolumun buyuk basligi. Numara yalnizca gorsel bir isaret oldugu icin
 * ekran okuyuculardan gizlenir.
 */
export function SheetHead({
  code,
  eyebrow,
  title,
  titleId,
}: {
  code: string;
  eyebrow: string;
  title: string;
  titleId: string;
}) {
  return (
    <div style={edgeBottom}>
      <div className="flex items-stretch" style={edgeBottom}>
        <p
          className={`${mono} flex items-center px-[18px] py-[13px] tabular-nums text-[var(--brand-primary)]`}
          style={edgeEnd}
          aria-hidden="true"
        >
          {code}
        </p>
        <p className={`${mono} flex items-center px-[18px] py-[13px]`}>
          {eyebrow}
        </p>
      </div>

      <h2
        id={titleId}
        /*
         * leading 1.14 tasarimdaki konum basligindan geliyor. Daha siki bir
         * deger (0.95) Turkce buyuk Ç/Ş kuyrugunu satir kutusunun disina
         * tasirip alttaki satira sokuyordu.
         */
        className="brand-display px-4 py-6 text-[length:var(--ts-title)] leading-[var(--ts-title-leading)] text-balance uppercase sm:px-[var(--ts-pad)] sm:py-[var(--ts-pad)]"
      >
        {title}
      </h2>
    </div>
  );
}
