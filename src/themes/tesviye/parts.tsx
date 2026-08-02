import type { CSSProperties, ReactNode } from "react";

/**
 * Tesviye'ye OZEL parcalar.
 *
 * Tasarimin imzasi teknik cizim paftasi: sayfa kenardan kenara TEK bir
 * izgaradir. Bolumler ayri kutular degil, ayni paftanin 2px cizgilerle
 * ayrilmis bolmeleridir; her bolumun basinda 200px genisliginde bir kunye
 * rayi (bolum adi + numara) durur. Sayfa kenarinda dolgu, bolumler arasinda
 * bosluk YOKTUR — dolguyu hucrelerin kendisi tasir.
 *
 * DIKKAT — punto yazarken "length:" onekini KULLANIN, orn.
 * text-[length:var(--ts-hero)]. Onek olmadan Tailwind degerin renk mi olcu mu
 * oldugunu bilemez ve RENK varsayar: kural font-size uretmez, butun puntolar
 * sessizce 16px'e duser. Bu temada dev Anton basliklarin 16px cikmasinin
 * sebebi buydu.
 */

/**
 * Sayfa kabugu.
 *
 * Tasarimda sayfa genelinde max-width ve yan dolgu YOK; buradaki sinir bir
 * "tasarim genisligi" degil, 4K ekranda satirlar okunmaz olmasin diye konmus
 * ust sinirdir. YATAY DOLGU EKLEMEYIN: cizgiler ekran kenarindan baslamali.
 */
export const shell = "mx-auto w-full max-w-[var(--brand-container)]";

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
 * Adedi degisken listelerde bunun yerine gridClip/cellEdge kullanin.
 */
export const splitGrid =
  "grid gap-[var(--brand-border-width)] bg-[var(--brand-border)]";

/** splitGrid icindeki hucre: zemini geri kazanir. */
export const cell = "bg-[var(--brand-surface)]";

/* --------------------------------------------------------------------------
 * Adedi degisken izgaralar (galeri, yorumlar, hakkimizda bolmeleri)
 *
 * splitGrid'in zemin hilesi yalnizca izgara TAM dolarsa calisir; eksik kalan
 * son satir koyu bir blok olarak gorunur. Adet veritabanindan geldigi icin
 * bunu garanti edemeyiz. Cozum: cizgiler hucrenin kendi kenarligi olur,
 * izgara son satir/sutunda disari tasirilir ve tasan kenarlik kirpilir —
 * boylece ne cift cizgi ne de sarkan cizgi kalir.
 * -------------------------------------------------------------------------- */

/** Kirpma kabi — icindeki izgaranin tasan kenarligini gizler. */
export const gridClip = "overflow-hidden";

/** gridClip icindeki izgaraya eklenir. */
export const gridBleed =
  "-me-[var(--brand-border-width)] -mb-[var(--brand-border-width)]";

/** Adedi degisken izgaranin hucresi: sag ve alt kenarlik. */
export const cellEdge: CSSProperties = { ...edgeEnd, ...edgeBottom };

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

/** Serit hucresi dolgusu — ust serit ve liste satirlari (tasarimda 14-18px). */
export const padStrip = "px-4 py-[14px] sm:px-[18px]";

/**
 * Bolum paftasi: 200px kunye rayi + icerik.
 *
 * Tasarimda her bolum boyle basliyor: solda dar bir sutunda bolum adi ve mavi
 * sira numarasi, saginda bolumun kendisi. Numarali ray bu tasarimin imzasi;
 * bolum basligini yatay bir serit olarak basmak sayfayi siradan bir "baslik +
 * icerik" yigini yapiyordu.
 *
 * Baslik (h2) icerik sutununun basindaki BEYAN satiridir — tasarimda da
 * bolumler boyle aciliyor (36px/44px Anton). Ray'daki bolum adi kunyedir,
 * baslik degil; bu yuzden <p>.
 */
export function Plate({
  code,
  eyebrow,
  title,
  titleId,
  children,
}: {
  code: string;
  eyebrow: string;
  title: string;
  titleId: string;
  children: ReactNode;
}) {
  return (
    <div className={`${splitGrid} lg:grid-cols-[var(--ts-rail)_minmax(0,1fr)]`}>
      <p className={`${cell} ${mono} px-4 py-[26px] sm:px-[18px]`}>
        {eyebrow}
        <br />
        {/* Numara sadece gorsel bir isaret; ekran okuyucuya bilgi vermez. */}
        <span
          className="tabular-nums text-[var(--brand-primary)]"
          aria-hidden="true"
        >
          {code}
        </span>
      </p>

      <div className={cell}>
        {/*
          Ayrac cizgi SARMALAYICIDA: baslikta olsaydi max-width yuzunden cizgi
          de 1000px'de kesilir, pafta yarim cizilmis gorunurdu.
        */}
        <div style={edgeBottom}>
          <h2
            id={titleId}
            className={`brand-display ${pad} max-w-[62.5rem] text-[length:var(--ts-title)] leading-[var(--ts-lead-leading)] text-balance uppercase`}
          >
            {title}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
}
