import type { ReactNode } from "react";

/**
 * Kırk Yıl'a OZEL parcalar.
 *
 * NEDEN AYRI: bu tasarimin imzasi eski bir kahvehane tabelasi — cift cizgi,
 * ortalanmis her sey ve gorsellerin cevresindeki passe-partout cerceve.
 * Bunlar baska hicbir temada kullanilmadigi icin ortak katmana konmadi.
 */

/** Sayfa kabugu; tum bolumlerde ayni kenar boslugu. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10";

/**
 * Tabela/menu karti hissi ortalanmis DAR bir kolon ister; genis ekranda metin
 * kenardan kenara yayilirsa klasik duzen dagilir.
 */
export const column = "mx-auto w-full max-w-3xl";

/*
 * Zemin ky-paper ile geliyor: tasarimin kagidi duz degil, 16px'lik ince nokta
 * izgarasi tasiyor (doku tokens.css icinde tanimli).
 */
export const surface =
  "ky-paper bg-[var(--brand-surface)] text-[var(--brand-ink)]";
export const surfaceAlt = "bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]";

/**
 * Kunye yazisi: kucuk, genis harf arali. RENK ICERMEZ.
 *
 * NEDEN: sinifa renk gomulurse cagri yerindeki `text-[var(--brand-primary)]`
 * ile ayni ozgullukte iki kural cikiyor ve hangisinin kazandigini CSS
 * dosyasindaki siralama belirliyor. Rengi her zaman cagri yeri versin.
 */
export const meta = "brand-body brand-eyebrow text-xs";

/** Kunye yazisinin soluk hali — varsayilan kullanim. */
export const metaMuted = `${meta} text-[var(--brand-ink-muted)]`;

/** Bolum kunyesi: tasarimda altin sarisi ve 12px. */
export const eyebrow =
  "brand-body brand-eyebrow text-xs text-[var(--brand-accent)]";

/**
 * Cagri butonlari.
 *
 * NEDEN BURADA: tasarimda hero'da YAN YANA iki buton var — dolu bordo ve
 * cerceveli — ve ikisinin de olcusu ayni (15px 32px, 12.5px / .2em yazi).
 * Ikisi ayni yerde tanimli olmazsa zamanla birbirinden ayrisiyorlar.
 * `whitespace-nowrap`: uppercase + genis harf araligi ile kisa etiketler bile
 * dar ekranda ortadan boluniyor.
 */
const button =
  "ky-btn-label inline-flex items-center justify-center whitespace-nowrap px-8 py-[15px] transition-colors";

/** Birincil: dolu bordo, hover'da murekkep tonuna koyulasir (tasarimdaki gibi). */
export const buttonSolid = `${button} bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)] hover:bg-[var(--brand-ink)]`;

/** Ikincil: yalniz cerceve; hover'da cerceve ve yazi bordoya doner. */
export const buttonGhost = `${button} brand-frame text-[var(--brand-ink)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]`;

/**
 * Cift cizgi: tabelalarin ust/alt kenari.
 * Tasarimdaki deger birebir 3px double; tarayici bunu 1px cizgi + 1px bosluk +
 * 1px cizgi olarak cizer, yani tek elemanla iki cizgi elde ederiz.
 */
export function DoubleRule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`border-t-[3px] border-double border-[var(--ky-rule-color)] ${className}`}
    />
  );
}

/**
 * Basliklarin altindaki ortalanmis ayrac (ortada elmas).
 * Genislik tasarimdaki 80px cizgi + 16px bosluk olcusune gore; elmas, fonta
 * bagimli kalmamak icin cevrilmis kare (tasarimdaki ✦ glifi yerine).
 *
 * `wide`: tasarimda hero'nun altindaki ayrac 120px cizgi + 20px bosluk ile
 * belirgin sekilde daha genis. Genislik prop ile veriliyor cunku disaridan
 * gelen bir `w-*` sinifi buradakiyle ayni ozgullukte olur ve ezemez.
 */
export function Ornament({
  className = "",
  wide = false,
}: {
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex items-center ${
        wide ? "w-72 gap-5" : "w-52 gap-4"
      } ${className}`}
    >
      <span className="h-px flex-1 bg-[var(--brand-accent)]" />
      <span className="size-1.5 rotate-45 border border-[var(--brand-accent)]" />
      <span className="h-px flex-1 bg-[var(--brand-accent)]" />
    </div>
  );
}

/** Ortalanmis bolum basligi: kunye + h2 + ayrac. */
export function SectionTitle({
  // Disaridaki API ayni kalsin diye prop adi `eyebrow`; ayni isimli sinif
  // sabitini golgelememesi icin iceride yeniden adlandirildi.
  eyebrow: eyebrowText,
  title,
  titleId,
  children,
}: {
  eyebrow?: string;
  title: string;
  titleId: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-center">
      {eyebrowText ? <p className={eyebrow}>{eyebrowText}</p> : null}

      {/* Tasarim: kunyeden basliga 14px, basliktan ayraca 18px. */}
      <h2 id={titleId} className="brand-display ky-h2 mt-3.5 text-balance">
        {title}
      </h2>

      <Ornament className="mt-[18px]" />

      {children ? (
        <div className="ky-prose mx-auto mt-6 max-w-xl text-pretty text-[var(--brand-ink-muted)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Iki yaninda cizgi olan kategori basligi — eski fiyat listelerinin imzasi.
 * Cizgiler flex-1 oldugu icin baslik daima tam ortada kalir, RTL'de de.
 */
export function CategoryHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--brand-border)]" />
      <h3 className="brand-body brand-eyebrow text-xs text-[var(--brand-accent)]">
        {children}
      </h3>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--brand-border)]" />
    </div>
  );
}

/**
 * Passe-partout: cerceve + ic bosluk + ikinci ince cizgi.
 * Gorseller bu temada asla ciplak basilmaz; cerceve tabela estetiginin parcasi.
 */
export function Passepartout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`brand-frame bg-[var(--brand-surface-alt)] p-2.5 sm:p-3 ${className}`}
    >
      {/* ky-sepia: arsiv fotografi tonu — cerceve icindeki her gorsele. */}
      <div className="ky-sepia border border-[var(--brand-border)]">
        {children}
      </div>
    </div>
  );
}
