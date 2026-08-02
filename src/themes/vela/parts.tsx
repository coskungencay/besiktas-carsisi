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
 *
 * NEDEN sm'de 40px: onceki deger `sm:px-15` idi, yani 3.75rem — lg ile birebir
 * ayni. Yorumun soyledigi kademe pratikte yoktu ve 640px'lik bir ekranda
 * iki yandan 120px gidiyordu. Kademe artik 24 → 40 → 60px.
 */
export const shell =
  "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10 lg:px-[3.75rem]";

/** Bolum kabugu: koyu zemin + govde yazi tipi. */
export const surface = "bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/**
 * Bolum dolgusu — YALNIZCA USTTEN.
 *
 * NEDEN brand-section DEGIL: ortak utility dolguyu alta da veriyor, yani iki
 * bolum arasindaki bosluk 118px yerine 236px oluyordu. Tasarimda her bolum
 * `padding: 118px 60px 0` — alt dolgu YOK, aradaki nefesi bir sonraki bolumun
 * ust dolgusu veriyor. Sayfa boyunca ikiye katlanan bu bosluk bizimkini
 * tasarimdan cok daha uzun gosteriyordu.
 */
export const sectionTop =
  "pt-[var(--brand-section-py)] sm:pt-[var(--brand-section-py-lg)]";

/**
 * "Deneyim" ve "yorumlar" izgaralarinin kolon sayisi.
 *
 * Tasarimda tam uc kart var ve satir tam doluyor. Icerik DB'den geldigi icin
 * sayi degisken: sabit uc kolonda 1 kart uclu izgaranin bir hucresinde tek
 * basina, 2 kart ise yarim bir satir olarak kaliyordu — checklist'in "kolon
 * dengesi" maddesi tam olarak bu.
 *
 * Kural: uce tam bolunuyorsa ya da TEK sayiysa uc kolon (5 → 3+2, 7 → 3+3+1
 * yerine yine uclu ritim), cift sayiysa iki kolon (2 → 2, 4 → 2+2, 8 → 2x4).
 * Tek kart hic izgaraya girmez; satiri okunmaz uzunlukta olmasin diye
 * yalnizca bir olcu sinirina (45rem) alinir.
 *
 * NEDEN CAGIRAN TARAFTA `sm:grid-cols-2` YOK: ayni utility'nin iki ornegi
 * carpistiginda uretilen stil dosyasindaki sira kazanir, sinif dizisindeki
 * sira degil. Bu yuzden tum kirilimlar tek yerden, tek dize halinde veriliyor.
 */
export function balancedColumns(count: number) {
  if (count <= 1) return "max-w-[45rem]";
  if (count % 2 === 0 && count % 3 !== 0) return "sm:grid-cols-2";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

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

/**
 * Fotograf uzerindeki nav baglantisi: murekkebin %80'i (bkz.
 * --brand-ink-soft). Ust serit hero'nun uzerinde durdugu icin soluk gri
 * (metaMuted) burada okunmuyordu.
 */
export const metaSoft = `${metaBase} text-[var(--brand-ink-soft)]`;

/**
 * Baglanti rengi.
 *
 * Tasarimin <style> blogundaki global kural: `a { color:#C4A265 }` ve
 * `a:hover { color:#F2EDE4 }`. Yani sayfadaki TUM baglantilar altin, uzerine
 * gelince krem. Bu kural inline style'larda gorunmedigi icin ilk turda
 * atlanmisti; iletisim satirlari ve sosyal baglantilar murekkep renginde
 * kalmisti.
 */
export const goldLink =
  "text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-accent)]";

/** Govde metni: tasarimda 15px / 1.8 ve kisilmis kontrast. */
export const prose =
  "text-[0.9375rem] leading-[1.8] text-pretty text-[var(--brand-ink-muted)]";

/**
 * Hero'da FOTOGRAFIN UZERINDEKI govde metni: olcu `prose` ile ayni, rengi
 * daha parlak (bkz. --brand-ink-on-photo).
 *
 * NEDEN AYRI SINIF: rengi cagiran tarafta ikinci bir `text-*` ile ezmek
 * guvenilir degil — ayni utility'nin iki ornegi arasinda uretilen stil
 * dosyasindaki sira kazanir, sinif dizisindeki sira degil.
 */
export const proseOnPhoto =
  "text-[0.9375rem] leading-[1.8] text-pretty text-[var(--brand-ink-on-photo)]";

/** Kart ici govde: tasarimda 14.5px / 1.85. */
export const proseSm =
  "text-[0.90625rem] leading-[1.85] text-pretty text-[var(--brand-ink-muted)]";

/** Dipnot olcusu (urun aciklamasi, saat notu): tasarimda 13px. */
export const proseFine =
  "text-[0.8125rem] leading-[1.75] text-pretty text-[var(--brand-ink-muted)]";

/**
 * Temanin TEK buton bicimi.
 *
 * Tasarimdaki tek buton (rezervasyon talebi): ince altin cerceve, 15/32px
 * dolgu, 11.5px / .24em uppercase metin, uzerine gelince zemin altina donuyor.
 * Radius yok — tema genelinde kose yok.
 *
 * NEDEN TEK YERDE: ayni bicim artik uc yerde geciyor (yol tarifi, menu
 * vitrinindeki "tum menuyu gor", menu sayfasinin donus baglantisi). Uc kopya
 * zamanla birbirinden ayrilirdi.
 */
const buttonBase =
  "inline-flex items-center gap-3 border px-8 py-[0.9375rem] text-[0.71875rem] leading-[1.6] uppercase tracking-[var(--brand-meta-tracking)] transition-colors";

/** Koyu zemin uzerinde: altin cerceve, dolunca zemin altin olur. */
export const goldButton = `${buttonBase} border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]`;

/**
 * KREM panel uzerinde ayni buton.
 *
 * NEDEN AYRI: acik zeminde parlak altin okunmuyor; panelin kendi koyu altini
 * (--brand-primary-deep) kullanilir, dolunca yazi panel zeminine (krem) doner.
 */
export const goldButtonOnAccent = `${buttonBase} border-[var(--brand-primary-deep)] text-[var(--brand-primary-deep)] hover:bg-[var(--brand-primary-deep)] hover:text-[var(--brand-accent)]`;

/**
 * Sac teli cizgi.
 *
 * `tone="gold"` hero'daki uzun ayrac icin: tam altin cok parlak kalirdi,
 * opaklik ile kisilir — sabit renk yazmadan ayni etkiyi verir.
 *
 * Opaklik tasarimdaki degerlerden: altin ayraclar rgba(196,162,101,.35) ve
 * .28 arasinda; %35 ikisinin de gorunumunu veriyor. Onceki %40 belirgin
 * daha parlakti.
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
      ? "bg-[var(--brand-primary)] opacity-35"
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
