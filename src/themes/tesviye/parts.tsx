import type { CSSProperties, ReactNode } from "react";

/**
 * Tesviye'ye OZEL parcalar.
 *
 * Tasarimin imzasi teknik cizim paftasi: her bolum kalin cerceveli TEK bir
 * kutu, kutunun basinda numarali kunye seridi, ic bolmeler yine kalin
 * cizgilerle ayrilmis. Bu kabuk bes bolumde tekrar ettigi icin tek yerde
 * duruyor; boylece cizgi kalinligi ve kunye duzeni bolumler arasinda kaymaz.
 */

/** Sayfa ic kenar boslugu — paftalar kenara yakin dursun diye dar tutuldu. */
export const shell = "mx-auto w-full max-w-[var(--brand-container)] px-4 sm:px-6";

/** Monospace teknik etiket: kunye, kategori adi, alan basligi. */
export const mono = "brand-body brand-eyebrow text-[0.6875rem]";

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
export const splitGrid = "grid gap-[var(--brand-border-width)] bg-[var(--brand-border)]";

/** splitGrid icindeki hucre: zemini geri kazanir. */
export const cell = "bg-[var(--brand-surface)]";

/** Kutu icindeki ince veri satiri ayraci (kalin cizgilerden ayrilsin diye 1px). */
export const hair = "border-t border-[var(--brand-ink-muted)]";

/** Kutu ic dolgusu — metin bolmelerinde ayni kalsin diye. */
export const pad = "px-4 py-6 sm:px-6 sm:py-8";

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
          className={`${mono} flex items-center px-3 py-2.5 tabular-nums text-[var(--brand-ink-muted)]`}
          style={edgeEnd}
          aria-hidden="true"
        >
          {code}
        </p>
        <p className={`${mono} flex items-center px-3 py-2.5`}>{eyebrow}</p>
      </div>

      <h2
        id={titleId}
        className="brand-display px-4 py-6 text-[clamp(1.75rem,5vw,3.25rem)] leading-[0.95] text-balance uppercase sm:px-6 sm:py-8"
      >
        {title}
      </h2>
    </div>
  );
}
