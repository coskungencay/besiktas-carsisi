import Image from "next/image";
import Link from "next/link";

import { fill } from "@/i18n";
import { hasMenu, menuHref } from "@/themes/_shared/data";
import { CupIcon } from "@/themes/_shared/icons";
import type { SiteContent } from "@/themes/types";

/* -------------------------------------------------------------------------- */
/*                                   Ikonlar                                   */
/* -------------------------------------------------------------------------- */

/** RTL'de otomatik donen ileri oku. */
export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={`size-4 shrink-0 rtl:-scale-x-100 ${className}`}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="size-4 shrink-0"
    >
      <path
        d="M6.6 3.5 9 3.9l1.2 3.4-1.9 1.4a12 12 0 0 0 5 5l1.4-1.9 3.4 1.2.4 2.4a1.8 1.8 0 0 1-1.9 2A16.5 16.5 0 0 1 4.6 5.4a1.8 1.8 0 0 1 2-1.9Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Yorum yildizi. `filled` false ise yalnizca cerceve cizilir, boylece 5'lik
 * olcek her zaman ayni genislikte durur.
 *
 * NOT: Ekran okuyucuya yildizlar okutulmaz (aria-hidden); puan metni yaninda
 * sr-only olarak verilir.
 */
export function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      className="size-4 shrink-0"
    >
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Aci/kapa isareti. Ok yerine arti kullanilir: yon barindirmadigi icin RTL'de
 * cevrilmesi gerekmez, acikken 45 derece donup carpiya donusur.
 */
export function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={`size-4 shrink-0 ${className}`}
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Marka isareti                                */
/* -------------------------------------------------------------------------- */

/**
 * Logo + isletme adi. Musteri panelden logo yuklediyse onu, yuklemediyse
 * temaya gomulu fincan ikonunu gosterir.
 */
export function BrandMark({
  content,
  stacked = false,
  iconClassName = "size-9",
}: {
  content: SiteContent;
  /** true ise ikon ve ad alt alta ortalanir (ortali hero'lar icin). */
  stacked?: boolean;
  iconClassName?: string;
}) {
  return (
    <div
      className={
        stacked
          ? "flex flex-col items-center gap-3"
          : "flex items-center gap-3"
      }
    >
      {content.logoUrl ? (
        <Image
          src={content.logoUrl}
          alt={fill(content.t.hero.logoAlt, { name: content.name })}
          width={72}
          height={72}
          className={`${iconClassName} shrink-0 object-contain`}
        />
      ) : (
        <CupIcon className={iconClassName} />
      )}
      <span className="brand-display brand-eyebrow text-lg">
        {content.name}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Butonlar                                   */
/* -------------------------------------------------------------------------- */

/*
 * Buton bicimleri TEK yerde duruyor. Menu artik ayri bir sayfa oldugu icin
 * ayni bicim uc yerde lazim (hero'daki "Menuyu Incele", ana sayfadaki vitrin
 * CTA'si, menu sayfasindaki geri donus). Sinif dizisini kopyalamak, biri
 * degisince digerlerinin sessizce geride kalmasi demekti.
 */

/** Dolu zeminli birincil buton — sayfa basina bir tane olmali. */
export const primaryButtonClass =
  "brand-rounded inline-flex items-center gap-2 bg-[var(--brand-primary)] px-6 py-3 text-sm font-medium text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85";

/** Cerceveli ikincil buton — birincilin yaninda veya sayfa sonunda. */
export const secondaryButtonClass =
  "brand-frame inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--brand-surface-alt)]";

export function HeroActions({
  content,
  className = "",
}: {
  content: SiteContent;
  className?: string;
}) {
  /*
   * Menude urun yoksa menu sayfasi da yok (route 404 veriyor); buton o zaman
   * gizlenmeli, yoksa hicbir yere gitmeyen kirik bir baglanti kaliyor.
   */
  const showMenuLink = hasMenu(content);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {showMenuLink ? (
        // Menu artik ana sayfada capa degil, ayri sayfa: istemci tarafi gecis.
        <Link href={menuHref(content)} className={primaryButtonClass}>
          <span>{content.t.hero.viewMenu}</span>
          <ArrowIcon />
        </Link>
      ) : null}

      {content.contact.phoneHref ? (
        <a
          href={content.contact.phoneHref}
          dir="ltr"
          className={secondaryButtonClass}
        >
          <PhoneIcon />
          <span>{content.contact.phone}</span>
        </a>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Bolum basligi                                */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  centered = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <p className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className="brand-display mt-4 text-3xl leading-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Kapsayici                                  */
/* -------------------------------------------------------------------------- */

export const containerClass =
  "mx-auto w-full max-w-[var(--brand-container)] px-6 sm:px-10";

/** Hero disindaki tum bolumlerin dis kabugu. */
export const sectionClass =
  "brand-body bg-[var(--brand-surface)] text-[var(--brand-ink)]";

/** Hero gorseli yoksa kullanilan yerel SVG. */
export const HERO_FALLBACK = "/placeholders/hero.svg";
